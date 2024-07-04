const express = require('express');
const router = express.Router();
const {authenticateToken}=require('../middlewares/auth');
const {
    addProductToCart,
    removeProductFromCart,
    getCart,
    updateProductQuantity
} = require('../controllers/cartController');

router.post('/:userId/add',authenticateToken,addProductToCart);
router.delete('/:userId/remove', authenticateToken,removeProductFromCart);
router.get('/:userId',authenticateToken, getCart);
router.put('/:userId/update', authenticateToken,updateProductQuantity);

module.exports = router;
