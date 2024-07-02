const express = require('express');
const authenticateToken = require('../middlewares/auth');
const { register, login, forgotPassword,resetPassword,verifyEmail} = require('../controllers/authController');
const {
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
router.get('/:id', authenticateToken,getUserById);

router.put('/:id', authenticateToken,updateUserById);

router.delete('/:id',authenticateToken,deleteUserById);

module.exports = router;
