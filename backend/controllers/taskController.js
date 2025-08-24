const Task = require('../models/task');

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { status: 'pending' },
      { status: 'in-progress', assignedTo: req.ip }
    );

    if (!task) return res.status(204).send(); // No content

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

exports.submitResult = async (req, res) => {
  const { taskId, result } = req.body;
  try {
    await Task.findByIdAndUpdate(taskId, {
      status: 'complete',
      result
    });
    res.json({ message: 'Result submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit result' });
  }
};
