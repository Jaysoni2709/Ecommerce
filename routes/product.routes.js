const express = require('express');
const router = express.Router();
const {upload} = require('../utils/cloudinary')
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controllers');

const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Public
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Only
router.post('/', verifyToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
