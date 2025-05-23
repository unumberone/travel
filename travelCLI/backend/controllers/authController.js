const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

exports.registerUser = async (req, res) => {
  try {
    const { userName, email, password, role = 1 } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }]
    });
    if (existingUser) return res.status(400).json({ message: 'Email or username already exists' });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password: hashedPassword, role, userName });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', data: { email, role, userName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = bcrypt.compareSync(password, user.password);
    // console.log(isValid, password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Incorrect password' });

    // role-based redirect logic suggestion (handled on frontend)
    res.status(200).json({
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        // role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    // Clear the session or token here if applicable
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};