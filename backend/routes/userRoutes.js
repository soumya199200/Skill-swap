const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST - Register new user
router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      firebaseUID: req.body.firebaseUID,
      role: req.body.role || 'student'
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-firebaseUID');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update user profile
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        skillsOffered: req.body.skillsOffered,
        skillsWanted: req.body.skillsWanted,
        role: req.body.role
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Check user credits
router.get('/:id/credits', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name credits');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// GET user by Firebase UID
router.get('/firebase/:firebaseUID', async (req, res) => {
  try {
    const user = await User.findOne({ 
      firebaseUID: req.params.firebaseUID 
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
