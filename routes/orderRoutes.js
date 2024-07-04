const express = require('express');
const router = express.Router();
const {createOrder,getOrder,getUserOrders} = require('../controllers/orderController');
const {authenticateToken}= require('../middlewares/auth');

router.post('/:userId/create',authenticateToken, createOrder);
router.get('/:orderId',authenticateToken, getOrder);
router.get('/user/:userId',authenticateToken, getUserOrders);

module.exports = router;
