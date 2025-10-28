const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const memberId = 'M' + Date.now().toString().slice(-6);
    const user = new User({ name, email, memberId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
