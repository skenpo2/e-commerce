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

router.get('/:orderId', verifyJWT, getOrderDetails);

router.get('/', verifyJWT, verifyRole, getAllOrdersOfAllUsers);

router.post('/create', verifyJWT, createOrder);

router.post('/payment', verifyJWT, capturePayment);

router.get('/user/:userId', verifyJWT, getAllOrderByUser);

router.put('/:orderId', verifyJWT, verifyRole, UpdateOrderStatus);

module.exports = router;
