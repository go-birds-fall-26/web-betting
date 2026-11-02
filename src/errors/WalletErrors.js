const AppError = require("./AppError");

class InvalidAmountError extends AppError {
  constructor() {
    super("Amount must be a positive integer", 400);
  }
}

class InsufficientBalanceError extends AppError {
  constructor() {
    super("Insufficient balance", 400);
  }
}

class BalanceLimitError extends AppError {
  constructor() {
    super("Balance exceeds maximum allowed", 400);
  }
}

module.exports = {
  InvalidAmountError,
  InsufficientBalanceError,
  BalanceLimitError,
};
