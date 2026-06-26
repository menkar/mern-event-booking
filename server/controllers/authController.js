const bcrypt = require("bcryptjs");
const User = require('../models/User');
const OTP = require("../models/Otp");
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require("../utils/email");

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
        console.log(`OTP for ${email} : ${otp}`);

        await OTP.create({email, otp, action: "account_verification"});
        await sendOTPEmail(email, otp, 'account_verification');
        
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
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!user || !isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        if (!user.isVerified && user.role !== "admin") {
            const otp = generateOtp();
            await OTP.findOneAndDelete({email: user.email, action: 'account_verification'});
            await OTP.create({email: user.email, otp, action: 'account_verification'});
            await sendOTPEmail(user.email, otp, 'account_verification');
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
        const {email, otp} = req.body;
        const validOtp = await OTP.findOne({email, otp, action: 'account_verification'});

        if (!validOtp) {
            return res.status(400).json({message: 'Invalid or expired OTP'});
        }

        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true});
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