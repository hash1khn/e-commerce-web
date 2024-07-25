const express = require('express');
const { createOrder, updateOrderAndClearCart, getOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken, admin } = require('../middlewares/auth');
const router = express.Router();

router.post('/:userId/create-order', authenticateToken, createOrder);
router.post('/:orderId/:userId/confirm-payment', authenticateToken, updateOrderAndClearCart);
router.get('/:orderId', authenticateToken, getOrder);
router.get('/user/:userId', authenticateToken, getUserOrders);
router.put('/update-status/:orderId', authenticateToken, admin, updateOrderStatus);

module.exports = router;
