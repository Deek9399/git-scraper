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
  // for lazy loading
  router.get("/dependency-child", async (req, res) => {
    const { url, depth } = req.query;
  
    if (!url || !depth) {
      return res.status(400).json({ error: "Missing URL or depth" });
    }
  
    try {
      const result = await fetchSingleDependencyTree(url, parseInt(depth));
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });