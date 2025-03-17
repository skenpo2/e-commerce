const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'please provide the productId and quantity',
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product does not exist',
    });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, cartItems: [] });
  }

  const findCurrentProductIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    cart.cartItems.push({ productId, quantity });
  } else {
    cart.cartItems[findCurrentProductIndex].quantity += quantity;
  }

  await cart.save();
  res.status(201).json({ success: true, data: cart });
};

const updateCartItems = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Please provide required details',
    });
  }

  const isProduct = await Product.findById(productId);

  if (!isProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'cart not found',
    });
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'product not in cart',
    });
  }

  console.log(productIndex);
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
    quantity: item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: { ...cart._doc, cartItems: formattedProducts },
  });
};
const fetchCartItems = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Please Provide userId',
    });
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'cart not found',
    });
  }
  const validItems = cart.cartItems.filter(
    (productItem) => productItem.productId
  );

  if (validItems.length < cart.cartItems.length) {
    cart.cartItems = validItems;
    await cart.save();
  }

  //   return a well formatted response object with product details
  const formattedProducts = validItems.map((item) => ({
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
  const productId = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId }).populate({
    path: 'cartItems.productId',
    select: 'name image description  price',
  });

  if (!cart) {
    return res.status(400).json({
      success: false,
      message: 'cart not found',
    });
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
    quantity: item.quantity,
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
