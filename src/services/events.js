const pool = require("../db/pool");

async function getUpcomingEvents(client = pool) {
    let result = await client.query(
        "SELECT * FROM events ORDER BY start_time"
    );

    return result.rows;
}

// creates an event in the events DB. if the event already exists in the DB, we update it
async function upsertEvent(event, client = pool) {
    const values = [
        event.espn_game_id, event.season_type, event.week,
        event.home_team_id, event.away_team_id, event.start_time,
        event.status, event.home_score, event.away_score,
        event.winner_team_id
    ];

    const result = await client.query(
        `INSERT INTO events (
            espn_game_id, season_type, week,
            home_team_id, away_team_id, start_time,
            status, home_score, away_score, winner_team_id,
            last_synced_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        ON CONFLICT (espn_game_id) DO UPDATE SET
            season_type = EXCLUDED.season_type,
            week = EXCLUDED.week,
            home_team_id = EXCLUDED.home_team_id,
            away_team_id = EXCLUDED.away_team_id,
            start_time = EXCLUDED.start_time,
            status = EXCLUDED.status,
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score,
            winner_team_id = EXCLUDED.winner_team_id,
            last_synced_at = NOW()
        RETURNING *`,
        values
    );

    return result.rows[0];
}

module.exports = { getUpcomingEvents, upsertEvent }
