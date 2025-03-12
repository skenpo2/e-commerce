const { validateRegistration, validateLogin } = require('../utils/validator');

const registerUser = async (req, res) => {
  const data = req.body;

  const { error } = validateRegistration(data);
};
