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

module.exports = {
  InvalidUserError,
  UserNotFoundError,
};
