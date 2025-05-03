const express = require("express");
const { createPaymentOrder, verifyPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authMiddleware, createPaymentOrder);
paymentRouter.post("/verify", authMiddleware, verifyPayment);

module.exports = paymentRouter;