const express = require('express');
const upload = require('../utils/multer');

const {
  addProduct,
  imageUpload,
  getSingleProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
} = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:slug', getSingleProduct);
router.post('/upload-image', upload.single('my_file'), imageUpload);
router.post('/add', addProduct);
router.put('/edit/:slug', editProduct);
router.delete('/delete/:slug', deleteProduct);

module.exports = router;
