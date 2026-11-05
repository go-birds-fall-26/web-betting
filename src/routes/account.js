const router = require("express").Router();
const stripe = require("../services/stripe");

const {
  depositMoney,
  getUserBalance,
  withdrawMoney,
  getUserTransactions,
} = require("../services/wallet");

const AppError = require("../errors/AppError");
const { getUserInformation, validateUserExists } = require("../services/users");
const { getAmountCents, formatAmountCents } = require("../utils/money");

router.get("/", async (req, res) => {
  try {
    // Swap to req.session.userId once a user is logged in
    let userId = Number(req.params.userId || process.env.DEV_USER_ID);
    let user = await getUserInformation(userId);
    let transactions = await getUserTransactions(userId);

    res.render("account", {
      title: "Account",
      user,
      transactions,
      formatAmountCents,
    });
  } catch (error) {
    handleWalletError(res, error);
  }
});

router.get("/balance/:userId", async (req, res) => {
  try {
    let userId = Number(req.params.userId);
    let balance = await getUserBalance(userId);
    return res.status(200).json({ balance });
  } catch (error) {
    return handleWalletError(res, error);
  }
});

router.get("/transactions/:userId", async (req, res) => {
  try {
    let userId = Number(req.params.userId || process.env.DEV_USER_ID);
    let transactions = await getUserTransactions(userId);
    return res.status(200).json({ transactions });
  } catch (error) {
    return handleWalletError(res, error);
  }
});

router.post("/deposit", async (req, res) => {
  try {
    let userId = getUserId(req);
    let amountCents = getAmountCents(req.body.amount);

    // Deposit without Stripe Payment Popup
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
