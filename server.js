require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");


const app = express();

app.use(cors());

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.use("/uploads", express.static("uploads"));


// Routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/emp', require('./routes/employeeRoutes'));

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ status: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
