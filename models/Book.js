const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
      maxlength: [50, 'Author name cannot be more than 50 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
      enum: [
        'Fiction',
        'Non-fiction',
        'Science Fiction',
        'Fantasy',
        'Mystery',
        'Thriller',
        'Romance',
        'Biography',
        'History',
        'Self-help',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Year must be at least 1000'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false,
});

// Static method to get average rating
bookSchema.statics.getAverageRating = async function (bookId) {
  const obj = await this.model('Review').aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  return obj[0]?.averageRating || 0;
};

module.exports = mongoose.model('Book', bookSchema);