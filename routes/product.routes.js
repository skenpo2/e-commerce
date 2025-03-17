const express = require('express');
const upload = require('../utils/multer');
const verifyRole = require('../middlewares/verifyRole');
const verifyJWT = require('../middlewares/verifyJWT');

const {
  addProduct,
  imageUpload,
  getSingleProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
} = require('../controllers/product.controller');
const router = express.Router();

// access: public
router.get('/', getAllProducts);
router.get('/:slug', getSingleProduct);

// access: admin
router.post(
  '/upload-image',
  verifyJWT,
  verifyRole,
  upload.single('my_file'),
  imageUpload
);
router.post('/add', verifyJWT, verifyRole, addProduct);
router.put('/edit/:slug', verifyJWT, verifyRole, editProduct);
router.delete('/delete/:slug', verifyJWT, verifyRole, deleteProduct);

module.exports = router;
