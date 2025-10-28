const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.post('/', booksController.createBook);       // Create book
router.get('/', booksController.listBooks);         // List books
router.get('/:id', booksController.getBook);        // Get by id
router.put('/:id', booksController.updateBook);     // Update
router.delete('/:id', booksController.deleteBook);  // Delete
router.post('/:id/borrow', booksController.borrowBook); // Borrow
router.post('/:id/return', booksController.returnBook); // Return

module.exports = router;
