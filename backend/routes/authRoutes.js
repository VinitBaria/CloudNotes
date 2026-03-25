const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' for Vercel/Render cross-domain
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, college: college || '' });
    
    if (user) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.status(201).json({ _id: user._id, name: user.name, email: user.email, college: user.college || '', role: user.role });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.json({ _id: user._id, name: user.name, email: user.email, college: user.college || '', role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failed', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    setTokenCookie(res, token);
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login-failed', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    setTokenCookie(res, token);
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

router.get('/me', protect, async (req, res) => {
  try {
    const uploadedNotes = await Note.find({ author: req.user._id });
    res.json({
      ...req.user.toObject(),
      uploadedNotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.college = req.body.college || user.college;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        role: updatedUser.role,
        purchasedNotes: updatedUser.purchasedNotes,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
