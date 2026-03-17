const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  college: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  semester: { type: Number, required: true },
  authorName: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String }, // Optional preview image
  tags: [{ type: String }],
  description: { type: String },
  pages: { type: Number, default: 0 },
  department: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

noteSchema.virtual('earnings').get(function() {
  return this.price * this.downloads;
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
