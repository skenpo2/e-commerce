const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');
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
router.post('/create', verifyJWT, createOrder);
router.post('/payment', verifyJWT, capturePayment);

// @Admin/user access
router.get('/user/:userId', verifyJWT, getAllOrderByUser);
router.get('/:orderId', verifyJWT, getOrderDetails);

// @Admin access only
router.get('/users/', verifyJWT, verifyRole, getAllOrdersOfAllUsers);
router.post('/:orderId', verifyJWT, verifyRole, UpdateOrderStatus);

module.exports = router;
