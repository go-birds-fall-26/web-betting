require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const router = require("./src/routes");
const stripeWebhookRouter = require("./src/routes/stripeWebhook");
const { requestAuthorizer } = require("./src/middleware/requestAuth");
const { startJobs } = require("./src/jobs");
const app = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("view engine", "ejs");
app.locals.title = "web-betting";

if (process.env.STRIPE_ENABLED === "true") {
  app.use("/webhooks/stripe", stripeWebhookRouter);
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(requestAuthorizer);
app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  startJobs();
});
