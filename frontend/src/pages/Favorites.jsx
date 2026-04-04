import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "../components/Nav";
import FoodCart from "../components/FoodCart";
import { Heart, ArrowLeft, Loader2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setFavoriteItems } from "../redux/userSlice";
import gsap from "gsap";

const Favorites = () => {
  const { userData, favoriteItems } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Fetch favorites from API and store in Redux
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/get-favorites`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setFavoriteItems(res.data.favorites));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      // ✅ Always fetch fresh populated data from API
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && favoriteItems.length > 0) {
      gsap.from(".fav-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out"
      });
    }
  }, [loading]);

  // ✅ Remove from favorites - toggle API then refetch
  const handleRemoveFavorite = async (itemId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/toggle-favorite`,
        { itemId },
        { withCredentials: true }
      );
      if (res.data.success) {
        // ✅ Update Redux with remaining populated favorites
        dispatch(setFavoriteItems(res.data.favorites));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary pb-20">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand transition-all duration-300 mb-8 shadow-sm"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand shadow-sm">
              <Heart size={24} className="fill-brand" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-primary">My <span className="text-brand">Favorites.</span></h1>
              <p className="text-text-secondary font-bold text-sm tracking-wide mt-1">Your personally curated collection of must-have dishes.</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={40} className="text-brand animate-spin" />
            <p className="mt-4 text-text-muted font-black uppercase tracking-widest text-[10px]">Syncing your favorites...</p>
          </div>
        ) : favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <div key={item._id} className="fav-card relative group h-full">
                <FoodCart data={item} />
                <button
                  onClick={() => handleRemoveFavorite(item._id)}
                  className="absolute top-3 right-3 z-20 w-9 h-9 bg-bg-card backdrop-blur-sm rounded-full flex items-center justify-center text-brand shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  title="Remove from favorites"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-[2.5rem] p-20 text-center shadow-sm relative overflow-hidden">
            <div className="w-24 h-24 bg-bg-secondary border border-border rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Heart size={40} className="text-text-muted" />
            </div>
            <h3 className="text-3xl font-black text-text-primary tracking-tighter mb-4">No favorites yet</h3>
            <p className="text-text-secondary font-bold max-w-sm mx-auto mb-10 leading-relaxed">Explore the best restaurants in {userData?.city || "your city"} and save your favorite dishes here.</p>
            <button
              onClick={() => navigate('/')}
              className="primary-button px-10 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-3"
            >
              <Search size={18} />
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
