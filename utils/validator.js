const Joi = require('joi');

const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateEditedUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string()
      .valid('electronics', 'fashion', 'home', 'beauty', 'sports', 'other')
      .required(),
    brand: Joi.string().min(2).max(50).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().required(),
    }).required(),
    discount: Joi.number().min(0).max(100).default(0),
    isFeatured: Joi.boolean().default(false),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateEditedUser,
  validateProduct,
};
