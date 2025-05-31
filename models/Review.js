const mongoose = require('mongoose');
const Book = require('./Book');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide a review title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent user from submitting more than one review per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Update book average rating after review is saved or updated
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.book);
});

// Update book average rating after review is removed
reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRating(this.book);
});

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function (bookId) {
  const averageRating = await Book.getAverageRating(bookId);
  await Book.findByIdAndUpdate(bookId, { averageRating });
};

module.exports = mongoose.model('Review', reviewSchema);