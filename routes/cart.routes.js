const express = require('express');
const router = express.Router();

const {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
} = require('../controllers/cart.controller');

// Get user's cart items
router.get('/:userId', fetchCartItems);

// Add an item to the cart
router.post('/:userId', addToCart);

// Update a cart item
router.put('/:userId/:productId', updateCartItems);

// Remove an item from the cart
router.delete('/:userId/:productId', deleteCartItems);

module.exports = router;
