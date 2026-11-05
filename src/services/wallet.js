const pool = require("../db/pool");

const {
  InvalidAmountError,
  InsufficientBalanceError,
  InvalidTransactionTypeError,
} = require("../errors/WalletErrors");

const { validateUserId, validateUserExists } = require("./users");
const TransactionType = Object.freeze({
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BET: "bet",
  PAYOUT: "payout",
  REFUND: "refund",
});

async function getUserBalance(userId, client = pool) {
  await validateUserExists(userId, client);

  let result = await client.query(
    "SELECT balance_cents FROM users WHERE id = $1",
    [userId],
  );

  return result.rows[0].balance_cents;
}

async function getUserBalanceForUpdate(userId, client = pool) {
  await validateUserExists(userId, client);
  let result = await client.query(
    "SELECT balance_cents FROM users WHERE id = $1 FOR UPDATE",
    [userId],
  );

  return result.rows[0].balance_cents;
}

async function getUserTransactions(userId, client = pool) {
  await validateUserExists(userId, client);

  let result = await client.query(
    "SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC, id DESC",
    [userId],
  );

  return result.rows;
}

async function depositMoney(userId, amountCents, stripeSessionId = null) {
  // TO DO: Limit to a maximum deposit amount in a 24 hour interval
  validateAmount(amountCents);
  return applyBalanceChange(userId, amountCents, TransactionType.DEPOSIT, {
    stripeSessionId,
  });
}

async function withdrawMoney(userId, amountCents) {
  validateAmount(amountCents);
  return applyBalanceChange(userId, -amountCents, TransactionType.WITHDRAW);
}

async function chargeBet(userId, betId, amountCents) {
  validateAmount(amountCents);
  return applyBalanceChange(userId, -amountCents, TransactionType.BET, {
    betId,
  });
}

async function processPayout(userId, betId, amountCents) {
  validateAmount(amountCents);
  return applyBalanceChange(userId, amountCents, TransactionType.PAYOUT, {
    betId,
  });
}

async function processRefund(userId, betId, amountCents) {
  validateAmount(amountCents);
  return applyBalanceChange(userId, amountCents, TransactionType.REFUND, {
    betId,
  });
}

async function applyBalanceChange(
  userId,
  signedAmountCents,
  transactionType,
  { stripeSessionId = null, betId = null } = {},
) {
  validateUserId(userId);

  let client = await pool.connect();

  try {
    // starts a database transaction
    await client.query("BEGIN");
    let currentBalance = await getUserBalanceForUpdate(userId, client);

    if (stripeSessionId !== null) {
      let existing = await client.query(
        `SELECT 1 FROM wallet_transactions WHERE stripe_session_id = $1`,
        [stripeSessionId],
      );
      if (existing.rows.length > 0) {
        await client.query("COMMIT");
        return currentBalance;
      }
    }

    let newBalance = currentBalance + signedAmountCents;

    if (newBalance < 0) {
      throw new InsufficientBalanceError();
    }

    await updateBalance(userId, newBalance, client);
    await recordTransaction(
      client,
      userId,
      transactionType,
      signedAmountCents,
      newBalance,
      stripeSessionId,
      betId,
    );

    // Saves changes
    await client.query("COMMIT");
    return newBalance;
  } catch (error) {
    // if any errors, roll back changes
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function recordTransaction(
  client,
  userId,
  transactionType,
  amountCents,
  newBalance,
  stripeSessionId = null,
  betId = null,
) {
  let validTypes = Object.values(TransactionType);
  if (!validTypes.includes(transactionType)) {
    throw new InvalidTransactionTypeError(transactionType, validTypes);
  }

  await client.query(
    `INSERT INTO wallet_transactions (user_id, transaction_type, amount_cents, balance_after_cents, stripe_session_id, bet_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, transactionType, amountCents, newBalance, stripeSessionId, betId],
  );
}

async function updateBalance(userId, newBalance, client = pool) {
  await client.query("UPDATE users SET balance_cents = $1 WHERE id = $2", [
    newBalance,
    userId,
  ]);
  return newBalance;
}

function validateAmount(amountCents) {
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new InvalidAmountError(amountCents);
  }
}

module.exports = {
  getUserBalance,
  getUserTransactions,
  depositMoney,
  withdrawMoney,
  chargeBet,
  processPayout,
  processRefund,
};
