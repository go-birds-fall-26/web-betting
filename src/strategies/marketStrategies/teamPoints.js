// Determine if team X scored atleast threshold amount of points
const AppError = require("../../errors/AppError");

function validateMarket(event, market) {
  const { teamId, threshold } = market.params;

  if (!teamId || !Number.isFinite(threshold)) {
    throw new AppError("Invalid team points parameters");
  }

  const validTeams = [event.home_team_id, event.away_team_id];

  if (!validTeams.includes(teamId)) {
    throw new AppError("Team must belong to the event");
  }
}

// Will be implemented later on once game event scores are synced to db
function determineOutcome(event, market, gameResult) {}

module.exports = {
  validateMarket,
  determineOutcome,
};
