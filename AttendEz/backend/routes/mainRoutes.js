const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.get('/Attendance', async (req, res) => {
    try {
      const records = await Attendance.find();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;