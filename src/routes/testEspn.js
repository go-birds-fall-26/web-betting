const router = require("express").Router();
const path = require("node:path");
const fs = require("node:fs/promises");
const validator = require("validator");

const EventCategories = Object.freeze({
  GAME_WINNERS: "game-winners",
});
const ValidCategories = new Set(Object.values(EventCategories));

router.get("/game-winners", async (req, res) => {
  let { event } = req.query;

  if (typeof event !== "string" || !validator.isInt(event)) {
    return res.status(400).json({
      error: "Event ID must be a positive integer",
    });
  }

  let filePath = path.join(
    __dirname,
    "../test/fixtures/espn/game-winners",
    `${event}.json`,
  );
  try {
    let contents = await fs.readFile(filePath, "utf8");
    let data = JSON.parse(contents);
    return res.json(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Event not found" });
    }

    console.error("Failed to load fake ESPN data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/scenarios", async (req, res) => {
  let { category } = req.query;
  let isValid =
    typeof category === "string" &&
    validator.isAlpha(category, "en-US", { ignore: "-" }) &&
    ValidCategories.has(category);

  if (!isValid) {
    return res.status(400).json({
      error: `Invalid Category. Must be one of : ${[...ValidCategories].join(",")} `,
    });
  }
  let filePath = path.join(
    __dirname,
    "../test/fixtures/espn/scenarios",
    `${category}.json`,
  );
  try {
    let contents = await fs.readFile(filePath, "utf8");
    let data = JSON.parse(contents);
    return res.json(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "File not found" });
    }

    console.error("Failed to load scenario data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
