const mongoose = require('mongoose');
const Product = require('./models/product.model');
const dotenv = require('dotenv');
dotenv.config();

// Sample product data
const products = [
  {
    name: 'Apple iPhone 14 Pro',
    description: '6.1-inch display, A16 Bionic chip, triple-camera system.',
    price: 999,
    category: 'Electronics',
    brand: 'Apple',
    stock: 10,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'iPhone 14 Pro' },
    ],
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: '6.8-inch AMOLED display, 200MP camera, Snapdragon 8 Gen 2.',
    price: 1199,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 8,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Galaxy S23 Ultra' },
    ],
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable lifestyle shoes with Air cushioning.',
    price: 150,
    category: 'Fashion',
    brand: 'Nike',
    stock: 20,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Nike Air Max 270' },
    ],
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise-canceling wireless headphones.',
    price: 399,
    category: 'Electronics',
    brand: 'Sony',
    stock: 15,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Sony WH-1000XM5' },
    ],
  },
  {
    name: 'Samsung 55-inch 4K Smart TV',
    description: 'Crystal UHD display, Smart Hub, HDR10+ support.',
    price: 599,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 5,
    images: [
      {
        url: 'https://via.placeholder.com/150',
        altText: 'Samsung 4K Smart TV',
      },
    ],
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with Boost cushioning.',
    price: 180,
    category: 'Fashion',
    brand: 'Adidas',
    stock: 12,
    images: [
      {
        url: 'https://via.placeholder.com/150',
        altText: 'Adidas Ultraboost 22',
      },
    ],
  },
  {
    name: 'MacBook Pro 16-inch',
    description: 'M2 Pro chip, Liquid Retina XDR display, macOS Ventura.',
    price: 2499,
    category: 'Electronics',
    brand: 'Apple',
    stock: 7,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'MacBook Pro 16' },
    ],
  },
  {
    name: 'Dell XPS 15',
    description: '4K OLED display, Intel Core i9, RTX 4060 GPU.',
    price: 1999,
    category: 'Electronics',
    brand: 'Dell',
    stock: 6,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Dell XPS 15' },
    ],
  },
  {
    name: 'Canon EOS R6',
    description: '20MP full-frame sensor, 4K 60fps video, IBIS stabilization.',
    price: 2499,
    category: 'Electronics',
    brand: 'Canon',
    stock: 3,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Canon EOS R6' },
    ],
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Ergonomic wireless mouse with customizable buttons.',
    price: 99,
    category: 'Electronics',
    brand: 'Logitech',
    stock: 30,
    images: [
      {
        url: 'https://via.placeholder.com/150',
        altText: 'Logitech MX Master 3S',
      },
    ],
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Premium noise-canceling wireless headphones.',
    price: 329,
    category: 'Electronics',
    brand: 'Bose',
    stock: 10,
    images: [{ url: 'https://via.placeholder.com/150', altText: 'Bose QC 45' }],
  },
  {
    name: 'Apple Watch Series 8',
    description: 'Advanced health tracking, Always-On Retina display.',
    price: 429,
    category: 'Electronics',
    brand: 'Apple',
    stock: 14,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Apple Watch 8' },
    ],
  },
  {
    name: 'Xiaomi Mi Smart Band 7',
    description: '1.62-inch AMOLED screen, fitness tracking, 14-day battery.',
    price: 49,
    category: 'Electronics',
    brand: 'Xiaomi',
    stock: 50,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Mi Smart Band 7' },
    ],
  },
  {
    name: 'GoPro HERO11 Black',
    description: '5.3K video, HyperSmooth 5.0, waterproof action camera.',
    price: 499,
    category: 'Electronics',
    brand: 'GoPro',
    stock: 9,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'GoPro HERO11' },
    ],
  },
  {
    name: 'Samsung Galaxy Watch 5 Pro',
    description: 'Advanced fitness tracking, 80-hour battery life.',
    price: 449,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 6,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Galaxy Watch 5 Pro' },
    ],
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser detects dust, powerful suction, HEPA filtration.',
    price: 699,
    category: 'Home',
    brand: 'Dyson',
    stock: 5,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Dyson V15 Vacuum' },
    ],
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-functional electric pressure cooker.',
    price: 99,
    category: 'Home',
    brand: 'Instant Pot',
    stock: 20,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Instant Pot Duo' },
    ],
  },
  {
    name: 'Philips Hue Smart Bulbs',
    description: 'Color-changing smart LED bulbs, voice control.',
    price: 59,
    category: 'Home',
    brand: 'Philips',
    stock: 25,
    images: [
      {
        url: 'https://via.placeholder.com/150',
        altText: 'Philips Hue Smart Bulbs',
      },
    ],
  },
  {
    name: 'Amazon Echo Dot (5th Gen)',
    description: 'Smart speaker with Alexa voice assistant.',
    price: 49,
    category: 'Electronics',
    brand: 'Amazon',
    stock: 35,
    images: [
      { url: 'https://via.placeholder.com/150', altText: 'Amazon Echo Dot' },
    ],
  },
  {
    name: 'Roku Streaming Stick 4K',
    description: '4K HDR streaming with voice remote.',
    price: 49,
    category: 'Electronics',
    brand: 'Roku',
    stock: 40,
    images: [
      {
        url: 'https://via.placeholder.com/150',
        altText: 'Roku Streaming Stick 4K',
      },
    ],
  },
];

// Seed database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Existing products removed');

    await Product.insertMany(products);
    console.log('New products added');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  }
};

// Run seeder
seedDatabase();
