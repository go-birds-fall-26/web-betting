const router = require("express").Router();
const stripe = require("../services/stripe");

const {
  depositMoney,
  withdrawMoney,
  getUserTransactions,
  validateDepositAmount,
} = require("../services/wallet");

const AppError = require("../errors/AppError");
const { getUserInformation } = require("../services/users");
const { getAmountCents, formatAmountCents } = require("../utils/money");

const PLACEHOLDER_PORTFOLIO = {
  summary: { inPositionsCents: 31200, profitCents: 18600, winRate: 58 },
  valueHistory: [
    { time: "2024-10-01", value: 1000 },
    { time: "2024-10-02", value: 1012 },
    { time: "2024-10-03", value: 995 },
    { time: "2024-10-04", value: 1040 },
    { time: "2024-10-05", value: 1105 },
    { time: "2024-10-06", value: 1080 },
    { time: "2024-10-07", value: 1186 },
  ],
  tabs: [
    {
      id: "open",
      name: "Open",
      positions: [
        { event: "Home Team wins", side: "Yes", contracts: 10, avgPriceCents: 62, profitCents: 40 },
        { event: "Away Team wins", side: "No", contracts: 25, avgPriceCents: 70, profitCents: -75 },
      ],
    },
    {
      id: "won",
      name: "Won",
      positions: [
        { event: "Home Team wins", side: "Yes", contracts: 20, avgPriceCents: 48, profitCents: 1040 },
      ],
    },
    {
      id: "lost",
      name: "Lost",
      positions: [
        { event: "Away Team wins", side: "Yes", contracts: 15, avgPriceCents: 55, profitCents: -825 },
      ],
    },
    {
      id: "cashed-out",
      name: "Cashed out",
      positions: [],
    },
  ],
};

router.get("/", async (req, res) => {
  try {
    // TO DO: Swap to req.session.userId once a user is logged in
    let userId = Number(process.env.DEV_USER_ID);
    let user = await getUserInformation(userId);
    let transactions = await getUserTransactions(userId);

    res.render("account", {
      title: "Account",
      user,
      transactions,
      portfolio: PLACEHOLDER_PORTFOLIO,
      formatAmountCents,
    });
  } catch (error) {
    handleWalletError(res, error);
  }
});

router.post("/deposit", async (req, res) => {
  try {
    let userId = getUserId(req);
    let amountCents = getAmountCents(req.body.amount);
    await validateDepositAmount(userId, amountCents);

    if (process.env.STRIPE_ENABLED !== "true") {
      let balance = await depositMoney(userId, amountCents);
      return res.redirect(303, "/account");
    }
    await useStripeCheckout(userId, amountCents, req, res);
  } catch (error) {
    return handleWalletError(res, error);
  }
});

router.post("/withdraw", async (req, res) => {
  try {
    let userId = getUserId(req);
    let amountCents = getAmountCents(req.body.amount);
    let balance = await withdrawMoney(userId, amountCents);
    return res.redirect(303, "/account");
  } catch (error) {
    return handleWalletError(res, error);
  }
});

function getUserId(req) {
  // TO DO: Swap to req.session.userId once a user is logged in
  return Number(req.body.userId || process.env.DEV_USER_ID);
}

function handleWalletError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  console.error("Unexpected Wallet error:", error);
  return res.status(500).json({
    error: "Internal server errror",
  });
}

async function useStripeCheckout(userId, amountCents, req, res) {
  let session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Web-Betting Test Credits",
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],

    metadata: {
      userId: String(userId),
    },

    success_url: `${process.env.APP_URL}/account?deposit=success`,
    cancel_url: `${process.env.APP_URL}/account?deposit=cancel`,
  });

  return res.redirect(303, session.url);
}

module.exports = router;
