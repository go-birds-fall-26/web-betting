const router = require('express').Router();

const { 
  createUser, 
  getUserCredentialsByEmail
} = require('../services/users');

const { hash, verify } = require('../utils/cryptography');
const { InvalidCredentialsError, EmailAlreadyTakenError } = require('../errors/UserErrors');

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Log in' });
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' });
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
    let email = req.body.email; // TODO: make case-insensitive
    let password = req.body.password;
    await validateLoginCredentials(email, password);
    return res.redirect('/');

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
    let email = req.body.email; // TODO: make case-insensitive
    let passwordHash = await hash(req.body.password);

    await createUser(firstName, lastName, email, passwordHash);
    return res.redirect('/');

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

module.exports = router;

async function validateLoginCredentials(email, password) {
  let storedCredentials = await getUserCredentialsByEmail(email);
  let isValid = await verify(storedCredentials.password_hash, password);

  if (!isValid) {
    throw new InvalidCredentialsError();
  }
}
