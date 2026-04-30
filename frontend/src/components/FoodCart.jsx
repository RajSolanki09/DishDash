import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Minus, Plus, ShoppingCart, Heart, Zap, Store } from "lucide-react";
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
  const isShopClosed = data.shop?.isOpen === false;

  return (
    <div className={`group relative flex flex-col h-full rounded-2xl overflow-hidden 
      bg-bg-card border border-border
      hover:shadow-lg hover:shadow-brand/5 hover:border-brand/20 hover:-translate-y-1
      transition-all duration-400
      ${(isOutOfStock || isShopClosed) ? 'opacity-50' : ''}
    `}>

      {/* ── Add Glow Effect on Hover ── */}
      <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* ════════ IMAGE ════════ */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-bg-tertiary shrink-0">
        <img
          src={data.image}
          alt={data.name}
          loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"; }}
          className="absolute inset-0 w-full h-full object-cover object-center
            transition-transform duration-700 group-hover:scale-110"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* ── Veg / Non-Veg badge ── */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-md border shadow-sm
            ${isVeg ? 'bg-white/90 border-emerald-500/50' : 'bg-white/90 border-red-500/50'}
          `}>
            <div className={`w-3.5 h-3.5 rounded-sm border-[1.5px] flex items-center justify-center
              ${isVeg ? 'border-emerald-600' : 'border-red-600'}
            `}>
              <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest
              ${isVeg ? 'text-emerald-700' : 'text-red-700'}
            `}>
              {isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>
        </div>

        {/* ── Heart button ── */}
        <button
          onClick={handleToggleFavorite}
          className={`heart-btn-${data._id} absolute top-3 right-3 w-9 h-9 rounded-2xl 
            flex items-center justify-center transition-all duration-300 shadow-lg
            ${isFavorited
              ? 'bg-brand text-white scale-110 shadow-brand/40'
              : 'bg-white/90 text-text-muted hover:text-brand hover:scale-110 hover:bg-white'
            }
          `}
        >
          <Heart size={16} className={isFavorited ? "fill-white" : ""} />
        </button>

        {/* ── Rating badge ── */}
        {rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl 
            bg-emerald-600 shadow-lg border border-emerald-500/30">
            <Star size={10} className="text-white fill-white" />
            <span className="text-[12px] font-black text-white">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* ── Out of stock / Closed overlay ── */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-black text-[12px] uppercase tracking-[0.2em] px-6 py-3 bg-black/40 rounded-2xl border border-white/10 shadow-2xl">
              Sold Out
            </span>
          </div>
        ) : isShopClosed ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-black text-[12px] uppercase tracking-[0.2em] px-6 py-3 bg-black/40 rounded-2xl border border-white/10 shadow-2xl">
              Shop Closed
            </span>
          </div>
        ) : null}
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="flex flex-col flex-1 p-5 pt-4">

        {/* Category + Reviews row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-brand uppercase tracking-[0.15em] px-2 py-1 bg-brand/5 rounded-lg border border-brand/10">
            {data.category}
          </span>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-text-muted">{reviewCount} Reviews</span>
            </div>
          )}
        </div>

        {/* Item name */}
        <h3 className="text-[17px] font-black text-text-primary leading-tight line-clamp-1 mb-1.5 
          group-hover:text-brand transition-colors duration-300 tracking-tight">
          {data.name}
        </h3>

        {/* Shop name */}
        <p className="text-[12px] text-text-secondary font-bold truncate mb-auto flex items-center gap-1.5">
          <Store size={12} className="text-text-muted" />
          {data.shop?.name || "Local Kitchen"}
        </p>

        {/* ── Price + Add ── */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Price</span>
             <span className="text-[20px] font-black text-text-primary tracking-tighter">₹{data.price}</span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-0 rounded-2xl overflow-hidden border-2 border-brand bg-brand/5 shadow-inner">
              <button
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center text-brand hover:bg-brand/10 active:bg-brand/20 transition-colors"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="w-8 text-center font-black text-brand text-[15px]">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center text-brand hover:bg-brand/10 active:bg-brand/20 transition-colors"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isShopClosed}
              className={`add-btn-${data._id} flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl
                font-black text-[10px] sm:text-[12px] uppercase tracking-widest transition-all duration-300
                ${(isOutOfStock || isShopClosed)
                  ? 'bg-bg-tertiary text-text-muted cursor-not-allowed border border-border'
                  : 'bg-brand text-white shadow-lg shadow-brand/25 hover:shadow-brand/40 active:scale-95 animate-pulse-subtle'
                }
              `}
            >
              <Plus size={14} strokeWidth={4} />
              {isShopClosed ? 'Closed' : <span className="whitespace-nowrap">Add to Cart</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCart;