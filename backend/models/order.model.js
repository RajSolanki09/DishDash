import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out of delivery", "delivered"],
      default: "pending",
    },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAssignment", default: null },
    deliveryOtp: { type: String },
    assignedDeliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // ✅ NEW: Track when delivered and how much delivery boy earned
    deliveredAt: { type: Date, default: null },
    deliveryEarning: { type: Number, default: 0 }, // ₹50 per delivery
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    deliveryAddress: {
      text: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrders: [shopOrderSchema],
    payment: {
      type: Boolean,
      default: false
    },
    razorpayOrderId: {
      type: String,
      default: ''
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;