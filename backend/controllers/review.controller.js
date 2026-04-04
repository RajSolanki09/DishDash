import Review from "../models/review.model.js";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

export const addReview = async (req, res) => {
    try {
        const { itemId, shopId, rating, comment, orderId } = req.body;

        if (!itemId || !shopId || !rating || !comment) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if user actually ordered this item and it was delivered
        const order = await Order.findOne({
            _id: orderId,
            user: req.userId,
            "shopOrders.shop": shopId,
            "shopOrders.status": "delivered"
        });

        if (!order) {
            return res.status(403).json({ success: false, message: "You can only review delivered orders." });
        }

        const review = await Review.create({
            user: req.userId,
            item: itemId,
            shop: shopId,
            rating,
            comment
        });

        // Update Item average rating
        const item = await Item.findById(itemId);
        if (item) {
            const reviews = await Review.find({ item: itemId });
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            
            item.rating.average = avgRating;
            item.rating.count = reviews.length;
            await item.save();
        }

        return res.status(201).json({ success: true, message: "Review added successfully", review });
    } catch (error) {
        console.error("Add Review Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getItemReviews = async (req, res) => {
    try {
        const { itemId } = req.params;
        const reviews = await Review.find({ item: itemId }).populate('user', 'fullname image');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getShopReviews = async (req, res) => {
    try {
        const { shopId } = req.params;
        const reviews = await Review.find({ shop: shopId }).populate('user', 'fullname image').populate('item', 'name');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
