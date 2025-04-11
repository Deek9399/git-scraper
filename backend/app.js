const express = require('express');
const cors = require('cors');
const dependencyRoutes = require('./routes/dependencyRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(dependencyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});