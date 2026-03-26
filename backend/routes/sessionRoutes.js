const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

// POST - Book a session
router.post('/book', async (req, res) => {
  try {
    // Check if student has enough credits
    const student = await User.findById(req.body.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.credits < req.body.creditsUsed) {
      return res.status(400).json({ 
        message: 'Not enough credits' 
      });
    }

    // Create session
    const session = new Session({
      mentor: req.body.mentor,
      student: req.body.student,
      skill: req.body.skill,
      creditsUsed: req.body.creditsUsed,
      scheduledAt: req.body.scheduledAt,
      notes: req.body.notes
    });

    // Deduct credits from student
    student.credits -= req.body.creditsUsed;
    await student.save();

    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get all sessions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { student: req.params.userId },
        { mentor: req.params.userId }
      ]
    })
    .populate('mentor', 'name email')
    .populate('student', 'name email')
    .populate('skill', 'title creditsCost');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Accept a session
router.put('/:id/accept', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Complete a session (mentor gets credits)
router.put('/:id/complete', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Give credits to mentor
    const mentor = await User.findById(session.mentor);
    mentor.credits += session.creditsUsed;
    await mentor.save();

    // Update session status
    session.status = 'completed';
    await session.save();

    res.json({ message: 'Session completed!', session });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Cancel a session (refund credits)
router.put('/:id/cancel', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Refund credits to student
    const student = await User.findById(session.student);
    student.credits += session.creditsUsed;
    await student.save();

    // Update session status
    session.status = 'cancelled';
    await session.save();

    res.json({ message: 'Session cancelled, credits refunded!', session });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;