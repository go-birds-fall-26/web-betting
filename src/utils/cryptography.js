const argon2 = require('argon2');

// TODO: validate input to hash is a string

async function hash(password) {
  let hashedString;

  try {
    hashedString = await argon2.hash(password);
  } catch (error) {
    console.error(error); // TODO: Handle argon2 error appropriately
  }

  return hashedString;
}

async function verify(passwordHash, password) {
  let isValid;

  try {
    isValid = await argon2.verify(passwordHash, password);
  } catch (error) {
    console.error(error); // TODO: Handle argon2 error appropriately
  }

  return isValid;
}

module.exports = { hash, verify };
