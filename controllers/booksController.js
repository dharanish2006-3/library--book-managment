const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, copiesTotal } = req.body;
    const book = new Book({
      title, author, isbn,
      copiesTotal: copiesTotal || 1,
      copiesAvailable: copiesTotal || 1
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('borrowedBy.user', 'name email');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('borrowedBy.user', 'name email');
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const { userId, days = 14 } = req.body;
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.copiesAvailable <= 0) return res.status(400).json({ msg: 'No copies available' });

    book.copiesAvailable -= 1;
    book.borrowedBy.push({
      user: userId,
      borrowedAt: new Date(),
      dueDate: new Date(Date.now() + days * 24*60*60*1000)
    });
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const { userId } = req.body;
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const idx = book.borrowedBy.findIndex(b => b.user.toString() === userId);
    if (idx === -1) return res.status(400).json({ msg: 'This user did not borrow this book' });

    book.borrowedBy.splice(idx, 1);
    book.copiesAvailable += 1;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
