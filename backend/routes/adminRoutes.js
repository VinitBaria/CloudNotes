const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const { College, Department, Subject, Announcement, SiteSettings } = require('../models/AdminData');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── Seed defaults on first run ───────────────────────────────────────────────
const seedDefaults = async () => {
  try {
    const defaultColleges = [
      "Government Engineering College, Surat", "SVNIT Surat", "NIT Surat",
      "DDU Nadiad", "LD College of Engineering, Ahmedabad",
      "Nirma University, Ahmedabad", "IIT Bombay", "IIT Delhi", "BITS Pilani",
    ];
    const defaultDepts = [
      "Computer Science", "Mechanical Engineering", "Electrical Engineering",
      "Civil Engineering", "Electronics & Communication", "Information Technology",
      "Mathematics & Science", "Chemical Engineering", "Other",
    ];
    const defaultSubjects = {
      "Computer Science": ["Operating Systems", "Data Structures & Algorithms", "Database Management (DBMS)", "Computer Networks", "Artificial Intelligence", "Machine Learning", "Web Development", "Compiler Design"],
      "Mechanical Engineering": ["Thermodynamics", "Machine Design", "Fluid Mechanics", "Heat & Mass Transfer", "Manufacturing Processes", "Robotics"],
      "Electrical Engineering": ["Circuit Theory", "Power Systems", "Control Systems", "Electrical Machines", "Digital Electronics", "Signal Processing"],
      "Civil Engineering": ["Structural Analysis", "Geotechnical Engineering", "Surveying", "Transportation Engineering", "Concrete Technology"],
      "Electronics & Communication": ["Signal Processing", "Analog Circuits", "Digital Logic Design", "VLSI Design", "Embedded Systems", "Optical Communication"],
      "Information Technology": ["Cloud Computing", "Information Security", "Data Mining", "Cryptography", "Big Data Analytics"],
      "Mathematics & Science": ["Calculus", "Linear Algebra", "Physics I", "Physics II", "Engineering Chemistry", "Probability & Statistics"],
      "Chemical Engineering": ["Chemical Reaction Engineering", "Thermodynamics", "Mass Transfer", "Process Control"],
      "Other": ["General", "Humanities", "MBA", "Commerce"],
    };

    // Seed colleges if none exist
    const collegeCount = await College.countDocuments();
    if (collegeCount === 0) {
      await College.insertMany(defaultColleges.map(name => ({ name })));
    }

    // Seed departments if none exist
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      await Department.insertMany(defaultDepts.map(name => ({ name })));
    }

    // Seed subjects if none exist
    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      const subjectDocs = [];
      for (const [dept, subjects] of Object.entries(defaultSubjects)) {
        for (const name of subjects) {
          subjectDocs.push({ name, department: dept });
        }
      }
      await Subject.insertMany(subjectDocs);
    }

    // Seed site settings singleton
    await SiteSettings.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, returnDocument: 'after' });
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
seedDefaults();

// ─── APPLY AUTH TO ALL ROUTES ────────────────────────────────────────────────
router.use(protect, adminOnly);

const Order = require('../models/Order');

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalNotes, freeNotes, paidNotes, orders] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
      Note.countDocuments({ price: 0 }),
      Note.countDocuments({ price: { $gt: 0 } }),
      Order.find({ status: 'completed' }),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
    const notesWithDownloads = await Note.find().select('downloads');
    const totalDownloads = notesWithDownloads.reduce((acc, n) => acc + (n.downloads || 0), 0);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email college role createdAt');
    const recentNotes = await Note.find().sort({ createdAt: -1 }).limit(5).select('title subject college authorName price downloads createdAt');
    
    res.json({ 
      totalUsers, 
      totalNotes, 
      freeNotes, 
      paidNotes, 
      totalRevenue, 
      totalDownloads,
      recentUsers, 
      recentNotes 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ─── COLLEGES ────────────────────────────────────────────────────────────────
router.get('/colleges', async (req, res) => {
  const colleges = await College.find().sort({ name: 1 });
  res.json(colleges.map(c => ({ _id: c._id, name: c.name })));
});

router.post('/colleges', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'College name is required' });
    const exists = await College.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: 'College already exists' });
    const college = await College.create({ name: name.trim() });
    const all = await College.find().sort({ name: 1 });
    res.json({ message: 'College added', college, colleges: all.map(c => ({ _id: c._id, name: c.name })) });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/colleges/:id', async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    const all = await College.find().sort({ name: 1 });
    res.json({ message: 'College removed', colleges: all.map(c => ({ _id: c._id, name: c.name })) });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
