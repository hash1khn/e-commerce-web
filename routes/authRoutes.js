const express = require('express');
const {authenticateToken,admin} = require('../middlewares/auth');
const { register, login, forgotPassword,resetPassword,verifyEmail} = require('../controllers/authController');
const {
  getUser,
    getUserById,
    updateUserById,
    deleteUserById,
    updateByUser,
    uploadProfilePicture
  } = require('../controllers/authController');
const mo = require('../config/multerConfig');
const router = express.Router();
const User= require('../model/userModel');
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token',resetPassword);
router.post('/verify-email/:token', verifyEmail);
//Upload profile picture
router.post('/upload-profile-picture', authenticateToken, upload, uploadProfilePicture);


// Protect routes with JWT middleware
router.get('/get-single-user/:id', authenticateToken,getUserById);

router.put('/update-user/:id', authenticateToken,admin,updateUserById);
router.put('/update-by-user',authenticateToken,updateByUser)
router.get('/get-user', authenticateToken,getUser)
router.delete('/delete-user/:id',authenticateToken,admin,deleteUserById);

// Admin routes to manage users
router.get('/admin/users', authenticateToken, admin, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = router;
