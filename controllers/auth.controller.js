const { validateRegistration, validateLogin } = require('../utils/validator');
const customError = require('../utils/customError');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateJWT');

const registerUser = async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const { email, password, name } = req.body;

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return res.status(400).json({
      success: false,
      message: 'User already exist',
    });
  }

  const newUser = new User({ email, password, name });

  await newUser.save();
  res.status(201).json({
    success: true,
    data: newUser,
  });
};

const loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  const { email, password } = req.body;

  const isUser = await User.findOne({ email });

  if (!isUser) {
    return res.status(400).json({
      success: false,
      message: 'User does not exist',
    });
  }

  const isValidPassword = await isUser.verifyPassword(password);

  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect Credentials',
    });
  }

  const accessToken = generateAccessToken(isUser);

  const refreshToken = generateRefreshToken(isUser);

  res
    .status(200)
    .cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: isUser,
      token: accessToken,
    });
};

module.exports = { registerUser, loginUser };
