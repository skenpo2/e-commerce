const paypal = require('../utils/paypal');
const Order = require('../models/order.model');
const logger = require('../utils/logger');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// @desc   create an order
// @route  POST  /api/order/create
// @access Private (logged user Only)
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { cartId, addressInfo, paymentMethod, cartItems, totalAmount } =
    req.body;

  console.log(userId);
  const canSave = [
    userId,
    cartId,
    cartItems,
    addressInfo,
    paymentMethod,
    totalAmount,
  ].every(Boolean);

  if (!canSave) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required details',
    });
  }
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'invalid cart',
    });
  }

  // paypal payment initiation
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:5000/paypal/success',
      cancel_url: 'http://localhost:5000/paypal/cancel',
    },

    transactions: [
      {
        item_list: {
          items: cartItems.map((item) => ({
            name: item.name,
            sku: item.productId,
            price: item.price,
            currency: 'USD',
            quantity: item.quantity,
          })),
        },
        amount: {
          currency: 'USD',
          total: totalAmount.toFixed(2),
        },
        description: 'description',
      },
    ],
  };

  paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
    if (error) {
      console.log(error.stack);

      return res.status(500).json({
        success: false,
        message: 'Error while creating paypal payment',
      });
    } else {
      const newOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        paymentMethod,
        totalAmount,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentId: '',
        payerId: '',
      });
      await newOrder.save();
      const approvalURL = paymentInfo.links.find(
        (link) => link.rel === 'approval_url'
      ).href;
      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newOrder._id,
      });
    }
  });
};

// @desc   capture payment of an order
// @route  POST  /api/order/payment
// @access Private (logged user Only)
const capturePayment = async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;

  if (!paymentId || !payerId || !orderId) {
    return res.status(400).json({
      success: false,
      message: 'Missing paymentId, payerId, or orderId',
    });
  }

  let order = await Order.findById(orderId);
  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: 'Order does not exist' });
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.paymentId = paymentId;
  order.payerId = payerId;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'payment updated',
    data: order,
  });
  // Retrieve PayPal payment
  // paypal.payment.get(paymentId, function (error, payment) {
  //   if (error) {
  //     console.error('PayPal Payment Retrieval Error:', error.response);
  //     return res
  //       .status(500)
  //       .json({ success: false, message: 'Payment not found on PayPal' });
  //   }

  //   console.log('PayPal Payment State:', payment.state);
  //   if (payment.state !== 'created') {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: 'Payment not ready for execution' });
  //   }

  //   // Execute PayPal payment
  //   paypal.payment.execute(
  //     paymentId,
  //     { payer_id: payerId },
  //     async (error, payment) => {
  //       if (error) {
  //         console.error('PayPal Execution Error:', error.response);
  //         return res.status(500).json({
  //           success: false,
  //           message: `Payment verification failed: ${
  //             error.response.message || 'Unknown error'
  //           }`,
  //         });
  //       }

  //       // Ensure payment was completed
  //       if (
  //         !payment.transactions[0].related_resources[0].sale ||
  //         payment.transactions[0].related_resources[0].sale.state !==
  //           'completed'
  //       ) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Payment not completed on PayPal',
  //         });
  //       }

  //       // Update order
  //       order.paymentStatus = 'paid';
  //       order.orderStatus = 'confirmed';
  //       order.paymentId = paymentId;
  //       order.payerId = payerId;
  //       await order.save();

  //       res
  //         .status(200)
  //         .json({ success: true, message: 'Order confirmed', data: order });
  //     }
  //   );
  // });
};

// @desc   get a user order
// @route  GET  /api/order/user/:userId
// @access Private (logged user Only)
const getAllOrderByUser = async (req, res) => {
  const userId = req.params.userId;

  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not allowed',
    });
  }

  const orders = await Order.find({ userId });

  if (orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No orders found',
    });
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
};

// @desc   get the details of an order
// @route  GET  /api/order//:orderId'
// @access Private (logged user Only)
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'order not found',
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};

// @desc   get all orders
// @route  GET  /api/order/
// @access Private (Admin Only)

const getAllOrdersOfAllUsers = async (req, res) => {
  const orders = await Order.find({});

  if (!orders.length) {
    return res.status(404).json({
      success: false,
      message: 'No order found',
    });
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
};

// @desc   update the status of an order
// @route  PUT  /api/order//:orderId
// @access Private (Admin Only)

const UpdateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { orderStatus } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  await Order.findByIdAndUpdate(orderId, { orderStatus });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrderByUser,
  getAllOrdersOfAllUsers,
  getOrderDetails,
  UpdateOrderStatus,
};
