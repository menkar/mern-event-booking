const express = require("express");
const { bookEvent, confirmBooking, getMyBookings, getEventBookingStatus, cancelBooking, sendBookingOTP } = require('../controllers/bookingController');
const { protect, admin } = require("../middlewares/auth");

const router = express.Router();

router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.get('/my', protect, getMyBookings);
router.get('/event/:eventId/status', protect, getEventBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;