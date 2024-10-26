const express = require('express');
const router = express.Router();
const user = require('../models/Users')
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the decoded user data in request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// User registration route
router.post('/register', async (req, res) => {
  const { username, email, password, phone, gender } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = new User({
    username,
    email,
    password,
    phone,
    gender,
  });

  await newUser.save();

  // Create JWT token
  const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
    },
    token,
  });
});

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(404).json({ message: 'Invalid email or password' });
  }

  // Create JWT token
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    message: 'Logged in successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
    },
    token,
  });
});

// Get user profile (protected route)
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password'); // Exclude the password from response

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

module.exports = router;