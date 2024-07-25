const Agenda = require('agenda');
require('dotenv').config();
const Order = require('../model/orderModel'); // Adjust the path to your Order model

// MongoDB connection string
const mongoConnectionString = process.env.MONGO_URI; // Ensure this is defined in your .env file

const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'agendaJobs' } });

// Define a job for processing orders
agenda.define('process order', async (job) => {
  const { orderId } = job.attrs.data;
  console.log(`Processing order ${orderId}`);

  const order = await Order.findById(orderId);
  

  if (order && order.status === 'Pending') {
    order.status = 'Processed';
    await order.save();
    console.log(`Order ${orderId} status updated to Processed`);
  } else {
    console.log(`Order ${orderId} not found or already processed`);
  }
});

(async function () {
  await agenda.start();
  console.log('Agenda started');
})();

module.exports = agenda;
