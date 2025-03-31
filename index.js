require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const connectDB = require('./databases/connectDB');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// routes import
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 5000;
const DatabaseUrl = process.env.MONGO_URI;

connectDB(DatabaseUrl);

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request  to ${req.url}`);
  logger.info(`Request body,  ${req.body} `);
  next();
});

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/review', reviewRoutes);

// Handle 404 Errors (Page Not Found)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Page not found' });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  logger.info('MongoDB is connected');
  app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
    logger.info(`App is running on ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  logger.warn(`Error occurs, DB connection failed`);
});
