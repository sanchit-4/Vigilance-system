// server/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const salaryAdvances = require('./salaryAdvances');

app.use(cors());
app.use(express.json());
app.use('/api', salaryAdvances);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
