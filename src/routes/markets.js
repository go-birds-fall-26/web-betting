const router = require("express").Router();
const { getUpcomingEvents } = require("../services/events");

router.get("/", async (req, res) => {
    try {
        let events = await getUpcomingEvents();
        res.render("markets", { title: "Markets", events});
    } catch (error) {
        console.error("Failed to load markets:", error);
        res.status(500).send("Could not load markets");
    }
});

module.exports = router;
