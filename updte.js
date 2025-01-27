require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articlesRoutes = require('./routes/articles');
const errorHandler = require('./middleware/errorHandler');

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articlesRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
