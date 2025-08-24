const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  payload: Object,
  status: { type: String, enum: ['pending', 'in-progress', 'complete'], default: 'pending' },
  assignedTo: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
