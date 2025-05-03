const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Load environment variables
dotenv.config();
console.log("Loaded ENV:", process.env.JWT_SECRET_KEY); // For checking

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allowing React & Admin to communicate
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // For parsing JSON requests

// Importing Routes
const userRouter = require("./Routes/User");
const productRouter = require("./Routes/productRoutes");
const orderRouter = require("./Routes/orderRoutes");
const paymentRouter = require("./routes/paymentRoutes");

// Using Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);

// Serve React Frontend (User Side)
app.use(express.static(path.join(__dirname, "../Frontend/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/build/index.html"));
});

// Serve Admin Frontend
app.use("/admin", express.static(path.join(__dirname, "../admin-frontend/build")));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin-frontend/build/index.html"));
});

// Testing Route
app.get("/test", (req, res) => {
  res.send("Hello, world!");
});

// Starting the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
