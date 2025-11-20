const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// POST /signup
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
      user_id: user._id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};



// POST /login
exports.login = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ status: false, message: "Password is required" });
    }

    if (!email && !username) {
      return res.status(400).json({ status: false, message: "Email or username is required" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid username/email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid username/email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ status: false, message: "Server missing JWT_SECRET" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: true,
      message: "Login successful",
      jwt_token: token,
      user_id: user._id
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
