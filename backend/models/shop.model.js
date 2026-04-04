import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    // ✅ NEW: GeoJSON location field for delivery boy proximity search
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
     coordinates: {
  type: [Number],
  required: true, // 🔥 OWNER MUST SET SHOP LOCATION
}
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// ✅ CRITICAL: Create 2dsphere index for geospatial queries
shopSchema.index({ location: "2dsphere" });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;