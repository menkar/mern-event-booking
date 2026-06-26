const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");

const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
. catch((error)=> {
    console.error("Error connecting to  MongoDB : ", error);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
})