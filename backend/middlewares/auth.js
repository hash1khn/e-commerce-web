const jwt = require('jsonwebtoken');
const User= require('../model/userModel');

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("🚀 ~ authenticateToken ~ verified:", verified)
    
    const user= await User.findById(verified._id)

    // console.log('verification:',verified)
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};
//Middleware to check if user is admin

const admin=(req,res,next) => {
  if (req.user && req.user.role==='admin'){
    next();
  }
  else{
    return res.status(403).json({message:"You are not authorized as administrator"})
  }
};

module.exports = {authenticateToken,admin};
