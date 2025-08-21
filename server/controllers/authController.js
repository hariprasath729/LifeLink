const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get list of hospitals for the signup form
exports.getHospitalList = async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'hospital' }).select('profile.name');
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, password, role, profile, donorSecretKey } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    // If a donor is registering, validate the secret key
    if (role === 'donor') {
      if (!profile.registeredByHospital || !donorSecretKey) {
        return res.status(400).json({ msg: 'Please select a hospital and provide their secret key.' });
      }
      const hospital = await User.findById(profile.registeredByHospital);
      if (!hospital) {
        return res.status(404).json({ msg: 'Selected hospital not found.' });
      }
      const isMatch = await bcrypt.compare(donorSecretKey, hospital.profile.donorSecretKey);
      if (!isMatch) {
        return res.status(400).json({ msg: 'The secret key for the selected hospital is incorrect.' });
      }
    }

    user = new User({
      username,
      password,
      role,
      profile,
    });

    // If hospital, hash their secret key before saving
    if (role === 'hospital' && profile.donorSecretKey) {
      const salt = await bcrypt.genSalt(10);
      user.profile.donorSecretKey = await bcrypt.hash(profile.donorSecretKey, salt);
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.profile.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.profile.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};