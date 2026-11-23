const router = require("express").Router();
const { getUpcomingEvents } = require("../services/events");
const { getUpcomingWeeks } = require("../services/games");
const AppError = require("../errors/AppError");
const { buyContracts } = require("../services/betting");

function listTeams(weeks) {
  let teams = new Map();

  for (let week of weeks) {
    for (let game of week.games) {
      teams.set(game.away.abbreviation, game.away.name);
      teams.set(game.home.abbreviation, game.home.name);
    }
  }

  return [...teams]
    .map(([abbreviation, name]) => ({ abbreviation, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

router.get("/", async (req, res) => {
  try {
    let weeks = await getUpcomingWeeks();
    res.render("markets/index", {
      title: "Markets",
      weeks,
      teams: listTeams(weeks),
    });
  } catch (error) {
    console.error("Failed to load markets:", error);
    res.status(500).send("Could not load markets");
  }
});

router.get("/new", async (req, res) => {
  try {
    let games = await getUpcomingEvents();
    res.render("markets", { title: "Market maker", games });
  } catch (error) {
    console.error("Failed to load market maker:", error);
    res.status(500).send("Could not load market maker");
  }
});

router.post("/buy", async (req, res) => {
  try {
    const { marketId, side, quantity } = req.body;
    let userId = req.session?.userId;
    let parsedMarketId = Number(marketId);
    let parsedQuantity = Number(quantity);

    // Buy Contracts
    let bet = await buyContracts(userId, parsedMarketId, side, parsedQuantity);
    return res.status(200).json({ ok: true, bet });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to purchase contracts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
