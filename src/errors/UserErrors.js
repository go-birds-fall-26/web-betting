const AppError = require("./AppError");

class InvalidUserError extends AppError {
  constructor() {
    super("Invalid user ID", 400);
  }
}

class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
  }
}

module.exports = {
  InvalidUserError,
  UserNotFoundError,
};
