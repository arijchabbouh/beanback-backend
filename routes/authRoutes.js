const express = require('express');
const router = express.Router();
const { register, login, logout, getUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Only a logged-in user can list users (needs a Bearer token).
router.get('/users', getUsers);

module.exports = router;