const pool = require("../db/pool");
const { 
  InvalidUserError, 
  UserNotFoundError,
  EmailAlreadyTakenError,
  InvalidCredentialsError,
} = require("../errors/UserErrors");

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

async function getUserCredentialsByEmail(email, client = pool) {
  let result = await client.query(
    "SELECT password_hash FROM users WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    throw new InvalidCredentialsError();
  }

  return result.rows[0];
}

async function createUser(firstName, lastName, email, passwordHash, client = pool) {
  try {
    let result = await client.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
      [firstName, lastName, email, passwordHash],
    );

    let userId = result.rows[0].id;
    console.log("Created New User with ID:", userId);
  } catch (error) {
    if (error.code === "23505") { // Unique violation code returned from Postgres
      throw new EmailAlreadyTakenError();
    }
    throw error;
  }
}

module.exports = { validateUserId, validateUserExists, getUserInformation, getUserCredentialsByEmail, createUser };
