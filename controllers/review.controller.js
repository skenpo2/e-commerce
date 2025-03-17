const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const addReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, reviewMessage, reviewValue } = req.body;

  const canSave = [productId, userId, reviewMessage, reviewValue].every(
    Boolean
  );

  if (!canSave) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all fields',
    });
  }

  const order = await Order.findOne({
    userId,
    'cartItems.productId': productId,
    paymentStatus: 'paid', // Ensure order is paid
  });

  if (!order) {
    return res.status(403).json({
      success: false,
      message: 'You need to purchase the product to review it',
    });
  }

  const checkExistingReview = await Review.findOne({ userId, productId });

  if (checkExistingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed the product',
    });
  }

  const review = await Review.create({
    productId,
    userId,
    reviewMessage,
    reviewValue,
  });

  await Product.findByIdAndUpdate(productId, {
    $push: { reviews: review._id },
  });

  res.status(201).json({
    success: true,
    data: review,
  });
};

const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId });

  if (!reviews.length) {
    return res.status(404).json({
      success: false,
      message: 'No reviews for this product',
    });
  }

  res.status(200).json({
    success: true,
    data: reviews,
  });
};

const deleteReview = async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  // Ensure user can only delete their own review
  if (review.userId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own review',
    });
  }

  // Remove review from the product's reviews array
  await Product.findByIdAndUpdate(review.productId, {
    $pull: { reviews: review._id },
  });

  // Delete the review
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
};

module.exports = { addReview, getProductReviews, deleteReview };
