require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articlesRoutes = require('./routes/articles');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
connectDB();

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Explicitly handle CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow headers
  next();
});

// Routes
app.use('/api/articles', articlesRoutes);

// Email Endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      console.log('Validation Error: Missing Fields');
      return res.status(400).send('All fields are required.');
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation Error: Invalid Email');
      return res.status(400).send('Invalid email format.');
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app password
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${email}>`,
      to: process.env.EMAIL_USER, // Replace with your email
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).send('Thank you! Your message has been sent.');
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).send('Failed to send the email. Please try again later.');
  }
});

// Explicitly handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
