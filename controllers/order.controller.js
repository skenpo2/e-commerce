const paypal = require('../utils/paypal');
const Order = require('../models/order.model');
const logger = require('../utils/logger');
const customError = require('../utils/customError');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

const createOrder = async (req, res) => {
  const {
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus,
    paymentMethod,
    paymentStatus,
    totalAmount,
    orderDate,
    orderUpdateDate,
    paymentId,
    payerId,
  } = req.body;

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
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
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

const capturePayment = async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;

  if (!paymentId || !payerId) {
    return customError(400, 'Missing paymentId or payerId');
  }

  // Retrieve payment from PayPal before executing
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      console.error('PayPal Payment Retrieval Error:', error.response);
      return customError(500, 'Payment not found on PayPal');
    }

    if (payment.state !== 'approved') {
      return customError(400, 'Payment not approved by user');
    }

    // Execute PayPal payment before updating the order
    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      async (error, payment) => {
        if (error) {
          console.error('PayPal Execution Error:', error.response);
          return customError(
            500,
            `Payment verification failed: ${
              error.response.message || 'Unknown error'
            }`
          );
        }

        let order = await Order.findById(orderId);
        if (!order) {
          return customError(404, 'Order not found');
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        await order.save();

        res.status(200).json({
          success: true,
          message: 'Order confirmed',
          data: order,
        });
      }
    );
  });
};

const getAllOrderByUser = async (req, res) => {
  const { userId } = req.params;

  const orders = Order.find({ userId });

  if (!orders.length) {
    customError('404', 'No order found');
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
};

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    customError('404', 'Order not found');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};

//  @Admin only

const getAllOrdersOfAllUsers = async (req, res) => {
  const orders = await Order.find({});

  if (!orders.length) {
    customError('404', 'No order found');
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
};

// @Admin only

const UpdateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    customError('404', 'Order not found');
  }

  await Order.findByIdAndUpdate(orderId, { orderStatus });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
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
