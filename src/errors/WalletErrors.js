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

class InvalidTransactionTypeError extends AppError {
  constructor(transactionType, validTypes) {
    super(
      `Invalid transaction type: '${transactionType}'. Must be one of: ${validTypes.join(", ")}`,
      400,
    );
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
  InvalidTransactionTypeError,
  BalanceLimitError,
};
