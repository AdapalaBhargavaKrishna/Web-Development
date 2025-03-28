require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(express.json());

const mainRoutes = require('./routes/mainRoutes');
app.use('/api', mainRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