router.get('/departments', async (req, res) => {
  const depts = await Department.find().sort({ name: 1 });
  res.json(depts.map(d => ({ _id: d._id, name: d.name })));
});

router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Department name is required' });
    const exists = await Department.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: 'Department already exists' });
    const dept = await Department.create({ name: name.trim() });
    const all = await Department.find().sort({ name: 1 });
    res.json({ message: 'Department added', dept, departments: all.map(d => ({ _id: d._id, name: d.name })) });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (dept) {
      // Also remove all subjects belonging to this department
      await Subject.deleteMany({ department: dept.name });
    }
    const all = await Department.find().sort({ name: 1 });
    res.json({ message: 'Department removed', departments: all.map(d => ({ _id: d._id, name: d.name })) });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ─── SUBJECTS ────────────────────────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  const subjects = await Subject.find().sort({ department: 1, name: 1 });
  // Group by department
  const grouped = {};
  for (const s of subjects) {
    if (!grouped[s.department]) grouped[s.department] = [];
    grouped[s.department].push({ _id: s._id, name: s.name });
  }
  res.json(grouped);
});

router.post('/subjects', async (req, res) => {
  try {
    const { department, subject } = req.body;
    if (!department?.trim() || !subject?.trim()) return res.status(400).json({ message: 'Department and subject are required' });
    const exists = await Subject.findOne({ name: subject.trim(), department: department.trim() });
    if (exists) return res.status(400).json({ message: 'Subject already exists in this department' });
    const newSubject = await Subject.create({ name: subject.trim(), department: department.trim() });
    // Return all subjects grouped
    const all = await Subject.find().sort({ department: 1, name: 1 });
    const grouped = {};
    for (const s of all) {
      if (!grouped[s.department]) grouped[s.department] = [];
      grouped[s.department].push({ _id: s._id, name: s.name });
    }
    res.json({ message: 'Subject added', subject: newSubject, subjects: grouped });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    const all = await Subject.find().sort({ department: 1, name: 1 });
    const grouped = {};
    for (const s of all) {
      if (!grouped[s.department]) grouped[s.department] = [];
      grouped[s.department].push({ _id: s._id, name: s.name });
    }
    res.json({ message: 'Subject removed', subjects: grouped });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ─── NOTES MODERATION ────────────────────────────────────────────────────────
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.patch('/notes/:id/toggle-free', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.price = note.price > 0 ? 0 : 49;
    await note.save();
    res.json({ message: 'Note updated', note });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: 'after' }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user?.email === 'vinitbaria2006@gmail.com') return res.status(403).json({ message: 'Cannot delete super admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
router.get('/announcements', async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title?.trim() || !message?.trim()) return res.status(400).json({ message: 'Title and message are required' });
    const announcement = await Announcement.create({ title: title.trim(), message: message.trim(), type: type || 'info' });
    res.json({ message: 'Announcement posted', announcement });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, returnDocument: 'after' });
  res.json(settings);
});

router.put('/settings', async (req, res) => {
  try {
    const { siteName, allowRegistrations, maintenanceMode, featuredCollege } = req.body;
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { siteName, allowRegistrations, maintenanceMode, featuredCollege },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({ message: 'Settings saved', settings });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
