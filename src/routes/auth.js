const crypto = require('node:crypto');
const router = require('express').Router();

const { 
  createUser, 
  getUserCredentialsByEmail
} = require('../services/users');

const { createUserSession, deleteUserSession } = require('../services/userSessions');

const { hash, verify } = require('../utils/hash');
const { InvalidCredentialsError, EmailAlreadyTakenError } = require('../errors/UserErrors');

let cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Log in' });
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

router.get('/logout', (req, res) => {
  res.redirect(303, '/');
});

router.post('/login', async (req, res) => {
  if (
    !req.body ||
    typeof req.body.email !== "string" || 
    typeof req.body.password !== "string"
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    let email = req.body.email.toLowerCase(); // emails are case-insensitive
    let password = req.body.password;
    let userId = await validateLoginCredentials(email, password);

    let token = makeToken();
    await createUserSession(userId, token); // store token in our backend
    return res.cookie("token", token, cookieOptions).redirect(303, '/'); // pass token to user's browser

  } catch (error) {

    if (error instanceof InvalidCredentialsError) {
      return res.status(error.statusCode).json({ 
        error: error.message
      });
    }

    console.error("Unexpected error occurred during login: ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post('/register', async (req, res) => {
  if (
    !req.body ||
    typeof req.body.first_name !== "string" ||
    typeof req.body.last_name !== "string" ||
    typeof req.body.email !== "string" || 
    typeof req.body.password !== "string"
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let email = req.body.email.toLowerCase(); // emails are case-insensitive
    let passwordHash = await hash(req.body.password);
    let userId = await createUser(firstName, lastName, email, passwordHash);

    let token = makeToken();
    await createUserSession(userId, token);
    return res.cookie("token", token, cookieOptions).redirect(303, '/');

  } catch (error) {
    
    if (error instanceof EmailAlreadyTakenError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    console.error("Unexpected error occurred during registration: ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    let { token } = req.cookies;
    if (token !== undefined) {
      await deleteUserSession(token); // delete token from our backend
    }
    return res.clearCookie("token", cookieOptions).redirect(303, '/'); // let browser know token is expired

  } catch (error) {
    
    console.error("Unexpected error occurred during logout: ", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;

async function validateLoginCredentials(email, password) {
  let storedCredentials = await getUserCredentialsByEmail(email);
  let isValid = await verify(storedCredentials.password_hash, password);

  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  return storedCredentials.id;
}

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}
