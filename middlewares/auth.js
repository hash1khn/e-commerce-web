const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log('verification:',verified)
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticateToken;
