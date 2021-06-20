const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.get('/', (req, res) => res.send('API Running'));
connectDB();
const PORT = process.env.PORT || 1821;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));