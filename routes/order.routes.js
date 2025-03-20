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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and payment processing
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for a user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *               - addressInfo
 *               - paymentMethod
 *               - cartItems
 *               - totalAmount
 *             properties:
 *               cartId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               addressInfo:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main Street"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   zip:
 *                     type: string
 *                     example: "10001"
 *               paymentMethod:
 *                 type: string
 *                 example: "paypal"
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "60d21b4967d0d8992e610c86"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 20.99
 *               totalAmount:
 *                 type: number
 *                 example: 41.98
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/create', verifyJWT, createOrder);

/**
 * @swagger
 * /orders/payment:
 *   post:
 *     summary: Capture payment for an order
 *     description: Completes payment for an order using PayPal
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - payerId
 *               - orderId
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: "PAYID-1234567890"
 *               payerId:
 *                 type: string
 *                 example: "PAYER123"
 *               orderId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Payment captured successfully
 *       400:
 *         description: Missing payment details
 *       404:
 *         description: Order not found
 */
router.post('/payment', verifyJWT, capturePayment);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Get all orders for a user
 *     description: Retrieves all orders placed by a specific user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders
 *       404:
 *         description: No orders found
 */
router.get('/user/:userId', verifyJWT, getAllOrderByUser);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     description: Retrieves details of a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *       404:
 *         description: Order not found
 */
router.get('/:orderId', verifyJWT, getOrderDetails);

/**
 * @swagger
 * /orders/users/:
 *   get:
 *     summary: Get all orders from all users
 *     description: Retrieves all orders placed by all users (Admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *       404:
 *         description: No orders found
 */
router.get('/users/', verifyJWT, verifyRole, getAllOrdersOfAllUsers);

/**
 * @swagger
 * /orders/{orderId}:
 *   post:
 *     summary: Update order status
 *     description: Updates the status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 */
router.post('/:orderId', verifyJWT, verifyRole, UpdateOrderStatus);

module.exports = router;
