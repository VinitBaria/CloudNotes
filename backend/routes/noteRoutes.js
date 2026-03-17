const express = require('express');
const multer = require('multer');
const Note = require('../models/Note');
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');
const cloudinaryStorage = require('../config/cloudinary');

const router = express.Router();

const upload = multer({ storage: cloudinaryStorage });

router.get('/', async (req, res) => {
  try {
    const { q, subject, price } = req.query;
    
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { authorName: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    if (req.query.department && req.query.department !== 'All') {
      query.department = req.query.department;
    }
    
    if (price && price !== 'All') {
      if (price === 'Free') query.price = 0;
      else if (price === 'Under ₹50') { query.price = { $gt: 0, $lt: 50 }; }
      else if (price === '₹50+') { query.price = { $gte: 50 }; }
    }

    const notes = await Note.find(query).sort({ rating: -1, downloads: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ downloads: -1, rating: -1 }).limit(4);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('author', 'name avatar');
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/', protect, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, subject, college, price, semester, description, department, pages, tags } = req.body;
    
    const noteFile = req.files['file'] ? req.files['file'][0] : null;
    const thumbFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    // Use Cloudinary's detected page count if available, otherwise fallback to manual input
    const detectedPages = noteFile && noteFile.pages ? noteFile.pages : (Number(pages) || 0);

    const note = new Note({
      title,
      subject,
      college,
      price: Number(price) || 0,
      semester: Number(semester) || 1,
      description,
      department: department || 'General',
      pages: detectedPages,
      authorName: req.user.name,
      author: req.user._id,
      fileUrl: noteFile ? noteFile.path : '',
      thumbnailUrl: thumbFile ? thumbFile.path : '',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [],
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ note: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Check if user already reviewed
    const existingReview = await Review.findOne({ note: noteId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this note' });
    }

    const isFree = note.price === 0;
    const review = new Review({
      note: noteId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      verified: !isFree
    });

    await review.save();

    // Update note rating
    const reviews = await Review.find({ note: noteId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    note.rating = avgRating;
    await note.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


router.post('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.downloads += 1;
    await note.save();
    
    res.json({ message: 'Download count updated', downloads: note.downloads });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
