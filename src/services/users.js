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

module.exports = { validateUserId, validateUserExists };
