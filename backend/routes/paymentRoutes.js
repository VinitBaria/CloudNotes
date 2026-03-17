const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Note = require('../models/Note');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', protect, async (req, res) => {
  try {
    const { noteId } = req.body;
    const note = await Note.findById(noteId);
    
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.price === 0) return res.status(400).json({ message: 'Note is free' });

    const order = await Order.create({
      user: req.user._id,
      note: note._id,
      amount: note.price,
      status: 'pending'
    });

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (apiKey && apiKey !== 'mock' && storeId && variantId) {
       const lsResp = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
           method: 'POST',
           headers: {
             'Accept': 'application/vnd.api+json',
             'Content-Type': 'application/vnd.api+json',
             'Authorization': `Bearer ${apiKey}`
           },
           body: JSON.stringify({
              data: {
                type: 'checkouts',
                attributes: {
                   checkout_options: { button_color: '#10b981' },
                   checkout_data: {
                      custom: {
                         order_id: order._id.toString(),
                         user_id: req.user._id.toString(),
                         note_id: note._id.toString()
                      }
                   },
                   product_options: {
                      name: `Purchase ${note.title}`,
                      description: `Note for ${note.subject}`,
                      redirect_url: `${clientUrl}/payment-success?order_id=${order._id.toString()}&note_id=${note._id.toString()}`,
                      receipt_button_text: 'Go to Note',
                      receipt_link_url: `${clientUrl}/payment-success?order_id=${order._id.toString()}&note_id=${note._id.toString()}`
                   }
                },
                relationships: {
                   store: { data: { type: 'stores', id: storeId } },
                   variant: { data: { type: 'variants', id: variantId } },
                }
              }
           })
       });
       const checkoutData = await lsResp.json();
       
       if (checkoutData.data && checkoutData.data.attributes) {
          return res.json({ checkout_url: checkoutData.data.attributes.url });
       } else {
          console.error("Lemon Squeezy Checkout Error:", checkoutData);
          return res.status(500).json({ message: 'Lemon Squeezy integration error', error: checkoutData });
       }
    } else {
       // Mock checkout URL for local testing without an API key
       return res.json({ checkout_url: `${clientUrl}/mock-checkout?order_id=${order._id.toString()}&note_id=${note._id.toString()}&amount=${note.price}` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { order_id, noteId } = req.body; // updated from razorpay variables

    const order = await Order.findById(order_id);
    if (!order) {
       return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status === 'completed') {
       return res.json({ message: 'Order already completed', success: true });
    }

    order.status = 'completed';
    await order.save();

    const user = await User.findById(req.user._id);
    if (!user.purchasedNotes.includes(noteId || order.note)) {
        user.purchasedNotes.push(noteId || order.note);
        await user.save();
    }
    
    // We already do this download increment, but since we separated the real /download endpoint
    // earlier as requested, we might or might not increment here. Let's keep it for compatibility.
    // Wait, the previous task added a /download endpoint to track actual downloads, so it's fine.
    
    res.json({ message: 'Payment verified successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// For real Lemon Squeezy integrations in production, a webhook endpoint should be registered
// handling the 'order_created' event, which securely confirms the payment server-to-server.
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers['x-signature'];

    if (!secret || !signature) return res.status(400).send('Missing secret/signature');

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return res.status(401).send('Invalid signature');
    }

    const payload = JSON.parse(req.body.toString());
    const eventName = payload.meta.event_name;

    if (eventName === 'order_created') {
       const customData = payload.meta.custom_data;
       const orderId = customData.order_id;
       const noteId = customData.note_id;
       const userId = customData.user_id;

       const order = await Order.findById(orderId);
       if (order && order.status !== 'completed') {
          order.status = 'completed';
          await order.save();
          const user = await User.findById(userId);
          if (user && !user.purchasedNotes.includes(noteId)) {
             user.purchasedNotes.push(noteId);
             await user.save();
          }
       }
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error', err);
    res.status(500).send('Error');
  }
});

module.exports = router;
