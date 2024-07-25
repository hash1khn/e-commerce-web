const io = require('socket.io-client');
const socket = io.connect('http://localhost:8000'); // Replace with your server URL

const userId = '6683db600b1b6f8945634230'; // Replace with the actual user ID you want to test

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('join', userId);
});

socket.on('orderPlaced', (data) => {
  console.log('Order placed:', data);
});

socket.on('orderStatus', (data) => {
  console.log('Order status updated:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
