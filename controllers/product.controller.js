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

const getAllProducts = async (req, res) => {
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

  // Filtering by brands

  if (brand) {
    filter.brand = { $in: brand.split(',') };
    console.log(filter.brand);
  }

  // Filtering by price range
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
  }

  // search by product name
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  //  Sorting logic
  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  }

  // Pagination
  limit = Number(limit) || 10; // Default limit = 10
  page = Number(page) || 1; // Default page = 1
  let skip = (page - 1) * limit;

  //  Execute query
  const products = await Product.find(filter)
    .sort(sortOptions) // Sorting
    .limit(limit) // Pagination limit
    .skip(skip); // Pagination skip

  if (!products) {
    customError('404', 'No Product available');
  }

  res.status(200).json(products);
};

const getSingleProduct = async (req, res) => {
  const { slug } = req.params;

  const singleProduct = await Product.findOne({ slug });

  if (!singleProduct) {
    return customError('404', 'Product Not found');
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

  console.log({ isFeatured });

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
    customError('404', 'product does not exist');
  }

  //   product.name = name || product.name;
  //   product.description = description || product.name;
  //   product.price = price || product.price;
  //   product.category = category || product.category;
  //   product.brand = brand || product.brand;
  //   product.stock = stock || product.stock;
  //   product.image = image || product.image;
  //   product.discount = discount || product.discount;

  //   if (isFeatured) {
  //     product.isFeatured = isFeatured || product.isFeatured;
  //   }

  //   console.log(product.isFeatured);

  //   const updatedProduct = await product.save();

  res.status(201).json({ success: true, data: product });
};

const deleteProduct = async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  const product = await Product.findOneAndDelete({ slug });

  if (!product) {
    customError('404', 'product does not exist');
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
