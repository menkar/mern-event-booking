const Booking = require("../models/Booking");
const Event = require("../models/Event");
const OTP = require("../models/Otp");
const { sendBookingEmail, sendOTPEmail } = require("../utils/email");
const { normalizeOtp, normalizeEmail } = require("../utils/otpHelpers");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const findActiveBooking = (userId, eventId) =>
    Booking.findOne({
        userId,
        eventId,
        status: { $in: ['pending', 'confirmed'] },
    });

const sendBookingOTP = async (req, res) => {
    try {
        const { eventId } = req.body;
        const email = normalizeEmail(req.user.email);

        if (eventId) {
            const existingBooking = await findActiveBooking(req.user._id, eventId);
            if (existingBooking) {
                return res.status(400).json({
                    message:
                        existingBooking.status === 'confirmed'
                            ? 'You already have a confirmed booking for this event'
                            : 'You already have a pending booking request for this event',
                });
            }
        }

        const otp = generateOtp();

        await OTP.findOneAndDelete({ email, action: 'event_booking' });
        await OTP.create({ email, otp, action: 'event_booking' });

        try {
            await sendOTPEmail(req.user.email, otp, 'event_booking');
        } catch (emailError) {
            await OTP.findOneAndDelete({ email, action: 'event_booking' });
            console.error('Booking OTP email failed:', emailError.message);
            return res.status(503).json({
                message: emailError.message || 'Unable to send OTP email. Please try again later.',
            });
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error?.message });
    }
};

const bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const otpCode = normalizeOtp(req.body.otp);
        const email = normalizeEmail(req.user.email);

        if (!otpCode || otpCode.length !== 6) {
            return res.status(400).json({ message: 'Please enter a valid 6-digit OTP' });
        }

        const validOtp = await OTP.findOne({
            email,
            otp: otpCode,
            action: 'event_booking',
        });

        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP for booking' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        const existingBooking = await findActiveBooking(req.user._id, eventId);

        if (existingBooking) {
            return res.status(400).json({ message: 'Already booked or pending' });
        }

        let booking;

        if (existingBooking?.status === 'cancelled') {
            existingBooking.status = 'pending';
            existingBooking.paymentStatus = 'not_paid';
            existingBooking.amount = event.ticketPrice;
            existingBooking.bookedAt = new Date();
            booking = await existingBooking.save();
        } else {
            booking = await Booking.create({
                userId: req.user._id,
                eventId,
                status: 'pending',
                paymentStatus: 'not_paid',
                amount: event.ticketPrice,
            });
        }

        await OTP.deleteOne({ _id: validOtp._id });

        res.status(201).json({ message: 'Booking request submitted', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error?.message });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus || req.body;
        const booking = await Booking.findById(req.params.id).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'confirmed') {
            return res.status(400).json({ message: 'Booking is already confirmed' });
        }

        const event = await Event.findById(booking.eventId._id);
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats are available to confirm this booking' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }

        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        try {
            await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);
        } catch (emailError) {
            console.error('Booking confirmation email failed:', emailError.message);
        }

        res.status(200).json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error ', error: error?.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user._id }).populate('eventId').sort({ createdAt: -1 });

        res.status(200).json({ message: 'Fetch bookings successfully', bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error?.message });
    }
};

const getEventBookingStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const booking = await findActiveBooking(req.user._id, eventId);

        if (!booking) {
            return res.json({ hasBooking: false });
        }

        res.json({
            hasBooking: true,
            booking: {
                _id: booking._id,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                amount: booking.amount,
                bookedAt: booking.bookedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error?.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const wasConfirmed = booking.status === 'confirmed';
        booking.status = 'cancelled';
        await booking.save();

        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error?.message });
    }
};

module.exports = {
    sendBookingOTP,
    bookEvent,
    confirmBooking,
    getMyBookings,
    getEventBookingStatus,
    cancelBooking,
};
