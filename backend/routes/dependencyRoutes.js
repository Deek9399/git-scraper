const express = require('express');
const { getDependencies } = require('../controllers/dependencyController');
const router = express.Router();

router.get('/scrape-dependencies/:owner/:repoName', getDependencies);

module.exports = router;

router.get("/dependency-node", async (req, res) => {
    const { url, depth } = req.query;
    try {
      const result = await fetchSingleDependencyTree(url, parseInt(depth));
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch node" });
    }
  });
  