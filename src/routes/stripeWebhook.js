const router = require("express").Router();
const express = require("express");
const stripe = require("../services/stripe");
const { depositMoney } = require("../services/wallet");
const AppError = require("../errors/AppError");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    // Verify stripe actually sent this event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      console.error("Invalid Stripe webhook:", error.message);
      return res.sendStatus(400);
    }

    // Only handle completed checkout sessions
    if (event.type !== "checkout.session.completed") {
      return res.sendStatus(200);
    }

    // Only handle successful payments
    let session = event.data.object;
    if (session.payment_status !== "paid") {
      return res.sendStatus(200);
    }

    // Deposit the actual money
    try {
      let userId = Number(session.metadata?.userId);
      let amountCents = session.amount_total;
      await depositMoney(userId, amountCents, session.id);
      console.log(`Stripe deposit completed: ${session.id}`);
      return res.sendStatus(200);
    } catch (error) {
      // Permanent app errors (bad input won't change on retry)
      if (error instanceof AppError) {
        console.error("Stripe deposit rejected:", session.id, error.message);
        return res.sendStatus(200);
      }
      console.log("Failed to process Stripe deposit:", error);
      return res.sendStatus(500);
    }
  },
);

module.exports = router;
