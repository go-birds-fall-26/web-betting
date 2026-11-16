const pool = require("../db/pool");

async function getUpcomingEvents(client = pool) {
    let result = await client.query(
        `SELECT e.*,
                h.location AS home_location, h.name AS home_name, h.abbreviation AS home_abbreviation,
                h.logo_url AS home_logo, h.color AS home_color, h.alternate_color AS home_alternate_color,
                a.location AS away_location, a.name AS away_name, a.abbreviation AS away_abbreviation,
                a.logo_url AS away_logo, a.color AS away_color, a.alternate_color AS away_alternate_color
         FROM events e
         JOIN teams h ON h.id = e.home_team_id
         JOIN teams a ON a.id = e.away_team_id
         WHERE e.status IN ('scheduled', 'in_progress')
         ORDER BY e.season_type, e.week, e.start_time`
    );

    return result.rows;
}

module.exports = { getUpcomingEvents }
