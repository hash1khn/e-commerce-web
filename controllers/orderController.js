const Order = require('../model/orderModel');
const User = require('../model/userModel');

const createOrder = async (req, res) => {
  const { userId } = req.params;
  const { address, paymentMethod, cardDetails } = req.body;

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

    const cart = user.cart;
    const products = cart.products.map(product => ({
      productId: product.productId._id,
      quantity: product.quantity,
      totalOfEachProduct: product.totalOfEachProduct,
    }));

    const orderData = {
      userId: user._id,
      products,
      totalPrice: cart.totalPrice,
      address,
      paymentMethod,
    };

    if (paymentMethod === 'Card') {
      orderData.cardDetails = cardDetails;
    }

    const order = new Order(orderData);

    await order.save();

    // Clear the user's cart
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
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
module.exports={
    createOrder,
    getOrder,
    getUserOrders,
}
