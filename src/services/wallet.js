const pool = require("../db/pool");

async function getUserBalance(userId) {
  let client = await pool.connect();
  try {
    // Lock the users row so another transaction can't modify that balance
    let result = await client.query(
      "SELECT balance_cents FROM users WHERE id = $1 FOR UPDATE",
      [userId],
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0].balance_cents;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

// Deposit money to a users balance and update wallet_transactions
async function depositMoney(userId, amountCents, stripeSessionId = null) {
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new Error("Deposit amount must be a positive integer");
  }

  let client = await pool.connect();

  try {
    // Starts a database transaction (rolls back if something fails)
    await client.query("BEGIN");
    let currentBalance = await getUserBalance(userId);
    let newBalance = currentBalance + amountCents;
    // Update the users balance
    await client.query("UPDATE users SET balance_cents = $1 WHERE id = $2", [
      newBalance,
      userId,
    ]);
    // Record transaction
    await client.query(
      `INSERT INTO wallet_transactions (user_id, transaction_type, amount_cents, balance_after_cents, stripe_session_id)
        VALUES ($1, $2, $3, $4, $5)`,
      [userId, "deposit", amountCents, newBalance, stripeSessionId],
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
async function withdrawMoney(userId, amountCents) {
  // Valiadte withdraw amount is valid
  let currentBalance = await getUserBalance(userId);

  if (!Number.isSafeInteger(amountCents)) {
    throw new Error("Withdraw amount must be a positive integer");
  }

  if (amountCents > currentBalance) {
    throw new Error(
      `Withdraw amount must be less than current balance: ${currentBalance}`,
    );
  }

  // Create db connection, atomic and withdraw balance
  let client = await pool.connect();
  try {
    await client.query("BEGIN");
    let newBalance = Math.max(0, currentBalance - amountCents);
    // Set new balance after withdraw
    await client.query("UPDATE users SET balance_cents = $1 WHERE id = $2", [
      newBalance,
      userId,
    ]);

    // Record transaction
    await client.query(
      `INSERT INTO wallet_transactions (user_id, transaction_type, amount_cents, balance_after_cents, stripe_session_id)
        VALUES ($1, $2, $3, $4, $5)`,
      [userId, "withdrawl", amountCents, newBalance, null],
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

module.exports = { getUserBalance, depositMoney, withdrawMoney };
