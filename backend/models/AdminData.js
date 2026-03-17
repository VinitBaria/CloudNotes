const mongoose = require('mongoose');

// ── College ──
const collegeSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true, trim: true } }, { timestamps: true });
const College = mongoose.model('College', collegeSchema);

// ── Department ──
const departmentSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true, trim: true } }, { timestamps: true });
const Department = mongoose.model('Department', departmentSchema);

// ── Subject ──
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
}, { timestamps: true });
subjectSchema.index({ name: 1, department: 1 }, { unique: true });
const Subject = mongoose.model('Subject', subjectSchema);

// ── Announcement ──
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
}, { timestamps: true });
const Announcement = mongoose.model('Announcement', announcementSchema);

// ── SiteSettings (singleton) ──
const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  siteName: { type: String, default: 'CloudNotes' },
  allowRegistrations: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  featuredCollege: { type: String, default: 'Government Engineering College, Surat' },
});
const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = { College, Department, Subject, Announcement, SiteSettings };
