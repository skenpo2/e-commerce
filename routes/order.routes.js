const express = require('express');
const router = express.Router();
const {
  createOrder,
  capturePayment,
  getAllOrderByUser,
  getAllOrdersOfAllUsers,
  getOrderDetails,
  UpdateOrderStatus,
} = require('../controllers/order.controller');

// @user access
router.post('/create', createOrder);
router.post('/payment', capturePayment);

// @Admin/user access
router.get('/user/:userId', getAllOrderByUser);
router.get('/:orderId', getOrderDetails);

// @Admin access only
router.get('/users/', getAllOrdersOfAllUsers);
router.post('/:orderId', UpdateOrderStatus);

module.exports = router;
