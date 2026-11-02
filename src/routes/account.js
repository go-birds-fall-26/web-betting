const router = require("express").Router();
const {
  depositMoney,
  getUserBalance,
  withdrawMoney,
} = require("../services/wallet");

router.get("/", (req, res) => {
  res.render("account", { title: "Account" });
});

router.get("/balance/:userId", async (req, res) => {
  let userId = Number(req.params.userId);
  try {
    let balance = await getUserBalance(userId);
    return res.status(200).json({
      balance: balance,
    });
  } catch (error) {
    console.error("Get Balance Failed:", error);
    return res.status(500).json({
      error: "Failed to get balance",
    });
  }
});

router.post("/deposit", async (req, res) => {
  let userId = Number(req.body.userId);
  let amountCents = Number(req.body.amountCents);

  // Deposit amount validation
  // TO DO: Limit to a maximum deposit amount in a 24 hour interval
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return res.status(400).json({
      error: "Deposit amount must be greater than 0",
    });
  }
  try {
    // TODO: Stripe checkout + webhook that waits for payment validation
    await depositMoney(userId, amountCents);
    return res.status(200).json({
      message: "Deposit succesfull",
    });
  } catch (error) {
    console.error("Deposit Failed:", error);
    return res.status(500).json({
      error: "Failed to deposit money",
    });
  }
});

router.post("/withdraw", async (req, res) => {
  let userId = Number(req.body.userId);
  let amountCents = Number(req.body.amountCents);

  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return res.status(400).json({
      error: "Withdraw amount must be greater than 0",
    });
  }
  let currentBalance = await getUserBalance(userId);
  if (amountCents > currentBalance) {
    return res.status(400).json({
      error: "Withdraw amount must be less than currentBalance",
    });
  }

  try {
    await withdrawMoney(userId, amountCents);
    return res.status(200).json({
      message: "Withdraw succesfull",
    });
  } catch (error) {
    console.error("Withdraw failed:", error);
    return res.status(500).json({
      error: "Failed to withdraw money",
    });
  }
});

module.exports = router;
