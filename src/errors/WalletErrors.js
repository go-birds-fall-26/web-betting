const AppError = require("./AppError");

class InvalidAmountError extends AppError {
  constructor(amount) {
    super(`Amount: ${amount}  must be a positive number`, 400);
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

class DepositLimitExceededError extends AppError {
  constructor() {
    super("Maximum deposit limit of $20,000 reached for 24 hour window.", 400);
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
  DepositLimitExceededError,
  BalanceLimitError,
};
