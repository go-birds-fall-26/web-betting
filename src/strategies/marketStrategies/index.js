const homeWins = require("./homeWins");

const strategies = {
  home_wins: homeWins,
};

function getMarketStrategy(strategyName) {
  let strategy = strategies[strategyName];
  if (!strategy) {
    throw new Error(`Unsupported market strategy name ${strategyName}`);
  }
  return strategy;
}

module.exports = { getMarketStrategy };
