const AppError = require("./AppError");

class InvalidUserError extends AppError {
  constructor() {
    super("Invalid user ID", 400);
  }
}

class UserNotFoundError extends AppError {
  constructor(userId) {
    super(`User ID = ${userId} not found`, 404);
  }
}

class EmailAlreadyTakenError extends AppError {
  constructor() {
    super("Email already taken", 409);
  }
}

class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid email or password", 401);
  }
}

module.exports = {
  InvalidUserError,
  UserNotFoundError,
  EmailAlreadyTakenError,
  InvalidCredentialsError,
};
