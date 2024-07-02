const User = require('../model/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  const { username, email, address, phoneNumber, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const emailVerificationToken = crypto.randomBytes(10).toString('hex');
    user = new User({ username, email, address, phoneNumber, password,emailVerificationToken });

    await user.save();
    //send verification email
     const transporter = nodemailer.createTransport({
      host:"smtp-relay.brevo.com",
      port:587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tsl:{
        rejectUnauthorized:false,
      }
    });
    const mailOptions = {
      to: user.email,
      from: "hashirkhan.tech@gmail.com",
      subject: 'Email confirmation ',
      text: `You are receiving this because you have registered for an account.\n\n
      Please click on the following link, or paste this into your browser to verify your email address:\n\n
      http://${req.headers.host}/api/auth/verify-email/${emailVerificationToken}\n\n
      If you did not request this, please ignore this email.\n`,
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Verification email sent: ' + info.response);
      res.status(200).json({ message: 'Registration successful. Please check your email to verify your account.' });
    });
  } catch (err) {
    res.status(400).json({ error: 'Unable to register the user' });
  }
};
// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Incorrect email/password' });
    }
    else if (!user.isVerified) {
      return res.status(400).json({ message: 'Email is not verified' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(400).json({ error: 'Error during login' });
  }
};
// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    else if(!user.isVerified){
      return res.status(404).json({ message: 'Please verify your email first!' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save({ validateBeforeSave: false });

    // Log the reset token and user email
    console.log(`Reset Token: ${resetToken}`);
    console.log(`User Email: ${user.email}`);

    // Send email
    const transporter = nodemailer.createTransport({
      host:"smtp-relay.brevo.com",
      port:587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify the transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('Error configuring transporter:', error);
      } else {
        console.log('Transporter is configured correctly:', success);
      }
    });

    const mailOptions = {
      to: user.email,
      from: "hashirkhan.tech@gmail.com",
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent' });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password ,} = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, getUserById, updateUserById, deleteUserById,verifyEmail };
