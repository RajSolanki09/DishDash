import React, { useState, useEffect } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { IoCartOutline, IoBagHandleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData, setSearchResults } from "../redux/userSlice";
import { LuFileSpreadsheet } from "react-icons/lu";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiInformationCircle } from "react-icons/hi2";

const Nav = () => {
  const { userData, city, cartItems } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = userData && userData.role;
  const isOwner = userData?.role === "owner";
  const isUser = userData?.role === "user";
  const isDeliveryBoy = userData?.role === "deliveryBoy";
  const cartCount = cartItems?.length || 0;

  // Cart animation effect
  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Listen for cart addition events
  useEffect(() => {
    const handleCartAdd = (event) => {
      const { itemName, itemImage } = event.detail;
      const id = Date.now();
      
      setNotifications((prev) => [
        ...prev,
        { id, itemName, itemImage, visible: true }
      ]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, visible: false } : notif
          )
        );
        
        setTimeout(() => {
          setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, 300);
      }, 4000);
    };

    window.addEventListener('itemAddedToCart', handleCartAdd);
    return () => window.removeEventListener('itemAddedToCart', handleCartAdd);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.trim().length === 0) {
      dispatch(setSearchResults([]));
      return;
    }
    if (val.trim().length >= 1) {
      setIsSearching(true);
      try {
        const searchUrl = `${serverUrl}/api/item/search-items?query=${val}&city=${city}`;
        const result = await axios.get(searchUrl, { withCredentials: true });
        dispatch(setSearchResults(result.data));
      } catch (error) {
        console.error("Search error:", error);
        dispatch(setSearchResults([]));
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const closeSearch = () => {
    setQuery("");
    dispatch(setSearchResults([]));
    setShowSearch(false);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          CART NOTIFICATIONS
      ═══════════════════════════════════════════════════════ */}
      {notifications.length > 0 && (
        <div className="fixed top-24 right-4 z-[10001] space-y-3 pointer-events-none">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`
                w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
                pointer-events-auto transform transition-all duration-300 ease-out
                ${notif.visible ? 'translate-x-0 opacity-100' : 'translate-x-[400px] opacity-0'}
              `}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shrink-0 animate-bounce">
                  <IoCheckmarkCircle size={26} className="text-white" />
                </div>

                {notif.itemImage && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-gray-100">
                    <img
                      src={notif.itemImage}
                      alt={notif.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-gray-900 mb-0.5">
                    Added to Cart!
                  </p>
                  <p className="text-[12px] text-gray-600 font-semibold truncate">
                    {notif.itemName}
                  </p>
                </div>
              </div>

              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === notif.id ? { ...n, visible: false } : n
                      )
                    );
                  }}
                  className="flex-1 py-3 text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Dismiss
                </button>
                <div className="w-px bg-gray-100" />
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 py-3 text-[12px] font-bold text-[#ff4d2d] hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <IoCartOutline size={15} />
                  View Cart
                </button>
              </div>

              <div className="h-1 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] animate-progress" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MAIN NAVIGATION - ALL BUTTONS IDENTICAL STYLE
      ═══════════════════════════════════════════════════════ */}
      <nav className="w-full h-[72px] fixed top-0 left-0 z-[9999] bg-white shadow-sm">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-4 lg:px-6 gap-4">
          
          {/* LEFT SECTION: Logo + Search */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
            {/* Logo */}
            <h1
              onClick={() => { navigate("/"); closeSearch(); }}
              className="text-[28px] md:text-[32px] font-black cursor-pointer select-none shrink-0 tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="text-[#ff4d2d]">Vingo</span>
              <span className="text-gray-900">.</span>
            </h1>

            {/* Desktop Search Bar */}
            {isLoggedIn && isUser && (
              <div className="hidden lg:flex items-center gap-3 bg-gray-50 rounded-xl h-[48px] px-5 flex-1 max-w-[520px] border border-gray-200 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all duration-200">
                {/* City Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 shrink-0">
                  <FaLocationDot size={11} className="text-[#ff4d2d]" />
                  <span className="text-[11px] font-black text-gray-700 max-w-[80px] truncate uppercase tracking-wide">
                    {city || "Surat"}
                  </span>
                </div>
                
                {/* Search Input */}
                <IoMdSearch size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search restaurants or dishes..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-400 font-medium"
                />
                {isSearching && (
                  <div className="w-3.5 h-3.5 border-2 border-[#ff4d2d] border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                {query && (
                  <RxCross2
                    onClick={closeSearch}
                    className="cursor-pointer text-gray-400 hover:text-[#ff4d2d] transition-colors shrink-0"
                    size={15}
                  />
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: ALL BUTTONS IDENTICAL STYLE */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* NOT LOGGED IN */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="hidden sm:flex items-center justify-center h-[48px] px-6 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center h-[48px] px-6 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              </>
            )}

            {/* LOGGED IN - ALL SAME STYLE */}
            {isLoggedIn && (
              <>
                {/* USER ROLE */}
                {isUser && (
                  <>
                    {/* Mobile Search Toggle */}
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className="lg:hidden flex items-center justify-center h-[48px] w-[48px] bg-white text-[#ff4d2d] rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      {showSearch ? <RxCross2 size={17} /> : <IoMdSearch size={19} />}
                    </button>

                    {/* Orders Button */}
                    <button
                      onClick={() => navigate("/my-orders")}
                      className="hidden sm:flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      <IoBagHandleOutline size={17} />
                      <span className="hidden lg:inline">Orders</span>
                    </button>
                  </>
                )}

                {/* OWNER ROLE */}
                {isOwner && (
                  <>
                    {/* Add Item Button */}
                    {myShopData && (
                      <button
                        onClick={() => navigate("/add-item")}
                        className="hidden sm:flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                      >
                        <FaPlus size={13} />
                        <span className="hidden lg:inline">Add Item</span>
                      </button>
                    )}

                    {/* Orders Button */}
                    <button
                      onClick={() => navigate("/owner-orders")}
                      className="hidden sm:flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      <LuFileSpreadsheet size={15} />
                      <span className="hidden lg:inline">Orders</span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="sm:hidden flex items-center justify-center h-[48px] w-[48px] bg-white text-[#ff4d2d] rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      <HiMenuAlt3 size={19} />
                    </button>
                  </>
                )}

                {/* DELIVERY BOY ROLE */}
                {isDeliveryBoy && (
                  <>
                    {/* Deliveries Button */}
                    <button
                      onClick={() => navigate("/delivery-orders")}
                      className="hidden sm:flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      <LuFileSpreadsheet size={15} />
                      <span className="hidden lg:inline">Deliveries</span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="sm:hidden flex items-center justify-center h-[48px] w-[48px] bg-white text-[#ff4d2d] rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                      <HiMenuAlt3 size={19} />
                    </button>
                  </>
                )}

                {/* About Us Button - SAME STYLE AS OTHERS */}
                <button
                  onClick={() => navigate("/about")}
                  className="hidden md:flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  <HiInformationCircle size={17} />
                  <span className="hidden lg:inline">About Us</span>
                </button>

                {/* Cart Button - SAME STYLE AS OTHERS (USER ONLY) */}
                {isUser && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="relative flex items-center justify-center gap-2 h-[48px] px-5 bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <IoCartOutline
                      size={17}
                      className={`transition-all duration-500 ${cartAnimate ? "scale-125 rotate-12" : "scale-100 rotate-0"}`}
                    />
                    <span className="hidden lg:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className={`absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-[#ff4d2d] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${cartAnimate ? "scale-125 animate-bounce" : "scale-100"}`}>
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* User Avatar - SAME STYLE AS OTHERS */}
                <div className="relative">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`flex items-center justify-center h-[48px] w-[48px] bg-white text-[#ff4d2d] rounded-full font-black text-[15px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm ${showInfo ? "ring-2 ring-gray-300 ring-offset-2" : ""}`}
                  >
                    {userData?.fullname?.charAt(0).toUpperCase() || "U"}
                  </button>

                  {/* Dropdown Menu */}
                  {showInfo && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)} />
                      <div className="absolute top-[calc(100%+12px)] right-0 w-[270px] bg-white rounded-3xl shadow-2xl shadow-gray-400/30 z-50 overflow-hidden border border-gray-200">
                        {/* User Info Header */}
                        <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-md">
                              {userData?.fullname?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-gray-900 text-[14px] truncate">
                                {userData?.fullname || "User"}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate mt-0.5 font-semibold">
                                {userData?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-3">
                          <button
                            onClick={() => { setShowInfo(false); navigate("/profile"); }}
                            className="w-full px-4 py-3.5 text-left rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg group-hover:bg-gray-200 group-hover:scale-110 transition-all">
                              <span>👤</span>
                            </div>
                            <span className="font-bold text-gray-700 text-[14px] group-hover:text-gray-900 transition-colors">
                              My Profile
                            </span>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3.5 text-left rounded-2xl hover:bg-red-50 transition-all flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg group-hover:bg-red-200 group-hover:scale-110 transition-all">
                              <span>🚪</span>
                            </div>
                            <span className="font-bold text-red-500 text-[14px]">
                              Sign Out
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {isLoggedIn && isUser && showSearch && (
          <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-b border-gray-200 px-4 py-4 shadow-md z-[9998]">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl h-[48px] px-5 border border-gray-200 focus-within:border-gray-300 focus-within:shadow-md transition-all duration-200">
              <IoMdSearch size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search food or restaurants..."
                className="flex-1 bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-400 font-medium"
                autoFocus
              />
              {isSearching && (
                <div className="w-3.5 h-3.5 border-2 border-[#ff4d2d] border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {query && (
                <RxCross2
                  onClick={closeSearch}
                  className="cursor-pointer text-gray-400 hover:text-[#ff4d2d] transition-colors shrink-0"
                  size={15}
                />
              )}
            </div>
          </div>
        )}

        {/* MOBILE MENU */}
        {isLoggedIn && showMobileMenu && (isOwner || isDeliveryBoy) && (
          <div className="sm:hidden absolute top-[72px] left-0 w-full bg-white border-b border-gray-200 px-4 py-4 shadow-md z-[9998] space-y-2.5">
            {isOwner && myShopData && (
              <button
                onClick={() => { setShowMobileMenu(false); navigate("/add-item"); }}
                className="w-full flex items-center justify-center gap-2.5 h-[52px] bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <FaPlus size={15} />
                Add New Food Item
              </button>
            )}
            <button
              onClick={() => {
                setShowMobileMenu(false);
                if (isOwner) navigate("/owner-orders");
                else if (isDeliveryBoy) navigate("/delivery-orders");
              }}
              className="w-full flex items-center justify-center gap-2.5 h-[52px] bg-white text-[#ff4d2d] rounded-full font-bold text-[13px] border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <LuFileSpreadsheet size={17} />
              {isOwner ? "View All Orders" : "Manage Deliveries"}
            </button>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
      `}</style>
    </>
  );
};

export default Nav;