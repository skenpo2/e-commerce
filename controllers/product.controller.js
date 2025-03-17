const { FaLessThanEqual } = require('react-icons/fa');
const Product = require('../models/product.model');
const cloudinary = require('cloudinary').v2;
const customError = require('../utils/customError');

// cloudinary configuration
cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: '',
});

// upload image to cloudinary
// response: url and public ID so that it can be sent while creating the product

const imageUpload = async (req, res) => {
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const url = 'data:' + req.file.mimetype + ';base64,' + b64;
  const result = await cloudinary.uploader.upload(url, {
    resource_type: 'auto',
  });

  res.json({
    success: true,
    result,
  });
};

const addProduct = async (req, res) => {
  const { name, description, price, category, brand, stock, image } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    brand,
    stock,
    image,
  });

  await newProduct.save();

  res.status(200).json({
    success: true,
    data: newProduct,
  });
};

const getAllProducts = async (req, res, next) => {
  let {
    category,
    brand,
    priceMin,
    priceMax,
    search,
    sortBy,
    order,
    limit,
    page,
  } = req.query;

  let filter = {};

  // Filtering by multiple categories
  if (category) {
    filter.category = { $in: category.split(',') };
  }

  // Filtering by multiple brands
  if (brand) {
    filter.brand = { $in: brand.split(',') };
  }

  // Filtering by price range
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
  }

  // Search using MongoDB text index for better efficiency
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  // Sorting logic
  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  }

  // Pagination
  limit = Number(limit) || 10; // Default limit = 10
  page = Number(page) || 1; // Default page = 1
  let skip = (page - 1) * limit;

  // Execute query
  const products = await Product.find(filter)
    .sort(sortOptions) // Sorting
    .limit(limit) // Pagination limit
    .skip(skip); // Pagination skip

  // Handle empty results
  if (products.length === 0) {
    return res.status(200).json({
      success: false,
      message: 'No products found',
    });
  }

  res.status(200).json(products);
};

const getSingleProduct = async (req, res) => {
  const { slug } = req.params;

  const singleProduct = await Product.findOne({ slug });

  if (!singleProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({ success: true, product: singleProduct });
};

const editProduct = async (req, res) => {
  const { slug } = req.params;
  const {
    name,
    description,
    price,
    category,
    brand,
    stock,
    image,
    discount,
    isFeatured,
  } = req.body;

  const product = await Product.findOneAndUpdate(
    { slug },
    {
      name,
      description,
      price,
      category,
      brand,
      stock,
      image,
      discount,
      isFeatured,
    },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      success: true,
      message: 'Product not found',
    });
  }

  res.status(201).json({ success: true, data: product });
};

const deleteProduct = async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  const product = await Product.findOneAndDelete({ slug });

  if (!product) {
    return res.status(404).json({
      success: true,
      message: 'Product not found',
    });
  }
  res
    .status(200)
    .json({ success: true, message: 'Product deleted Successfully' });
};

module.exports = {
  addProduct,
  imageUpload,
  getSingleProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
};
