const express = require('express');
const { getDependencies } = require('../controllers/dependencyController');
const router = express.Router();

router.get('/scrape-dependencies/:owner/:repoName', getDependencies);

module.exports = router;

