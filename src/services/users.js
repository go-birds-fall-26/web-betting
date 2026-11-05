const pool = require("../db/pool");
const { InvalidUserError, UserNotFoundError } = require("../errors/UserErrors");

function validateUserId(userId) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new InvalidUserError();
  }
}

async function validateUserExists(userId, client = pool) {
  validateUserId(userId);

  let result = await client.query("SELECT id FROM users WHERE id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    throw new UserNotFoundError(userId);
  }
}

async function getUserInformation(userId, client = pool) {
  await validateUserExists(userId);
  let result = await client.query(
    "SELECT first_name, last_name, email, balance_cents FROM users WHERE id = $1",
    [userId],
  );

  return result.rows[0];
}

module.exports = { validateUserId, validateUserExists, getUserInformation };
