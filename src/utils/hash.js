const argon2 = require('argon2');
const AppError = require('../errors/AppError');

async function hash(password) {
  let hashedString;

  try {
    hashedString = await argon2.hash(password);
  } catch (error) {
    throw new AppError(error);
  }

  return hashedString;
}

async function verify(passwordHash, password) {
  let isValid;

  try {
    isValid = await argon2.verify(passwordHash, password);
  } catch (error) {
    throw new AppError(error);
  }

  return isValid;
}

module.exports = { hash, verify };
