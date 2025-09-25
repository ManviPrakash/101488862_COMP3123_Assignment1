const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// POST /signup
exports.signup = async (req, res) => {
  await body("username").notEmpty().run(req);
  await body("email").isEmail().run(req);
  await body("password").isLength({ min: 6 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status: false, errors: errors.array() });


  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully.", user_id: user._id });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// POST /login
exports.login = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(400).json({ status: false, message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful.", jwt_token: token });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
