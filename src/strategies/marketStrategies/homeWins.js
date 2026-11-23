// Determine if the home team won
const AppError = require("../../errors/AppError");

function validateMarket(event, market) {
  if (market.template !== "home_wins") {
    throw new AppError("Invalid market template");
  }

  if (!event.home_team_id || !event.away_team_id) {
    throw new AppError("Event must have both a home and away team");
  }

  if (event.home_team_id === event.away_team_id) {
    throw new AppError("Home and away teams cannot be the same");
  }

  if (
    !market.params ||
    typeof market.params !== "object" ||
    Array.isArray(market.params) ||
    Object.keys(market.params).length !== 0
  ) {
    throw new AppError("Invalid home-win market parameters");
  }
}

// Will be implemented later on once game event scores are synced to db
function determineOutcome(event, market, gameResult) {}

module.exports = {
  validateMarket,
  determineOutcome,
};
