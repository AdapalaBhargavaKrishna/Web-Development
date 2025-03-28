const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  rollNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent',
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;