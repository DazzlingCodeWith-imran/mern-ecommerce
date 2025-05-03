const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  paymentRequestId: { type: String, required: true },
  paymentId: { type: String },
  status: { type: String, default: "Pending", enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);