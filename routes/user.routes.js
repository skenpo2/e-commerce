const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} = require('../controllers/user.controller');
const verifyRole = require('../middlewares/verifyRole');

router.get('/:userId', verifyJWT, getUser);

//  @user access
router.delete('/', verifyJWT, deleteUser);
router.put('/', verifyJWT, updateUser);
// @admin access
router.get('/', verifyJWT, verifyRole, getAllUsers);

module.exports = router;
