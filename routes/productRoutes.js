const express = require('express');
const upload = require('../config/multerConfig');
const {
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllProducts
} = require('../controllers/productController');
const router = express.Router();
const {authenticateToken,admin} =require('../middlewares/auth');

// Create a new product
router.post('/create', authenticateToken, admin, upload, createProduct);
// can be access bt public
router.get('/get-all-products', getAllProducts)
// Get, update, and delete a product by ID
router.get('/get-single-product/:id',getProductById)

router.put('/update-single-product/:id', authenticateToken, admin, upload, updateProductById);
router.delete('/delete-single-product/:id',authenticateToken,admin, deleteProductById)

module.exports = router;
