const express = require('express');
const {
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Review routes - mounted on /reviews
router.route('/:id')
  .put(protect, updateReview)    // PUT /reviews/:id
  .delete(protect, deleteReview); // DELETE /reviews/:id

module.exports = router;