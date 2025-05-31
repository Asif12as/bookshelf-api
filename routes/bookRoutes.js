const express = require('express');
const {
  createBook,
  getBooks,
  getBook,
} = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Book routes - mounted on /books
router.route('/')
  .get(getBooks)          // GET /books
  .post(protect, createBook); // POST /books

router.route('/:id')
  .get(getBook);          // GET /books/:id

// Review routes for a book
router.route('/:id/reviews')
  .post(protect, addReview); // POST /books/:id/reviews

module.exports = router;