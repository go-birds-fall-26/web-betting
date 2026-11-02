const router = require("express").Router();
const {
  depositMoney,
  getUserBalance,
  withdrawMoney,
} = require("../services/wallet");

const AppError = require("../errors/AppError");

router.get("/", (req, res) => {
  res.render("account", { title: "Account" });
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

router.post("/deposit", async (req, res) => {
  try {
    let userId = Number(req.body.userId);
    let amountCents = Number(req.body.amountCents);

    // TODO: Stripe checkout + webhook that waits for payment validation

    let balance = await depositMoney(userId, amountCents);
    return res.status(200).json({
      message: "Deposit succesfull",
      newBalance: balance,
    });
  } catch (error) {
    return handleWalletError(res, error);
  }
});

router.post("/withdraw", async (req, res) => {
  try {
    let userId = Number(req.body.userId);
    let amountCents = Number(req.body.amountCents);
    let balance = await withdrawMoney(userId, amountCents);
    return res.status(200).json({
      message: "Withdraw succesfull",
      newBalance: balance,
    });
  } catch (error) {
    return handleWalletError(res, error);
  }
});

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

module.exports = router;
