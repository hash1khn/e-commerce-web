const express = require('express');
const router = express.Router();
const {
    addProductToCart,
    removeProductFromCart,
    getCart,
    updateProductQuantity
} = require('../controllers/cartController');

router.post('/:userId/add',addProductToCart);
router.delete('/:userId/remove', removeProductFromCart);
router.get('/:userId', getCart);
router.put('/:userId/update', updateProductQuantity);

module.exports = router;
