const mongoose = require('mongoose');

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewMessage: { type: String, required: true },
    reviewValue: { type: Number, required: true, min: 1, max: 5 }, // Ensuring rating stays within 1-5
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ProductReviewSchema);
