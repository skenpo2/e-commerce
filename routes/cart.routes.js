const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

const {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
} = require('../controllers/cart.controller');

// Get user's cart items
router.get('/:userId', verifyJWT, fetchCartItems);

// Add an item to the cart
router.post('/', verifyJWT, addToCart);

// Update a cart item
router.put('/', verifyJWT, updateCartItems);

// Remove an item from the cart
router.delete('/:productId', verifyJWT, deleteCartItems);

module.exports = router;
