const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add review
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    // Check if book exists
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`,
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user.id,
      book: req.params.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book',
      });
    }

    // Add user and book to req.body
    req.body.user = req.user.id;
    req.body.book = req.params.id;

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review not found with id of ${req.params.id}`,
      });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review not found with id of ${req.params.id}`,
      });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};