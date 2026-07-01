require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");
const OTP = require("./models/Otp");
const { EVENT_IMAGES } = require("./constants/eventImages");

const DEFAULT_PASSWORD = "Password@123";

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            Booking.deleteMany({}),
            OTP.deleteMany({}),
        ]);
        console.log("Cleared existing users, events, bookings, and OTPs");

        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@eventbooking.com",
                password: hashedPassword,
                role: "admin",
                isVerified: true,
            },
            {
                name: "Alice Johnson",
                email: "alice@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },
            {
                name: "Bob Smith",
                email: "bob@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: true,
            },
            {
                name: "Carol Williams",
                email: "carol@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: false,
            },
            {
                name: "David Brown",
                email: "david@example.com",
                password: hashedPassword,
                role: "user",
                isVerified: false,
            },
        ]);

        const [admin, alice, bob, carol, david] = users;
        console.log(`Seeded ${users.length} users (1 admin, 4 users — mixed verified/unverified)`);

        const events = await Event.insertMany([
            {
                title: "Summer Music Festival",
                description: "Outdoor live music with international artists.",
                date: new Date("2026-08-15T18:00:00.000Z"),
                location: "Central Park, New York",
                category: "Music",
                totalSeats: 500,
                availableSeats: 498,
                ticketPrice: 49.99,
                image: EVENT_IMAGES.music,
                createdBy: admin._id,
            },
            {
                title: "Global Tech Summit 2026",
                description: "Keynotes and workshops on AI, cloud, and web development.",
                date: new Date("2026-09-10T09:00:00.000Z"),
                location: "Convention Center, San Francisco",
                category: "Tech",
                totalSeats: 200,
                availableSeats: 200,
                ticketPrice: 129.0,
                image: EVENT_IMAGES.tech,
                createdBy: admin._id,
            },
            {
                title: "City Marathon Run",
                description: "Annual 42K marathon through downtown streets.",
                date: new Date("2026-10-05T06:00:00.000Z"),
                location: "Downtown, Chicago",
                category: "Sports",
                totalSeats: 100,
                availableSeats: 0,
                ticketPrice: 35.0,
                image: EVENT_IMAGES.sports,
                createdBy: admin._id,
            },
            {
                title: "Modern Art Expo",
                description: "Contemporary art exhibition with local creators.",
                date: new Date("2026-07-20T11:00:00.000Z"),
                location: "Art Gallery, Boston",
                category: "Arts",
                totalSeats: 50,
                availableSeats: 50,
                ticketPrice: 25.0,
                image: EVENT_IMAGES.arts,
                createdBy: admin._id,
            },
            {
                title: "Street Food Carnival",
                description: "Free entry food festival with global cuisines.",
                date: new Date("2026-11-12T12:00:00.000Z"),
                location: "Waterfront Plaza, Miami",
                category: "Food",
                totalSeats: 300,
                availableSeats: 300,
                ticketPrice: 0,
                image: EVENT_IMAGES.food,
                createdBy: admin._id,
            },
        ]);

        const [musicFest, techSummit, marathon, artExpo, foodCarnival] = events;
        console.log(`Seeded ${events.length} events (Music, Tech, Sports, Arts, Food)`);

        const bookings = await Booking.insertMany([
            {
                userId: alice._id,
                eventId: musicFest._id,
                status: "confirmed",
                paymentStatus: "paid",
                amount: musicFest.ticketPrice,
                bookedAt: new Date("2026-06-01T10:00:00.000Z"),
            },
            {
                userId: bob._id,
                eventId: musicFest._id,
                status: "confirmed",
                paymentStatus: "not_paid",
                amount: musicFest.ticketPrice,
                bookedAt: new Date("2026-06-02T14:30:00.000Z"),
            },
            {
                userId: alice._id,
                eventId: techSummit._id,
                status: "pending",
                paymentStatus: "not_paid",
                amount: techSummit.ticketPrice,
                bookedAt: new Date("2026-06-10T09:15:00.000Z"),
            },
            {
                userId: david._id,
                eventId: foodCarnival._id,
                status: "pending",
                paymentStatus: "not_paid",
                amount: foodCarnival.ticketPrice,
                bookedAt: new Date("2026-06-12T16:00:00.000Z"),
            },
            {
                userId: carol._id,
                eventId: artExpo._id,
                status: "cancelled",
                paymentStatus: "paid",
                amount: artExpo.ticketPrice,
                bookedAt: new Date("2026-06-05T11:00:00.000Z"),
            },
        ]);

        console.log(`Seeded ${bookings.length} bookings (confirmed, pending, cancelled)`);

        await OTP.insertMany([
            {
                email: carol.email,
                otp: "111111",
                action: "account_verification",
            },
            {
                email: david.email,
                otp: "222222",
                action: "account_verification",
            },
            {
                email: alice.email,
                otp: "333333",
                action: "event_booking",
            },
            {
                email: bob.email,
                otp: "444444",
                action: "event_booking",
            },
            {
                email: admin.email,
                otp: "555555",
                action: "account_verification",
            },
        ]);

        console.log("Seeded 5 OTP records (account_verification + event_booking)");
        console.log("\n--- Seed Summary ---");
        console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
        console.log("Admin login: admin@eventbooking.com");
        console.log("Verified users: alice@example.com, bob@example.com");
        console.log("Unverified users: carol@example.com, david@example.com");
        console.log("--------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();
