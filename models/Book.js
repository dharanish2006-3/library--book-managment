const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  isbn: { type: String, unique: true, sparse: true },
  copiesTotal: { type: Number, default: 1 },
  copiesAvailable: { type: Number, default: 1 },
  borrowedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    borrowedAt: Date,
    dueDate: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
