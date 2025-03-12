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
      return_url: '',
      cancel_url: '',
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
      logger.warn(`An error Occur: ${error}`);

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

  let order = await Order.findById(orderId);

  if (!order) {
    customError('404', 'Order can not be found');
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.paymentId = paymentId;
  order.payerId = payerId;

  for (let item of order.cartItems) {
    let product = await Product.findById(item.productId);

    if (!product) {
      customError(`404", "Not enough stock for this product ${product.name}`);
    }

    product.stock -= item.quantity;
    await product.save();
  }

  const getCartId = order.cartId;
  await Cart.findByIdAndDelete(getCartId);

  await order.save();

  res.status(200).json({
    success: true,
    message: 'order confirmed',
    data: order,
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
