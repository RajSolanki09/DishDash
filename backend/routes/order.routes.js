import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { 
  acceptOrder, 
  cleanupAssignments, 
  debugAssignment, 
  getAllAssignments, 
  getCurrentOrder, 
  getDeliveryBoyAssignment, 
  getMyOrders, 
  getOrderById, 
  placeOrder, 
  sendDeliveryOtp, 
  updateOrderStatus, 
  verifyDeliveryOtp,
  verifyPayment,
  getTodayDeliveries,
  getAllTimeEarnings,
  reorder
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.post("/verify-payment", isAuth, verifyPayment);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-assignment", isAuth, getDeliveryBoyAssignment);
orderRouter.get("/get-pending-assignments", isAuth, getDeliveryBoyAssignment); // Added route for pending assignments
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.post('/accept-order/:assignmentId', isAuth, acceptOrder); 
orderRouter.get("/debug/all-assignments", isAuth, getAllAssignments);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);
orderRouter.get('/debug-assignment/:assignmentId', debugAssignment);
orderRouter.post('/cleanup-assignments', cleanupAssignments);
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp);
orderRouter.post("/get-today-deliveries", isAuth, getTodayDeliveries);
orderRouter.get("/get-today-deliveries", isAuth, getTodayDeliveries);
orderRouter.get("/get-all-time-earnings", isAuth, getAllTimeEarnings);
orderRouter.post("/reorder/:orderId", isAuth, reorder);
export default orderRouter;