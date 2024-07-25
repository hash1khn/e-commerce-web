const express= require('express');
const connectDB = require('./config/db');
const http = require('http');
const cors = require('cors'); 
const agenda = require('../backend/config/agenda');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoriesRoutes =require('./routes/categoriesRoutes');
const authenticateToken = require('./middlewares/auth');
const paymentRoutes = require('./routes/paymentRoutes');
const morgan=require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended:true }));
app.use('/uploads', express.static('uploads'));
// Middleware for logging requests
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  };

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An error occurred!', error: err.message });
  };

app.use(logger);

// Connect to database
connectDB();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${process.env.PORT}`));

(async function () {
  await agenda.start(); // Start agenda
})();
