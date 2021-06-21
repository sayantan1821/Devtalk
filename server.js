const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.get('/', (req, res) => res.send('API Running'));
connectDB();

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
const PORT = process.env.PORT || 1821;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));