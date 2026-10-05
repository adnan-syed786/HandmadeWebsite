require('dotenv').config();
const connectToMongo = require("./db");
connectToMongo();

const express = require("express");
const cors = require('cors');
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));

app.get('/', (req, res) => {
  res.send('Orion Handmade Crafts API is running');
});

app.listen(port, () => {
  console.log(`Orion backend listening on http://localhost:${port}`);
});

