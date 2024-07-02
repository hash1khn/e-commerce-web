const express = require('express');
const {
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllProducts
} = require('../controllers/productController');
const router = express.Router();

// Create a new product
router.post('/create', createProduct);

router.get('/get-all-products', getAllProducts)
// Get, update, and delete a product by ID
router.get('/get-single-product/:id',getProductById)

router.put('/update-single-product/:id',updateProductById)

router.delete('/delete-single-product/:id',deleteProductById)

module.exports = router;
