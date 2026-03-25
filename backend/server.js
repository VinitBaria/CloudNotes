const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

require('./config/passport')(passport);

const app = express();

app.set('trust proxy', 1); // Trust Render's proxy to read HTTPS headers

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use((req, res, next) => {
  if (req.originalUrl.includes('/api/payment/webhook')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Public: announcements (no auth needed)
const { Announcement, SiteSettings, College } = require('./models/AdminData');
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(5);
    res.json(announcements);
  } catch (e) {
    res.json([]);
  }
});

// Public: site settings (maintenance mode, etc.)
app.get('/api/settings', async (req, res) => {
  try {
    const [settings, colleges] = await Promise.all([
      SiteSettings.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, returnDocument: 'after' }),
      College.find().sort({ name: 1 })
    ]);
    res.json({ ...settings.toObject(), colleges });
  } catch (e) {
    res.json({ maintenanceMode: false, colleges: [] });
  }
});

app.get('/', (req, res) => {
  res.send('StudyHub API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
