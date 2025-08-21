const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getHospitalList } = require('../controllers/authController');

// @route   GET api/auth/hospitals
// @desc    Get a list of all registered hospitals
// @access  Public
router.get('/hospitals', getHospitalList);

// @route   POST api/auth/register
// @desc    Register a new user (hospital or donor)
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

module.exports = router;