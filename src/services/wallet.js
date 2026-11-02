const pool = require("../db/pool");

const {
  InvalidAmountError,
  InsufficientBalanceError,
  BalanceLimitError,
} = require("../errors/WalletErrors");

const { validateUserId, validateUserExists } = require("./users");

async function getUserBalance(userId, client = pool) {
  await validateUserExists(userId);

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

// Deposit money to a users balance and update wallet_transactions
async function depositMoney(userId, amountCents, stripeSessionId = null) {
  // TO DO: Limit to a maximum deposit amount in a 24 hour interval
  validateUserId(userId);
  validateAmount(amountCents);

  let client = await pool.connect();

  try {
    // Starts a database transaction (rolls back if something fails)
    await client.query("BEGIN");
    let currentBalance = await getUserBalance(userId, client);
    let newBalance = currentBalance + amountCents;

    await updateBalance(userId, newBalance, client);
    await recordTransaction(
      client,
      userId,
      "deposit",
      amountCents,
      newBalance,
      stripeSessionId,
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

// Withdraw money from a users account and return their new balance
async function withdrawMoney(userId, amountCents, stripeSessionId = null) {
  // Valiadte withdraw amount is valid
  validateUserId(userId);
  validateAmount(amountCents);

  let client = await pool.connect();

  try {
    await client.query("BEGIN");

    let currentBalance = await getUserBalance(userId, client);
    if (amountCents > currentBalance) {
      throw new InsufficientBalanceError();
    }
    let newBalance = Math.max(0, currentBalance - amountCents);
    await updateBalance(userId, newBalance, client);
    await recordTransaction(
      client,
      userId,
      "withdraw",
      amountCents,
      newBalance,
      stripeSessionId,
    );

    await client.query("COMMIT");
    return newBalance;
  } catch (error) {
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
) {
  await client.query(
    `INSERT INTO wallet_transactions (user_id, transaction_type, amount_cents, balance_after_cents, stripe_session_id)
        VALUES ($1, $2, $3, $4, $5)`,
    [userId, transactionType, amountCents, newBalance, stripeSessionId],
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
    throw new InvalidAmountError();
  }
}

module.exports = {
  getUserBalance,
  getUserTransactions,
  depositMoney,
  withdrawMoney,
};
