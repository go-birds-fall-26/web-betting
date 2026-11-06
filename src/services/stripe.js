const Stripe = require("stripe");
const stripe =
  process.env.STRIPE_ENABLED === "true"
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

module.exports = stripe;
