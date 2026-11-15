const AppError = require("./AppError");

class SessionNotFoundError extends AppError {
    constructor() {
        super("Unauthorized user", 401);
    }
}

module.exports = { SessionNotFoundError };
