const Review = require('../models/review.model');

const Product = require('../models/product.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');

const addReview = async (req, res) => {
  const { productId, userId, reviewMessage, reviewValue } = req.body;

  const order = await Order.findOne({
    userId,
    'cartItems.productId': productId,
  });

  if (!order) {
    return res.status(403).json({
      success: false,
      message: ' You need to purchase the product to review it',
    });
  }

  const checkExistingReview = await Review.findOne({ userId, productId });

  if (checkExistingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed the product',
    });
  }

  const review = new Review({ productId, userId, reviewMessage, reviewValue });

  await review.save();

  const reviewedProduct = await Product.findById(productId);
  reviewedProduct.reviews.push(review._id);
  await reviewedProduct.save();

  res.status(201).json({
    success: true,
    data: review,
  });
};

const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId });

  if (!reviews?.length) {
    return res.status(404).json({
      success: false,
      message: 'No review for this product',
    });
  }
};

module.exports = { addReview, getProductReviews };
