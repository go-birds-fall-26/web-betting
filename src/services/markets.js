const pool = require("../db/pool");

async function ensureDefaultMarket(eventId, client = pool) {
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error("Invalid event ID");
  }

  // Look up the event in the events table
  let result = await client.query(
    `SELECT e.id, h.name AS home_name, a.name AS away_name 
        FROM events e 
        JOIN teams h on h.id = e.home_team_id 
        JOIN teams a on a.id = e.away_team_id
        WHERE e.id = $1`,
    [eventId],
  );

  if (result.rows.length === 0) {
    throw new Error(`Event ${eventId} not found`);
  }
  let event = result.rows[0];
  // Form the question: Will the Home Team beat the Away team
  let question = `Will the ${event.home_name} beat the ${event.away_name}?`;

  // Create the market, template = home_wins
  let insertResult = await client.query(
    `INSERT INTO markets (event_id, created_by, question, template, params)
    VALUES ($1, NULL, $2, $3, $4) 
    ON CONFLICT (event_id, template) DO NOTHING
    RETURNING *`,
    [event.id, question, "home_wins", {}],
  );

  // if market is already created, return the existing market instead.
  if (insertResult.rows.length === 0) {
    let existingMarket = await client.query(
      `SELECT * FROM markets
          WHERE event_id = $1 AND template = $2`,
      [event.id, "home_wins"],
    );

    return existingMarket.rows[0];
  }

  return insertResult.rows[0];
}

module.exports = { ensureDefaultMarket };
