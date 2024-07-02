const express = require('express');
const router = express.Router();
const {createOrder,getOrder,getUserOrders} = require('../controllers/orderController');

router.post('/:userId/create', createOrder);
router.get('/:orderId', getOrder);
router.get('/user/:userId', getUserOrders);

module.exports = router;
