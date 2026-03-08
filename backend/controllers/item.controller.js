import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(201).json({ message: "Item added successfully", shop });
  } catch (error) {
    res.status(500).json({ message: `add item error: ${error.message}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;

    const updateData = {
      name,
      category,
      foodType,
      price,
    };

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path);
      updateData.image = image;
    }

    const item = await Item.findByIdAndUpdate(itemId, updateData, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(200).json({ message: "Item updated successfully", shop });
  } catch (error) {
    res.status(500).json({ message: `edit item error: ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: `get item error: ${error.message}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const userId = req.userId;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Verify the item belongs to this shop
    if (item.shop.toString() !== shop._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this item" });
    }

    // Remove item from shop's items array
    shop.items = shop.items.filter((id) => id.toString() !== itemId);
    await shop.save();

    // Delete the item from database
    await Item.findByIdAndDelete(itemId);

    // Populate and return updated shop
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(200).json({ message: "Item deleted successfully", shop });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: `delete item error: ${error.message}` });
  }
};

export const getItemsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops || shops.length === 0) return res.status(200).json([]);

    const shopIds = shops.map((shop) => shop._id);

    // 🔥 Added .populate("shop") taaki shop ka naam aur rating bhi mil sake
    const items = await Item.find({
      shop: { $in: shopIds },
    })
    .populate("shop", "name rating") 
    .select("name image shop category price foodType rating");

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ FIXED: Correct function name and improved search
export const searchItems  = async (req, res) => {
  try {
    const { query, city } = req.query;
    
    // Agar query ya city nahi hai toh empty array return karo
    if (!query || !city) {
      return res.status(200).json([]);
    }

    // City ke shops dhundho (case-insensitive exact match)
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    });

    if (shops.length === 0) {
      return res.status(200).json([]);
    }

    const shopIds = shops.map(s => s._id);

    // Items dhundho with partial matching on name and category
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { category: { $regex: new RegExp(query, 'i') } }
      ]
    })
    .populate("shop", "name image rating") // Shop details populate karo
    .select("name image shop category price foodType rating");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;

    // 1. Validation
    if (!itemId || !rating) {
      return res.status(400).json({ message: "Item ID and Rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // 2. Find Item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 3. Initialize rating object if it doesn't exist (safety check)
    if (!item.rating) {
      item.rating = { average: 0, count: 0 };
    }

    // 4. Calculate New Average
    // Formula: ((CurrentAvg * CurrentCount) + NewRating) / (CurrentCount + 1)
    const currentCount = item.rating.count || 0;
    const currentAverage = item.rating.average || 0;
    
    const newCount = currentCount + 1;
    const newAverage = ((currentAverage * currentCount) + Number(rating)) / newCount;

    // 5. Update and Save
    item.rating.count = newCount;
    item.rating.average = parseFloat(newAverage.toFixed(1)); // Keep it clean (e.g., 4.5)
    
    await item.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Rating submitted", 
      rating: item.rating 
    });
    
  } catch (error) {
    console.error("Rating error:", error);
    return res.status(500).json({ message: error.message });
  }
}