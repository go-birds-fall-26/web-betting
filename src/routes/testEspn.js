const router = require("express").Router();
const path = require("node:path");
const fs = require("node:fs/promises");

router.get("/summary", async (req, res) => {
  let { event } = req.query;

  if (typeof event !== "string" || !/^[1-9]\d*$/.test(event)) {
    return res.status(400).json({
      error: "Event ID must be a positive integer",
    });
  }

  let filePath = path.join(
    __dirname,
    "../test/fixtures/espn/summary",
    `${event}.json`,
  );
  try {
    let contents = await fs.readFile(filePath, "utf8");
    let data = JSON.parse(contents);
    return res.json(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Game not found" });
    }

    console.error("Failed to load fake ESPN data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
