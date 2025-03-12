const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const customError = require('../utils/customError');

const addToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    customError('400', 'Please provide cart details');
  }

  const product = await Product.findById({ productId });

  if (!product) {
    customError('404', 'Product not found');
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, cartItems: [] });
  }

  const productIndex = cart.cartItems.findIndex((item) => {
    item.productId.toString() === productId;
  });

  if (productIndex === -1) {
    cart.cartItems.push({ productId, quantity });
  } else {
    cart.cartItems[productIndex].quantity += quantity;
  }

  res.status(201).json({ success: true, data: cart });
};

const updateCartItems = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!userId || !productId || !quantity) {
    customError('400', 'Please provide cart details');
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    customError('404', 'Cart not found');
  }

  const productIndex = cart.cartItems.findIndex((item) => {
    item.productId._id.toString() === productId;
  });

  if (productIndex === -1) {
    customError('404', 'Cart item nof found');
  }

  cart.cartItems[productIndex].quantity = quantity;
  await cart.save();

  await cart.populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  const formattedProducts = cart.cartItems.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    name: item.productId ? item.productId.name : 'Product not found',
    image: item.productId ? item.productId.image : null,
    price: item.productId ? item.productId.price : null,
    description: item.productId ? item.productId.description : null,
    quantity: item.item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: { ...cart._doc, cartItems: formattedProducts },
  });
};
const fetchCartItems = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    customError('400', 'Please Provide userId');
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  if (!cart) {
    customError('404', 'No cart item available');
  }

  const validCartProducts = cart.cartItems.filter((item) => {
    item.productId;
  });

  if (validCartProducts.length < cart.cartItems.length) {
    cart.cartItems = validCartProducts;
    await cart.save;
  }

  //   return a well formatted response object with product details
  const formattedProducts = validCartProducts.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    image: item.productId.image,
    price: item.productId.price,
    description: item.productId.description,
    quantity: item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: { ...cart._doc, cartItems: formattedProducts },
  });
};

const deleteCartItems = async (req, res) => {
  const { productId, userId } = req.params;

  const cart = await Cart.findOne({ userId }).populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  if (!cart) {
    customError('404', 'No cart item available');
  }

  cart.cartItems = cart.cartItems.filter((item) => {
    item.productId._id.toString() !== productId;
  });

  await cart.save();

  await cart.populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  const formattedProducts = cart.cartItems.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    name: item.productId ? item.productId.name : 'Product not found',
    image: item.productId ? item.productId.image : null,
    price: item.productId ? item.productId.price : null,
    description: item.productId ? item.productId.description : null,
    quantity: item.item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: { ...cart._doc, cartItems: formattedProducts },
  });
};
module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
};
