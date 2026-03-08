import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLeaf,
  FaStar,
  FaRegStar,
  FaMinus,
  FaPlus,
  FaDrumstickBite,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { addToCart, updateQuantity } from "../redux/userSlice";

function FoodCart({ data }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === data._id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cartItems, data._id]);

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) =>
      i < rounded ? (
        <FaStar key={i} className="text-yellow-400" size={10} />
      ) : (
        <FaRegStar key={i} className="text-yellow-300" size={10} />
      )
    );
  };

  const handleAddToCart = () => {
    // Dispatch to Redux
    dispatch(
      addToCart({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity: 1,
      })
    );

    // Trigger notification
    const event = new CustomEvent('itemAddedToCart', {
      detail: { 
        itemName: data.name,
        itemImage: data.image 
      }
    });
    window.dispatchEvent(event);
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ id: data._id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }));
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/60 hover:border-[#ff4d2d]/30 transition-all duration-300">

      {/* ── IMAGE ── */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Veg / Non-veg badge */}
        <div className="absolute top-3 left-3 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
          {data.foodType === "veg" ? (
            <FaLeaf size={12} className="text-green-500" />
          ) : (
            <FaDrumstickBite size={12} className="text-red-500" />
          )}
        </div>

        {/* Rating pill — top right */}
        {data.rating?.average > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-xl shadow-md border border-gray-200">
            <FaStar size={10} className="text-yellow-400" />
            <span className="text-[11px] font-black text-gray-900">
              {data.rating.average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4">

        {/* Category + shop */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-[#ff4d2d] uppercase tracking-[0.18em] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            {data.category}
          </span>
          <span className="text-[10px] text-gray-500 font-medium truncate max-w-[100px]">
            {data.shop?.name || "Local Kitchen"}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-black text-gray-900 truncate group-hover:text-[#ff4d2d] transition-colors duration-200 mb-1.5">
          {data.name}
        </h3>

        {/* Stars + count */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex gap-0.5">{renderStars(data.rating?.average)}</div>
          <span className="text-[10px] text-gray-500 font-medium">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Price + Cart action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">
            ₹{data.price}
          </span>

          {/* Qty controls */}
          {quantity > 0 ? (
            <div className="flex items-center bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] rounded-2xl overflow-hidden shadow-md shadow-orange-200">
              <button
                onClick={handleDecrement}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-black/10 active:scale-90 transition-all duration-150 cursor-pointer"
              >
                <FaMinus size={9} />
              </button>
              <span className="w-8 text-center font-black text-white text-sm select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-black/10 active:scale-90 transition-all duration-150 cursor-pointer"
              >
                <FaPlus size={9} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <FaCartShopping size={11} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCart;