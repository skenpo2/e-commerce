const verifyRole = require('../utils/verifyRole');

const getAllUsers = async (req, res) => {
  const user = req.user;

  console.log(user);

  const isAdmin = verifyRole(user);
  console.log(isAdmin);

  res.status(200).json({
    success: true,
    message: 'logged',
  });
};

module.exports = { getAllUsers };
