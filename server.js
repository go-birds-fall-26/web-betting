require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const router = require("./src/routes");
const { startJobs } = require("./src/jobs");
const stripeWebhookRouter = require("./src/routes/stripeWebhook");
const { getUserSession } = require("./src/services/userSessions");
const { SessionNotFoundError } = require("./src/errors/userSessionErrors");
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

// TODO: move this to a middleware file
app.use(async (req, res, next) => {
  let { token } = req.cookies;

  // user is already logged in
  if (token !== undefined) {
    try {
      let session = await getUserSession(token);

      req.session = {
        id: session.id,
        userId: session.user_id,
      };
    } catch (error) {
      if (error instanceof SessionNotFoundError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      } else {
        console.error("Unexpected error occurred while fetching user session: ", error);
        return res.status(500).json({
          error: "Internal server error"
        });
      }
    }
  }

  res.locals.isLoggedIn = Boolean(req.session && req.session.userId);
  next();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  startJobs();
});
