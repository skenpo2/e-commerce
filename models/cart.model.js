const { mongo } = require('mongoose');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, ' userId is required for cart'],
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, ' productId is required for cart'],
        },
        quantity: {
          type: Number,
          required: [true, 'Number of quantity is required'],
          min: [1, 'Product quantity can not be less than 1'],
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;
