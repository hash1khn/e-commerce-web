require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../model/orderModel');
const User = require('../model/userModel');
const agenda = require('../config/agenda');


const createOrder = async (req, res) => {
  const userId = req.params.userId;
  const { paymentMethod } = req.body;

  try {
    const user = await User.findById(userId).populate({
      path: 'cart',
      populate: {
        path: 'products.productId',
      },
    });

    if (!user || !user.cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const address = user.address;
    if (!address) {
      return res.status(400).json({ message: 'User address not found' });
    }

    const cart = user.cart;
    const products = cart.products.map(product => ({
      productId: product.productId._id,
      quantity: product.quantity,
      totalOfEachProduct: product.totalOfEachProduct,
    }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.totalPrice * 100, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const orderData = {
      userId: user._id,
      products,
      totalPrice: cart.totalPrice,
      address,
      paymentMethod,
      status: 'Pending',
      paymentIntentId: paymentIntent.id,
    };

    const order = new Order(orderData);
    await order.save();

    // Schedule the job to update order status after 10 minutes
    await agenda.schedule('in 1 minute', 'process order', { orderId: order._id });

    res.status(201).json({ order, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrderAndClearCart = async (req, res) => {
  const { orderId, userId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.save();

    const user = await User.findById(userId).populate('cart');
    if (!user || !user.cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let cart = user.cart;
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: 'Order updated and cart cleared successfully' });
  } catch (error) {
    console.error('Error updating order or clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('products.productId');

    if (!orders) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit event to notify user and seller
    req.io.emit('orderStatusUpdated', { orderId: updatedOrder._id, status: updatedOrder.status });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  updateOrderAndClearCart,
  getOrder,
  getUserOrders,
  updateOrderStatus,
};
