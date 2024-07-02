const express = require('express');
const authenticateToken = require('../middlewares/auth');
const { register, login, forgotPassword,resetPassword,verifyEmail} = require('../controllers/authController');
const {
  getUser,
    getUserById,
    updateUserById,
    deleteUserById
  } = require('../controllers/authController');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token',resetPassword);
router.post('/verify-email/:token', verifyEmail);

// Protect routes with JWT middleware
router.get('/get-single-user/:id', authenticateToken,getUserById);

router.put('/update-user/:id', authenticateToken,updateUserById);

router.get('/get-user', authenticateToken,getUser)
router.delete('/delete-user/:id',authenticateToken,deleteUserById);

module.exports = router;
