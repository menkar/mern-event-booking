const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true,
    },
    action: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        default: 'account_verification',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
})

module.exports = mongoose.model("OTP", otpSchema);
