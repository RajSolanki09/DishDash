import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
    try {
        const { name, city, state, address, lat, lon } = req.body;

        // 1. Validation: Basic fields check
        if (!name || !city || !state || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 2. Validation: Location check (MongoDB 2dsphere index ke liye zaroori hai)
        if (!lat || !lon) {
            return res.status(400).json({ 
                success: false, 
                message: "Shop location coordinates (GPS) are required to register." 
            });
        }

        // 3. Image Upload logic
        let imageUrl;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            imageUrl = uploadResult; // Cloudinary URL
        }

        // 4. Shop Check: Kya is owner ki shop pehle se hai?
        let shop = await Shop.findOne({ owner: req.userId });

        // 5. Data prepare karein
        const shopData = {
            name,
            city,
            state,
            address,
            owner: req.userId,
            location: {
                type: "Point",
                coordinates: [parseFloat(lon), parseFloat(lat)] // [Longitude, Latitude] format
            }
        };

        // Agar nayi image aayi hai toh hi update karein, warna puraani rehne dein
        if (imageUrl) {
            shopData.image = imageUrl;
        }

        if (!shop) {
            // Nayi shop banana (Create)
            if (!imageUrl) {
                return res.status(400).json({ success: false, message: "Shop image is required for new registration" });
            }
            shop = await Shop.create(shopData);
        } else {
            // Puraani shop update karna (Edit)
            shop = await Shop.findByIdAndUpdate(shop._id, shopData, { new: true });
        }

        // 6. Data return karne se pehle populate karein (Items aur Owner ki info ke liye)
        await shop.populate([
            { path: 'owner', select: '-password' },
            { path: 'items', options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(201).json({
            success: true,
            message: shop ? "Shop updated successfully" : "Shop created successfully",
            shop
        });

    } catch (error) {
        console.error("Create/Edit Shop Error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`
        });
    }
};

export const getMyShop = async (req, res) => {
    try {
        // Owner ki shop dhundna
        const shop = await Shop.findOne({ owner: req.userId })
            .populate({ path: 'owner', select: '-password' })
            .populate({
                path: "items",
                options: { sort: { updatedAt: -1 } }
            });

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "You don't have a shop registered yet."
            });
        }

        return res.status(200).json({
            success: true,
            shop
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error fetching shop: ${error.message}`
        });
    }
};

export const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params;

        // City ke basis par shops search karna (Case-insensitive)
        const shops = await Shop.find({
            city: { $regex: new RegExp(city, 'i') }
        }).populate('items');

        return res.status(200).json({
            success: true,
            shops: shops || []
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error fetching shops in city: ${error.message}`
        });
    }
};
export const getShopDetails = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Shop ki details nikalna
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Us shop ki saari items nikalna
    const items = await Item.find({ shop: shopId });

    res.status(200).json({ shop, items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop details", error });
  }
};