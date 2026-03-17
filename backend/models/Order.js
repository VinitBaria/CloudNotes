const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  lemonSqueezyOrderId: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'pending', 'completed', 'failed'], default: 'created' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
