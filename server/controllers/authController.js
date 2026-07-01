const bcrypt = require("bcryptjs");
const User = require('../models/User');
const OTP = require("../models/Otp");
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require("../utils/email");
const { normalizeOtp, normalizeEmail } = require("../utils/otpHelpers");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async(req, res) => {
    const {name, email, password} = req.body;

    let userExists = await User.findOne({email});
    if(userExists) {
       return res.status(400).json({error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    try {
        const user = await User.create({name, email, password: hashedPassword, role: "user", isVerified: false});
        
        const otp = generateOtp();
        const normalizedEmail = normalizeEmail(email);

        await OTP.findOneAndDelete({ email: normalizedEmail, action: 'account_verification' });
        await OTP.create({ email: normalizedEmail, otp, action: 'account_verification' });

        try {
            await sendOTPEmail(email, otp, 'account_verification');
        } catch (emailError) {
            await User.findByIdAndDelete(user._id);
            await OTP.findOneAndDelete({ email: normalizedEmail, action: 'account_verification' });
            console.error('Registration email failed:', emailError.message);
            return res.status(503).json({
                error: emailError.message || 'Unable to send verification email. Please try again later.',
            });
        }
        
        res.status(201).json({message: "User registered successfully. Please check your email for OTP to verify your account.",
            email: user.email
        });

    } catch(error) {
        console.error("Failed to register user", error);
        res.status(400).json({error: error.message})
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        if (!user.isVerified && user.role !== "admin") {
            const otp = generateOtp();
            const normalizedEmail = normalizeEmail(user.email);
            await OTP.findOneAndDelete({ email: normalizedEmail, action: 'account_verification' });
            await OTP.create({ email: normalizedEmail, otp, action: 'account_verification' });

            try {
                await sendOTPEmail(user.email, otp, 'account_verification');
            } catch (emailError) {
                console.error('Login OTP email failed:', emailError.message);
                return res.status(503).json({
                    message: emailError.message || 'Unable to send verification email. Please try again later.',
                    needsVerification: true,
                    email: user.email,
                });
            }

            return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email});
        }

        res.json({
            message: "Login successful",
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch(error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

const verifyOtp = async(req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const otpCode = normalizeOtp(req.body.otp);

        if (!otpCode || otpCode.length !== 6) {
            return res.status(400).json({ message: 'Please enter a valid 6-digit OTP' });
        }

        const validOtp = await OTP.findOne({ email, otp: otpCode, action: 'account_verification' });

        if (!validOtp) {
            return res.status(400).json({message: 'Invalid or expired OTP'});
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();
        await OTP.deleteOne({ _id: validOtp._id});

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });

    } catch(error) {
        res.status(500).json({message: 'Server Error'});
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyOtp
}