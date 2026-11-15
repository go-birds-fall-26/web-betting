const pool = require("../db/pool");
const { SessionNotFoundError } = require("../errors/userSessionErrors");

async function createUserSession(userId, token, client = pool) {
    let result = await client.query(
        "INSERT INTO user_sessions (user_id, token) VALUES ($1, $2) RETURNING id",
        [userId, token],
    )

    console.log("Created New Session with ID: ", result.rows[0].id);
}

async function getUserSession(token, client = pool) {
    let result = await client.query(
        "SELECT id, user_id FROM user_sessions WHERE token = $1",
        [token],
    );

    if (result.rows.length === 0) {
        throw new SessionNotFoundError();
    }

    return result.rows[0];
}

async function deleteUserSession(token, client = pool) {
    let result = await client.query(
        "DELETE FROM user_sessions where token = $1 RETURNING id",
        [token],
    )

    console.log("Deleted Session with ID: ", result.rows[0].id);
}

module.exports = { createUserSession, getUserSession, deleteUserSession };
