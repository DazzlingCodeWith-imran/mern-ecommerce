const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://bazaarhubfashion.netlify.app"
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Corrected route imports (lowercase 'routes')
const userRouter = require("./Routes/User");
const productRouter = require("./Routes/productRoutes");
const orderRouter = require("./Routes/orderRoutes");
const paymentRouter = require("./Routes/paymentRoutes");

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
