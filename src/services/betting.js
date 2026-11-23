const pool = require("../db/pool");
const { getMarketStrategy } = require("../strategies/marketStrategies");
const { chargeBet } = require("./wallet");
const { BetSide } = require("./markets");
const { getYesPriceCents, getNoPriceCents, getFeeCents } = require("./pricing");
const AppError = require("../errors/AppError");

const ValidBetSides = new Set(Object.values(BetSide));

async function buyContracts(userId, marketId, side, quantity) {
  validateInputs(userId, marketId, side, quantity);
  let client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get the market and event
    let market = await getMarket(client, marketId);
    let event = {
      home_team_id: market.home_team_id,
      away_team_id: market.away_team_id,
      status: market.event_status,
    };

    // Use strategy based on market template (home_wins, team_points, game_total etc...)
    let strategy = getMarketStrategy(market.template);
    strategy.validateMarket(event, market);

    // Get single contract price, fee price, and total cost
    let priceCents =
      side === BetSide.YES
        ? getYesPriceCents(market.yes_count, market.no_count)
        : getNoPriceCents(market.yes_count, market.no_count);
    let feeCents = getFeeCents(quantity, priceCents);
    let totalCents = priceCents * quantity + feeCents;

    // Insert Bet
    let bet = await insertBet(
      client,
      userId,
      marketId,
      side,
      quantity,
      priceCents,
      feeCents,
    );

    await updateMarketCounts(client, marketId, side, quantity);
    await chargeBet(userId, bet.id, totalCents, client);

    await client.query("COMMIT");
    return bet;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function validateInputs(userId, marketId, side, quantity) {
  // Validate inputs
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new AppError("Invalid user ID");
  }
  if (!Number.isSafeInteger(marketId) || marketId <= 0) {
    throw new AppError("MarketId must be a positive integer");
  }
  if (typeof side !== "string" || !ValidBetSides.has(side)) {
    throw new AppError("Side must be either 'yes' or 'no'");
  }
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new AppError("Quantity must be a positive integer");
  }
}

function validateMarket(market) {
  if (market.status !== "open") {
    throw new AppError("Market is not open");
  }

  if (market.event_status === "final" || market.event_status === "cancelled") {
    throw new AppError("Cannot bet on a completed or cancelled event");
  }
}

async function getMarket(client, marketId) {
  let marketLockResult = await client.query(
    `SELECT
            m.*,
            e.home_team_id,
            e.away_team_id,
            e.status AS event_status
        FROM markets m
        JOIN events e ON e.id = m.event_id
        WHERE m.id = $1
        FOR UPDATE OF m;
      `,
    [marketId],
  );
  if (marketLockResult.rows.length === 0) {
    throw new AppError("Market not Found");
  }

  let market = marketLockResult.rows[0];
  validateMarket(market);
  return market;
}

async function insertBet(
  client,
  userId,
  marketId,
  side,
  quantity,
  priceCents,
  feeCents,
) {
  let betResult = await client.query(
    `INSERT INTO bets
    (user_id, market_id, side, quantity, price_cents, fee_cents)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
    [userId, marketId, side, quantity, priceCents, feeCents],
  );

  return betResult.rows[0];
}

async function updateMarketCounts(client, marketId, side, quantity) {
  await client.query(
    `UPDATE markets
     SET
       yes_count = yes_count + CASE WHEN $2 = 'yes' THEN $3 ELSE 0 END,
       no_count = no_count + CASE WHEN $2 = 'no' THEN $3 ELSE 0 END
     WHERE id = $1`,
    [marketId, side, quantity],
  );
}

module.exports = { BetSide, buyContracts };
