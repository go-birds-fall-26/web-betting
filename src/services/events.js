const pool = require("../db/pool");

async function getUpcomingEvents(client = pool) {
    let result = await client.query(
        "SELECT * FROM events ORDER BY start_time"
    );

    return result.rows;
}

module.exports = { getUpcomingEvents }
