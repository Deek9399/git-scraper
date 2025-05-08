const express = require("express");
const router = express.Router();
const { fetchSingleDependencyTree } = require("../scrapers/scrapeRecursive");

router.get("/", async (req, res) => {
  const { url, depth } = req.query;

  if (!url || !depth) {
    return res.status(400).json({ error: "Missing url or depth parameter" });
  }

  try {
    const data = await fetchSingleDependencyTree(decodeURIComponent(url), parseInt(depth));
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching child dependencies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
