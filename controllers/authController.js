const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Build a signed token that proves who the user is, good for 7 days.
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Send back a safe view of the user (never the password hash).
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, wallet: user.wallet };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password }); // wallet defaults to 100
    res.status(201).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  // With JWT the token lives on the client, so logging out just means the
  // client throws its token away. There's nothing to delete server-side.
  res.status(200).json({ message: 'Logged out' });
};

// LIST USERS — returns everyone, minus their password hash.
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');  // '-password' = every field except this one
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};