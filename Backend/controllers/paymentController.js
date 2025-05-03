const OrderModel = require("../models/Order");

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, address, items } = req.body;
    const userId = req.user.userId;

    const dummyOrder = {
      id: `dummy_order_${Date.now()}`,
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
    };

    const order = await OrderModel.create({
      userId,
      items: items || [],
      totalPrice: amount / 100,
      address: address || "default address",
      paymentRequestId: dummyOrder.id,
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      order: dummyOrder,
      message: "Payment initiated (dummy)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to create payment order: ${error.message || "Unknown error"}`,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findOne({ paymentRequestId: orderId });
    if (order) {
      order.status = "Processing";
      order.paymentId = `dummy_payment_${Date.now()}`;
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully (dummy)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to verify payment: ${error.message || "Unknown error"}`,
    });
  }
};

module.exports = { createPaymentOrder, verifyPayment };