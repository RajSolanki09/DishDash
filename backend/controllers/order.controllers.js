import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendDeliveryOtpMail } from "../utils/mail.js";

dotenv.config();

// ✅ Fixed rate per delivery
const DELIVERY_EARNING_PER_ORDER = 40;

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!req.userId && !req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.userId || req.user?._id;
    const shopOrdersMap = new Map();

    for (const item of cartItems) {
      const shopId = item.shop?._id || item.shop || item.shopId;

      if (!shopOrdersMap.has(shopId)) {
        const shopDetails = await Shop.findById(shopId);
        if (!shopDetails) {
          return res.status(404).json({ message: `Shop not found for item: ${item.name}` });
        }
        shopOrdersMap.set(shopId, {
          shop: shopId,
          owner: shopDetails.owner,
          shopOrderItems: [],
          subTotal: 0,
        });
      }

      const shopOrder = shopOrdersMap.get(shopId);
      shopOrder.shopOrderItems.push({
        item: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
      shopOrder.subTotal += item.price * item.quantity;
    }

    const shopOrders = Array.from(shopOrdersMap.values());

    const newOrder = new Order({
      user: userId,
      shopOrders,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      payment: false,
    });

    if (paymentMethod === "online") {
      const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const razorOrder = await instance.orders.create(options);
      newOrder.razorpayOrderId = razorOrder.id;
      await newOrder.save();

      // 🔥 SOCKET: Notify owners
      const io = req.app.get('io');
      if (io) {
        for (const shopOrder of newOrder.shopOrders) {
          const owner = await User.findById(shopOrder.owner);
          if (owner?.socketId && owner?.isOnline) {
            io.to(owner.socketId).emit('newOrder', {
              _id: newOrder._id,
              paymentMethod: newOrder.paymentMethod,
              user: await User.findById(userId).select('fullname email mobile'),
              createdAt: newOrder.createdAt,
              deliveryAddress: newOrder.deliveryAddress,
              shopOrder: shopOrder,
              payment: newOrder.payment
            });
            console.log(`📩 New order notification sent to owner: ${owner.fullname}`);
          }
        }
      }

      return res.status(201).json({ success: true, orderId: newOrder._id, razorOrder });
    }

    // COD
    await newOrder.save();

    const io = req.app.get('io');
    if (io) {
      for (const shopOrder of newOrder.shopOrders) {
        const owner = await User.findById(shopOrder.owner);
        if (owner?.socketId && owner?.isOnline) {
          const userData = await User.findById(userId).select('fullname email mobile');
          io.to(owner.socketId).emit('newOrder', {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: userData,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            shopOrder: shopOrder,
            payment: newOrder.payment
          });
          console.log(`📩 New order notification sent to owner: ${owner.fullname}`);
        }
      }
    }

    return res.status(201).json({ success: true, newOrder });

  } catch (error) {
    console.error("❌ Order placement error:", error);
    res.status(500).json({ message: error.message || "Order placement failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findById(orderId);
      if (order) {
        order.payment = true;
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        return res.status(200).json(order);
      }
      return res.status(404).json({ message: "Order not found" });
    } else {
      return res.status(400).json({ message: "Invalid signature, payment failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    console.log("=== GET MY ORDERS STARTED ===");
    const userId = req.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User role: ${user.role}, User name: ${user.fullname}`);

    if (user.role === "user") {
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image address") // ← FIXED: added "image" and "address"
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price rating")
        .populate("shopOrders.assignedDeliveryBoy", "fullname email mobile location");

      console.log(`Found ${orders.length} orders for user`);
      return res.status(200).json({ orders });
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image address") // ← FIXED: added "image" and "address" here too
        .populate("user", "fullname email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price rating")
        .populate("shopOrders.assignedDeliveryBoy", "fullname mobile location");

      const filteredOrders = orders
        .map((order) => {
          const myShopOrders = order.shopOrders.filter(
            (so) => so.owner && so.owner._id && so.owner._id.toString() === userId.toString()
          );
          if (myShopOrders.length === 0) return null;
          return {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: myShopOrders,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            status: order.status,
            payment: order.payment
          };
        })
        .filter(Boolean);

      console.log(`Filtered to ${filteredOrders.length} orders for this owner`);
      return res.status(200).json({ orders: filteredOrders });
    }

    return res.status(400).json({ message: "Invalid user role" });
  } catch (error) {
    console.error("❌ Get user orders error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId)
      .populate('user', 'fullname email mobile socketId isOnline');

    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.find((o) => o.shop.toString() === shopId);
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    const shop = await Shop.findById(shopId);
    if (!shop || !shop.location?.coordinates?.length) {
      return res.status(400).json({ message: "Shop location missing" });
    }

    shopOrder.status = status;
    let availableBoys = [];

    if (status === "out of delivery") {
      // Debug: Log all delivery boys and their online status
      const allDeliveryBoys = await User.find({ role: "deliveryBoy" });
      console.log(`🔍 DEBUG: Total delivery boys in DB: ${allDeliveryBoys.length}`);
      allDeliveryBoys.forEach(b => {
        console.log(`  - ${b.fullname}: isOnline=${b.isOnline}, hasLocation=${!!b.location?.coordinates?.length}, coords=${JSON.stringify(b.location?.coordinates)}`);
      });

      const deliveryBoys = await User.find({
        role: "deliveryBoy",
        isOnline: true,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: shop.location.coordinates },
            $maxDistance: 10000,
          },
        },
      });

      console.log(`🔍 Found ${deliveryBoys.length} nearby delivery boys within 10km`);
      console.log(`📍 Shop location: ${JSON.stringify(shop.location.coordinates)}`);

      availableBoys = deliveryBoys.map((b) => ({
        id: b._id,
        fullname: b.fullname,
        mobile: b.mobile,
        location: b.location?.coordinates,
        socketId: b.socketId,
        assigned: false,
      }));

      if (deliveryBoys.length === 0) {
        console.log(`⚠️ No online delivery boys found within 10km of shop. Order will NOT be broadcasted.`);
      }

      if (!shopOrder.assignment && deliveryBoys.length > 0) {
        const assignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopId,
          shopOrderId: shopOrder._id,
          broadcastedTo: deliveryBoys.map((b) => b._id),
          status: "broadcasted",
        });

        shopOrder.assignment = assignment._id;

        await assignment.populate([
          { path: 'shop', select: 'name' },
          { path: 'order', populate: { path: 'user', select: 'fullname mobile' } }
        ]);

        const io = req.app.get('io');
        if (io) {
          deliveryBoys.forEach((boy) => {
            if (boy.socketId && boy.isOnline) {
              io.to(boy.socketId).emit('newAssignment', {
                sentTo: boy._id.toString(),
                assignmentId: assignment._id,
                shopName: assignment.shop.name,
                deliveryAddress: assignment.order.deliveryAddress.text,
                customerName: assignment.order.user.fullname,
                customerMobile: assignment.order.user.mobile,
                items: shopOrder.shopOrderItems,
                subTotal: shopOrder.subTotal
              });
              console.log(`📲 Assignment sent to delivery boy: ${boy.fullname}`);
            }
          });
        }
      }
    }

    await order.save();

    // 🔥 SOCKET: Notify user, owner, delivery boy
    const io = req.app.get('io');
    if (io) {
      if (order.user?.socketId && order.user?.isOnline) {
        io.to(order.user.socketId).emit('update-status', {
          orderId: order._id, shopId, status, userId: order.user._id
        });
        console.log(`📢 Status update sent to user: ${order.user.fullname}`);
      }

      const owner = await User.findById(shop.owner);
      if (owner?.socketId && owner?.isOnline && owner._id.toString() !== req.userId.toString()) {
        io.to(owner.socketId).emit('update-status', {
          orderId: order._id, shopId, status, userId: order.user._id
        });
        console.log(`📢 Status update sent to owner: ${owner.fullname}`);
      }

      if (shopOrder.assignedDeliveryBoy) {
        const deliveryBoy = await User.findById(shopOrder.assignedDeliveryBoy);
        if (deliveryBoy?.socketId && deliveryBoy?.isOnline) {
          io.to(deliveryBoy.socketId).emit('update-status', {
            orderId: order._id, shopId, status, userId: order.user._id
          });
          console.log(`📢 Status update sent to delivery boy: ${deliveryBoy.fullname}`);
        }
      }
    }

    return res.json({ message: "Status updated successfully", shopOrder, availableBoys });
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: req.userId,
      status: "broadcasted",
    })
      .populate("shop", "name")
      .populate({
        path: "order",
        populate: [
          { path: "user", select: "fullname mobile" },
          { path: "shopOrders.shopOrderItems.item", select: "name price image" },
        ],
      });

    const formatted = assignments.map((a) => {
      const shopOrder = a.order.shopOrders.find(
        (so) => so._id.toString() === a.shopOrderId.toString()
      );
      return {
        assignmentId: a._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress.text,
        customerName: a.order.user.fullname,
        customerMobile: a.order.user.mobile,
        items: shopOrder?.shopOrderItems || [],
        subTotal: shopOrder?.subTotal || 0,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findById(req.params.assignmentId)
      .populate('order', 'user')
      .populate('shop', 'name owner');

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (assignment.status !== "broadcasted") return res.status(400).json({ message: "Already taken" });

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    await DeliveryAssignment.updateMany(
      { shopOrderId: assignment.shopOrderId, _id: { $ne: assignment._id } },
      { status: "expired" }
    );

    const order = await Order.findById(assignment.order._id);
    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString()
    );
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();

    // 🔥 SOCKET: Notify owner and user
    const io = req.app.get('io');
    if (io) {
      const owner = await User.findById(assignment.shop.owner);
      const deliveryBoy = await User.findById(req.userId);

      if (owner?.socketId && owner?.isOnline) {
        io.to(owner.socketId).emit('delivery-boy-assigned', {
          orderId: order._id,
          shopId: assignment.shop._id,
          deliveryBoy: { id: deliveryBoy._id, fullname: deliveryBoy.fullname, mobile: deliveryBoy.mobile }
        });
        console.log(`📲 Owner notified: Delivery boy ${deliveryBoy.fullname} assigned`);
      }

      const user = await User.findById(order.user);
      if (user?.socketId && user?.isOnline) {
        io.to(user.socketId).emit('delivery-boy-assigned', {
          orderId: order._id,
          shopId: assignment.shop._id,
          deliveryBoy: { id: deliveryBoy._id, fullname: deliveryBoy.fullname, mobile: deliveryBoy.mobile }
        });
        console.log(`📲 User notified: Delivery boy ${deliveryBoy.fullname} assigned`);
      }
    }

    res.json({ message: "Order accepted successfully" });
  } catch (error) {
    console.error("❌ Accept order error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    console.log("=== GET CURRENT ORDER STARTED ===");

    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: 'assigned'
    })
      .populate('shop', 'name')
      .populate('assignedTo', 'fullname email mobile location')
      .populate({
        path: 'order',
        populate: [
          { path: 'user', select: 'fullname email mobile location' },
          { path: 'shopOrders.shopOrderItems.item', select: 'name image price' }
        ]
      });

    if (!assignment) return res.status(404).json({ message: "No current assignment" });
    if (!assignment.order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = assignment.order.shopOrders.find(
      so => String(so._id) === String(assignment.shopOrderId)
    );
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    console.log(`✅ Current order found: ${assignment.order._id}`);

    return res.status(200).json({
      id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation
    });
  } catch (error) {
    console.error("❌ Get current order error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await DeliveryAssignment.find({})
      .populate('order', 'deliveryAddress')
      .populate('shop', 'name')
      .populate('broadcastedTo', 'fullname email location')
      .populate('assignedTo', 'fullname email location');

    return res.status(200).json({ count: assignments.length, assignments });
  } catch (error) {
    console.error("❌ Get all assignments error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(orderId)
      .populate("user")
      .populate({ path: 'shopOrders.shop', model: 'Shop' })
      .populate({ path: 'shopOrders.assignedDeliveryBoy', model: 'User', select: 'fullname mobile email location' })
      .populate({ path: 'shopOrders.shopOrderItems.item', model: 'Item' })
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ order });
  } catch (error) {
    console.error("❌ Get order by ID error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const debugAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId)
      .populate('broadcastedTo', 'fullname mobile')
      .populate('assignedTo', 'fullname mobile')
      .lean();
    const allAssignments = await DeliveryAssignment.find({}).lean();
    return res.json({ assignment, allAssignments, count: allAssignments.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cleanupAssignments = async (req, res) => {
  try {
    const result = await DeliveryAssignment.deleteMany({});
    return res.json({ message: "Cleanup complete", deletedCount: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const order = await Order.findById(orderId).populate("user", "email fullname socketId isOnline");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    if (String(shopOrder.assignedDeliveryBoy) !== String(req.userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    await order.save();

    await sendDeliveryOtpMail(order.user.email, otp);

    const io = req.app.get('io');
    if (io && order.user?.socketId && order.user?.isOnline) {
      io.to(order.user.socketId).emit('delivery-otp-sent', {
        orderId: order._id,
        shopOrderId,
        message: 'Delivery boy has arrived! Check your email for OTP.'
      });
      console.log(`📧 OTP sent notification to user: ${order.user.fullname}`);
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Send delivery OTP error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    const order = await Order.findById(orderId)
      .populate('user', 'fullname email socketId isOnline');

    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) return res.status(404).json({ message: "Shop order not found" });

    if (shopOrder.deliveryOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    shopOrder.deliveryOtp = undefined;
    shopOrder.status = "delivered";

    // ✅ NEW: Set deliveredAt and earning on successful delivery
    shopOrder.deliveredAt = new Date();
    shopOrder.deliveryEarning = DELIVERY_EARNING_PER_ORDER;

    await order.save();

    await DeliveryAssignment.findOneAndUpdate(
      { shopOrderId, assignedTo: req.userId },
      { status: "completed" }
    );

    // 🔥 SOCKET: Notify all parties
    const io = req.app.get('io');
    if (io) {
      // Notify customer
      if (order.user?.socketId && order.user?.isOnline) {
        io.to(order.user.socketId).emit('update-status', {
          orderId: order._id,
          shopId: shopOrder.shop,
          status: 'delivered',
          userId: order.user._id
        });
        console.log(`✅ Delivery confirmation sent to user: ${order.user.fullname}`);
      }

      // Notify owner
      const shop = await Shop.findById(shopOrder.shop);
      const owner = await User.findById(shop.owner);
      if (owner?.socketId && owner?.isOnline) {
        io.to(owner.socketId).emit('update-status', {
          orderId: order._id,
          shopId: shopOrder.shop,
          status: 'delivered',
          userId: order.user._id
        });
        console.log(`✅ Delivery confirmation sent to owner: ${owner.fullname}`);
      }

      // ✅ NEW: Notify delivery boy with earning so UI auto-refreshes
      const deliveryBoy = await User.findById(req.userId);
      if (deliveryBoy?.socketId) {
        io.to(deliveryBoy.socketId).emit('earning-updated', {
          earning: DELIVERY_EARNING_PER_ORDER,
          deliveredAt: shopOrder.deliveredAt,
          message: `+₹${DELIVERY_EARNING_PER_ORDER} earned!`
        });
        console.log(`💰 Earning notification sent to delivery boy: ${deliveryBoy.fullname}`);
      }
    }

    return res.json({ message: "Order marked as delivered" });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ✅ FIXED: Was completely broken with syntax errors and missing variables
export const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startOfDay }
    }).lean();

    // Extract only this delivery boy's delivered shopOrders from today
    const todayDeliveries = [];
    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        const isThisBoy = shopOrder.assignedDeliveryBoy?.toString() === deliveryBoyId.toString();
        const isDelivered = shopOrder.status === "delivered";
        const isToday = shopOrder.deliveredAt && new Date(shopOrder.deliveredAt) >= startOfDay;

        if (isThisBoy && isDelivered && isToday) {
          todayDeliveries.push(shopOrder);
        }
      });
    });

    const totalDeliveries = todayDeliveries.length;
    const totalEarnings = totalDeliveries * DELIVERY_EARNING_PER_ORDER;

    // Build hourly stats for bar chart
    const stats = {};
    todayDeliveries.forEach(shopOrder => {
      const hour = new Date(shopOrder.deliveredAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    const hourlyStats = Object.keys(stats)
      .map(hour => ({
        hour: parseInt(hour),
        count: stats[hour],
        earning: stats[hour] * DELIVERY_EARNING_PER_ORDER,
      }))
      .sort((a, b) => a.hour - b.hour);

    return res.json({
      totalEarnings,
      totalDeliveries,
      ratePerDelivery: DELIVERY_EARNING_PER_ORDER,
      hourlyStats,
    });
  } catch (error) {
    console.error("❌ Get today's deliveries error:", error);
    return res.status(500).json({ message: "Failed to get today's deliveries" });
  }
};
export const getAllTimeEarnings = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    // Get ALL delivered orders for this delivery boy
    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered"
    }).lean();

    // Extract all delivered shopOrders
    const allDeliveries = [];
    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        const isThisBoy = shopOrder.assignedDeliveryBoy?.toString() === deliveryBoyId.toString();
        const isDelivered = shopOrder.status === "delivered";

        if (isThisBoy && isDelivered) {
          allDeliveries.push({
            ...shopOrder,
            orderId: order._id,
            deliveredAt: shopOrder.deliveredAt,
            earning: shopOrder.deliveryEarning || 40 // fallback to 40 if not set
          });
        }
      });
    });

    // Calculate totals
    const totalDeliveries = allDeliveries.length;
    const totalEarnings = allDeliveries.reduce((sum, d) => sum + (d.earning || 40), 0);

    // Group by date for history
    const earningsByDate = {};
    allDeliveries.forEach(delivery => {
      if (delivery.deliveredAt) {
        const date = new Date(delivery.deliveredAt).toISOString().split('T')[0];
        if (!earningsByDate[date]) {
          earningsByDate[date] = { count: 0, earnings: 0 };
        }
        earningsByDate[date].count += 1;
        earningsByDate[date].earnings += (delivery.earning || 40);
      }
    });

    // Convert to array and sort by date
    const dailyHistory = Object.keys(earningsByDate)
      .map(date => ({
        date,
        count: earningsByDate[date].count,
        earnings: earningsByDate[date].earnings
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({
      totalEarnings,
      totalDeliveries,
      ratePerDelivery: 40,
      dailyHistory,
      allDeliveries: allDeliveries.slice(0, 50) // return last 50 deliveries
    });

  } catch (error) {
    console.error("❌ Get all-time earnings error:", error);
    return res.status(500).json({ message: "Failed to get earnings" });
  }
};

export const reorder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('shopOrders.shopOrderItems.item');
        
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Extract all items from all shopOrders
        const items = [];
        order.shopOrders.forEach(so => {
            so.shopOrderItems.forEach(oi => {
              if (oi.item) {
                items.push({
                    id: oi.item._id,
                    name: oi.item.name,
                    price: oi.item.price,
                    image: oi.item.image,
                    shop: so.shop,
                    quantity: oi.quantity
                });
              }
            });
        });

        return res.status(200).json({ success: true, items });
    } catch (error) {
        console.error("Reorder Error:", error);
        return res.status(500).json({ success: false, message: "Reorder failed" });
    }
};