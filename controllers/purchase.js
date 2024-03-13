const Razorpay = require("razorpay");
const Order = require("../modals/order");
const crypto = require("crypto");
require("dotenv").config();


var rzp = new Razorpay({
  key_id: "rzp_test_DYdcKSZFWnzqnG",
  key_secret: "KlyBXp0zhjiCGwrt7ikfhgub",
});


exports.purchaseMembership = async (req, res) => {
  try {
    var options = {
      amount: 50000,
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await rzp.orders.create(options);
    console.log('dejhvfjehyw',order);
    await req.user.createOrder({ order_id: order.id, status: "PENDING" });

    return res.json({ order_id: order.id, key: rzp.key_id });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.successfulTransaction = async (req, res) => {
  try {
    const { payment_id, order_id,  razorpay_signature } = req.body;
    const order = await Order.findOne({ where: { order_id: order_id } });
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
    
    return res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal server error" });
  }

};

exports.failedTransaction = async (req, res) => {
  try {
    const { payment_id } = req.body;
    const order = await Order.findOne({ where: { paymentid: payment_id } });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.update({ status: 'FAILED' });

    return res.status(202).json({ success: true, message: "Transaction Failed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};