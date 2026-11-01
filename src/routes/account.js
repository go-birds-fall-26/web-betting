const router = require("express").Router();
const { depositMoney } = require("../services/wallet");

router.get("/", (req, res) => {
  res.render("account", { title: "Account" });
});

router.post("/deposit", async (req, res) => {
  let userId = Number(req.body.userId);
  let amountCents = Number(req.body.amountCents);

  // Deposit amount validation
  // TO DO: Limit to a maximum deposit amount in a 24 hour interval
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return res.status(400).json({
      error: "Deposit must be greater than 0",
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

module.exports = router;
