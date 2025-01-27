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
// Allow requests from any origin
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/articles', articlesRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Email Endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      console.log("Validation Error: Missing Fields");
      return res.status(400).send('All fields are required.');
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation Error: Invalid Email");
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
