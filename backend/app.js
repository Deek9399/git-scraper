const express = require('express');
const cors = require('cors');
const dependencyChildRoutes = require("./routes/dependencyChildRoutes");

const dependencyRoutes = require('./routes/dependencyRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(dependencyRoutes);
app.use("/api/dependency-child", dependencyChildRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});