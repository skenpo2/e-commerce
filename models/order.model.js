const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      name: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    address: String,
    city: String,
    phone: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
