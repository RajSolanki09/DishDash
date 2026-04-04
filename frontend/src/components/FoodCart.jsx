import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Minus, Plus, ShoppingCart, Heart, Zap } from "lucide-react";
import { addToCart, updateQuantity, setFavoriteItems } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
import gsap from "gsap";

function FoodCart({ data }) {
  const dispatch = useDispatch();
  const { cartItems, favoriteItems, userData } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === data._id);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cartItems, data._id]);

  useEffect(() => {
    if (favoriteItems && favoriteItems.length > 0) {
      const found = favoriteItems.some(fav => {
        const favId = typeof fav === 'string' ? fav : fav?._id;
        return favId === data._id;
      });
      setIsFavorited(found);
    } else if (userData?.favorites && userData.favorites.length > 0) {
      const found = userData.favorites.some(fav => {
        const favId = typeof fav === 'string' ? fav : fav?._id;
        return favId === data._id;
      });
      setIsFavorited(found);
    } else {
      setIsFavorited(false);
    }
  }, [favoriteItems, userData?.favorites, data._id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`${serverUrl}/api/user/toggle-favorite`, { itemId: data._id }, { withCredentials: true });
      if (res.data.success) {
        const updatedFavorites = res.data.favorites;
        dispatch(setFavoriteItems(updatedFavorites));
        const isNowFavorited = updatedFavorites.some(fav => {
          const favId = typeof fav === 'string' ? fav : fav?._id;
          return favId === data._id;
        });
        setIsFavorited(isNowFavorited);
        if (isNowFavorited) {
          gsap.fromTo(`.heart-btn-${data._id}`,
            { scale: 0.3, rotation: -20 },
            { scale: 1, rotation: 0, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }
          );
        }
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: data._id,
      name: data.name,
      price: data.price,
      image: data.image,
      shop: data.shop,
      quantity: 1,
    }));
    gsap.fromTo(`.add-btn-${data._id}`,
      { scale: 1 },
      { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );
    window.dispatchEvent(new CustomEvent('itemAddedToCart', {
      detail: { itemName: data.name, itemImage: data.image }
    }));
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch(updateQuantity({ id: data._id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }));
    }
  };

  const rating = data.rating?.average || 0;
  const reviewCount = data.rating?.count || 0;
  const isVeg = data.foodType === "veg";
  const isOutOfStock = data.isAvailable === false;

  return (
    <div className={`group relative flex flex-col h-full rounded-2xl overflow-hidden 
      bg-bg-card border border-border
      hover:shadow-lg hover:shadow-brand/5 hover:border-brand/20 hover:-translate-y-1
      transition-all duration-400
      ${isOutOfStock ? 'opacity-50' : ''}
    `}>

      {/* ════════ IMAGE ════════ */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-bg-tertiary shrink-0">
        <img
          src={data.image}
          alt={data.name}
          loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"; }}
          className="absolute inset-0 w-full h-full object-cover object-center
            transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* ── Veg / Non-Veg badge ── */}
        <div className="absolute top-2.5 left-2.5">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-md border shadow-sm
            ${isVeg ? 'bg-white/90 border-emerald-500' : 'bg-white/90 border-red-500'}
          `}>
            <div className={`w-3 h-3 rounded-sm border-[1.5px] flex items-center justify-center
              ${isVeg ? 'border-emerald-600' : 'border-red-600'}
            `}>
              <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-wider
              ${isVeg ? 'text-emerald-700' : 'text-red-700'}
            `}>
              {isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>
        </div>

        {/* ── Heart button ── */}
        <button
          onClick={handleToggleFavorite}
          className={`heart-btn-${data._id} absolute top-2.5 right-2.5 w-8 h-8 rounded-xl 
            flex items-center justify-center transition-all duration-300 shadow-sm
            ${isFavorited
              ? 'bg-brand text-white'
              : 'bg-white/90 text-text-muted hover:text-brand hover:scale-110'
            }
          `}
        >
          <Heart size={15} className={isFavorited ? "fill-white" : ""} />
        </button>

        {/* ── Rating badge ── */}
        {rating > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg 
            bg-emerald-600 shadow-md">
            <Star size={9} className="text-white fill-white" />
            <span className="text-[11px] font-black text-white">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* ── Out of stock overlay ── */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-black text-[11px] uppercase tracking-widest px-4 py-2 bg-black/60 rounded-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="flex flex-col flex-1 p-3.5 pt-3">

        {/* Category + Reviews row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black text-brand uppercase tracking-[0.12em]">
            {data.category}
          </span>
          {reviewCount > 0 && (
            <div className="flex items-center gap-0.5">
              <Star size={9} className="text-amber-400 fill-amber-400" />
              <span className="text-[9px] font-bold text-text-muted">{reviewCount}</span>
            </div>
          )}
        </div>

        {/* Item name */}
        <h3 className="text-[15px] font-bold text-text-primary leading-tight line-clamp-1 mb-1 
          group-hover:text-brand transition-colors duration-300">
          {data.name}
        </h3>

        {/* Shop name */}
        <p className="text-[11px] text-text-muted font-medium truncate mb-auto">
          {data.shop?.name || "Local Kitchen"}
        </p>

        {/* ── Price + Add ── */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
          <span className="text-[18px] font-black text-text-primary">₹{data.price}</span>

          {quantity > 0 ? (
            <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-brand/20 bg-brand/5">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center text-brand hover:bg-brand/10 active:bg-brand/20 transition-colors"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center font-black text-brand text-[13px]">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center text-brand hover:bg-brand/10 active:bg-brand/20 transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`add-btn-${data._id} flex items-center gap-1.5 px-4 py-2 rounded-xl
                font-black text-[11px] uppercase tracking-wider transition-all duration-300
                ${isOutOfStock
                  ? 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                  : 'bg-brand text-white shadow-sm shadow-brand/20 hover:shadow-md hover:shadow-brand/30 active:scale-95'
                }
              `}
            >
              <Plus size={13} strokeWidth={3} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCart;