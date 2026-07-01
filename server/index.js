const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { validateEnv } = require("./config/env");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");
const { verifyEmailTransport, isEmailConfigured } = require("./utils/email");

const cors = require("cors");

try {
  validateEnv();
} catch (error) {
  console.error("Environment configuration error:", error.message);
  process.exit(1);
}

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    if (isEmailConfigured()) {
      try {
        await verifyEmailTransport();
        console.log("Email service verified and ready");
      } catch (error) {
        console.error("Email service configuration error:", error.message);
      }
    } else {
      console.warn("Email service is not configured for this environment");
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
