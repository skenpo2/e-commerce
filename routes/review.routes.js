const express = require('express');
const {
  addReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/review.controller');

const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// @access users
router.post('/', verifyJWT, addReview);
router.delete('/', verifyJWT, deleteReview);

// @access public
router.get('/:productId', getProductReviews);

module.exports = router;
