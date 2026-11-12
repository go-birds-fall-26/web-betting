const router = require("express").Router();
const path = require("node:path");
const fs = require("node:fs/promises");
const validator = require("validator");

const TestDir = path.join(__dirname, "../test/mocks/espn");

router.get("/summary", (req, res) => {
  let { event } = req.query;
  if (typeof event !== "string" || !validator.isInt(event)) {
    return res.status(400).json({
      error: "Event ID must be a positive integer",
    });
  }

  let filePath = path.join(TestDir, "summary", `${event}.json`);
  return sendFile(res, filePath);
});

router.get("/scenarios", (req, res) => {
  let filePath = path.join(TestDir, "scenarios", `summary.json`);
  return sendFile(res, filePath);
});

async function sendFile(res, filePath) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return res.json(JSON.parse(contents));
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Mock file not found" });
    }

    console.error("Failed to load mock ESPN data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = router;
