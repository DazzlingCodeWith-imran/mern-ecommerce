const OrderModel = require("../models/Order");
const mongoose = require("mongoose");
require("dotenv").config();

// Place Order with Dummy Payment
const placeOrder = async (req, res) => {
  try {
    const { items, totalPrice, address } = req.body;
    const userId = req.user.userId;

    const user = await require("../models/User").findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const dummyPaymentOrder = {
      id: `dummy_order_${Date.now()}`,
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await OrderModel.create({
      userId,
      items,
      totalPrice,
      address,
      paymentRequestId: dummyPaymentOrder.id,
      status: "Pending",
    });
    

    res.status(201).json({
      success: true,
      message: "Order placed (dummy payment), please complete payment",
      data: {
        orderId: order._id,
        razorpayOrderId: dummyPaymentOrder.id,
        amount: dummyPaymentOrder.amount,
        key: "dummy_key_test",
      },
    });
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to place order: ${error.message || "Unknown error"}`,
    });
  }
};

// Dummy Webhook Handler (for testing)
const handleWebhook = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    const order = await OrderModel.findOne({ paymentRequestId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = "Processing";
    order.paymentId = razorpay_payment_id || `dummy_payment_${Date.now()}`;
    await order.save();

    res.status(200).send("Webhook received (dummy)");
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).send(`Webhook processing failed: ${error.message}`);
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await OrderModel.find({ userId }).populate("items.productId");
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch orders: ${error.message}`,
    });
  }
};

// Get All Orders (Admin)
const getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    let query = {};

    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        query = { _id: search }; // Exact match for _id
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID format",
        });
      }
    }

    const orders = await OrderModel.find(query)
      .populate("userId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalOrders = await OrderModel.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: { orders, totalPages },
    });
  } catch (error) {
    console.error("Get admin orders error:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch orders: ${error.message}`,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order, // Return updated order
    });
  } catch (error) {
    console.error("Update order status error:", error.message);
    res.status(500).json({
      success: false,
      message: `Failed to update order status: ${error.message}`,
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  handleWebhook,
};