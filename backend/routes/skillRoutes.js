const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isAvailable: true })
      .populate('teacher', 'name email role');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a skill
router.post('/', async (req, res) => {
  try {
    const skill = new Skill({
      title: req.body.title,
      description: req.body.description,
      creditsCost: req.body.creditsCost,
      teacher: req.body.teacher,
      category: req.body.category
    });
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET single skill
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('teacher', 'name email role');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
