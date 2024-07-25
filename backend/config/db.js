const mongoose = require('mongoose')

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{

        });
    console.log('Connected to DB',process.env.MONGO_URI);
    }
    catch(err){
    }
}
module.exports = connectDB;