import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import { Search, MapPin, Plus, Menu, X, ShoppingBag, FileText, Info, ShoppingCart, User, CheckCircle2, Heart, Bell, Sun, Moon, BarChart3, Bike } from "lucide-react";

import { serverUrl } from "../App";
import { setUserData, setSearchResults, addNotification, markNotificationsRead, clearNotifications } from "../redux/userSlice";

const Nav = () => {
  const { userData, city, cartItems, socket, notifications: persistentNotifications } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unreadCount = persistentNotifications?.filter((n) => !n.read).length || 0;
  const navRef = useRef(null);

  const isLoggedIn = userData && userData.role;
  const isOwner = userData?.role === "owner";
  const isUser = userData?.role === "user";
  const isDeliveryBoy = userData?.role === "deliveryBoy";
  const cartCount = cartItems?.length || 0;

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP entrance
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  // Cart animation
  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Cart add notifications
  useEffect(() => {
    const handleCartAdd = (event) => {
      const { itemName, itemImage } = event.detail;
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, itemName, itemImage, visible: true }]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, visible: false } : n))
        );
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 400);
      }, 4000);
    };
    window.addEventListener("itemAddedToCart", handleCartAdd);
    return () => window.removeEventListener("itemAddedToCart", handleCartAdd);
  }, []);

  // Socket listeners
  useEffect(() => {
    if (socket) {
      socket.on("update-status", (payload) => {
        const { status, orderId } = payload;
        dispatch(
          addNotification({
            title: "Order Update",
            message: `Your order #${orderId.slice(-6)} is now ${status}.`,
            type: "status",
            orderId,
          })
        );
      });
      socket.on("new-order", (payload) => {
        dispatch(
          addNotification({
            title: "New Order!",
            message: `You received a new order from ${payload.userName || "a customer"}.`,
            type: "new-order",
            orderId: payload.orderId,
          })
        );
      });
    }
    return () => {
      if (socket) {
        socket.off("update-status");
        socket.off("new-order");
      }
    };
  }, [socket, dispatch]);

  const handleNotificationClick = (notif) => {
    setShowNotifications(false);
    if (notif.orderId) {
      if (isOwner) navigate("/owner-orders");
      else navigate(`/track-order/${notif.orderId}`);
    }
  };

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.trim().length === 0) {
      dispatch(setSearchResults([]));
      return;
    }
    setIsSearching(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/search-items?query=${val}&city=${city}`,
        { withCredentials: true }
      );
      dispatch(setSearchResults(result.data));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(setSearchResults([]));
    } finally {
      setIsSearching(false);
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

  // Close all popups on outside interaction
  const closeAllPopups = () => {
    setShowNotifications(false);
    setShowInfo(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          CART ADD NOTIFICATION TOASTS
          - Fixed position with very high z-index
          - Solid background so it never merges
      ══════════════════════════════════════════ */}
      <div
        className="fixed top-24 right-3 sm:right-4 z-[99999] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-label="Cart notifications"
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`
              w-[300px] sm:w-[340px] pointer-events-auto
              transform transition-all duration-400 ease-out
              ${notif.visible ? "translate-x-0 opacity-100 scale-100" : "translate-x-[110%] opacity-0 scale-95"}
            `}
            style={{
              /* Completely solid card — no transparency so it never bleeds into background */
              background: "var(--color-bg-card, #ffffff)",
              border: "2px solid var(--color-border, #e5e7eb)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                height: "3px",
                background: "var(--color-brand, #f97316)",
                width: "100%",
              }}
            />

            <div className="flex items-center gap-3 p-4">
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(249,115,22,0.12)",
                  border: "1.5px solid rgba(249,115,22,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={22} color="var(--color-brand, #f97316)" />
              </div>

              {/* Item image if available */}
              {notif.itemImage && (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1.5px solid var(--color-border, #e5e7eb)",
                  }}
                >
                  <img
                    src={notif.itemImage}
                    alt={notif.itemName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--color-text-primary, #111)",
                    marginBottom: 2,
                    lineHeight: 1.3,
                  }}
                >
                  Added to Cart! 🛒
                </p>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-text-secondary, #666)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {notif.itemName}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                borderTop: "1px solid var(--color-border, #e5e7eb)",
              }}
            >
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, visible: false } : n))
                  )
                }
                style={{
                  flex: 1,
                  padding: "11px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-text-muted, #999)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "var(--color-bg-secondary, #f5f5f5)")
                }
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                Dismiss
              </button>

              <div style={{ width: 1, background: "var(--color-border, #e5e7eb)" }} />

              <button
                onClick={() => navigate("/cart")}
                style={{
                  flex: 1,
                  padding: "11px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-brand, #f97316)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(249,115,22,0.06)")
                }
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                <ShoppingCart size={13} />
                View Cart
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: "var(--color-bg-secondary, #f5f5f5)" }}>
              <div
                style={{
                  height: "100%",
                  background: "var(--color-brand, #f97316)",
                  animation: "navProgressBar 4s linear forwards",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          MAIN NAVBAR
      ══════════════════════════════════════════ */}
      <nav
        ref={navRef}
        className={`w-full h-[72px] sm:h-[80px] fixed top-0 left-0 z-[9999] transition-all duration-300`}
        style={{
          /* Fully opaque solid background — no merging with content behind */
          background: isScrolled
            ? "var(--color-bg-card, #fff)"
            : "var(--color-bg-card, #fff)",
          borderBottom: "1px solid var(--color-border, #e5e7eb)",
          boxShadow: isScrolled
            ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4">

          {/* ── LEFT: Logo + Desktop Search ── */}
          <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">

            {/* Logo */}
            <h1
              onClick={() => { navigate("/"); closeSearch(); }}
              className="text-[26px] sm:text-[30px] md:text-[34px] font-black cursor-pointer select-none shrink-0"
              role="button"
              tabIndex={0}
              aria-label="DishDash - Go to home page"
              onKeyDown={(e) => e.key === "Enter" && navigate("/")}
            >
              <span style={{ color: "var(--color-text-primary, #111)" }}>DishDash</span>
              <span style={{ color: "var(--color-brand, #f97316)" }}>.</span>
            </h1>

            {/* Desktop Search — only for logged-in users */}
            {isLoggedIn && isUser && (
              <div
                className="hidden lg:flex items-center gap-2 xl:gap-3 h-[48px] xl:h-[52px] px-4 xl:px-5 flex-1 max-w-[480px] rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--color-bg-secondary, #f5f5f5)",
                  border: "1.5px solid var(--color-border, #e5e7eb)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* City badge */}
                <div
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0"
                  style={{
                    background: "var(--color-bg-card, #fff)",
                    border: "1px solid var(--color-border, #e5e7eb)",
                  }}
                >
                  <MapPin size={11} style={{ color: "var(--color-brand, #f97316)" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider max-w-[70px] truncate"
                    style={{ color: "var(--color-text-secondary, #666)" }}
                  >
                    {city || "Surat"}
                  </span>
                </div>

                <Search size={17} style={{ color: "var(--color-text-muted, #aaa)", flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search restaurants, dishes..."
                  className="flex-1 bg-transparent outline-none text-[13px] xl:text-[14px] font-medium min-w-0"
                  style={{ color: "var(--color-text-primary, #111)" }}
                  aria-label="Search for restaurants, cuisine or dishes"
                />
                {isSearching && (
                  <div
                    className="w-4 h-4 rounded-full shrink-0 animate-spin"
                    style={{ border: "2px solid var(--color-brand, #f97316)", borderTopColor: "transparent" }}
                  />
                )}
                {query && (
                  <button onClick={closeSearch} aria-label="Clear search" style={{ flexShrink: 0 }}>
                    <X size={15} style={{ color: "var(--color-text-muted, #aaa)" }} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Action Buttons ── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* NOT LOGGED IN */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="hidden sm:flex items-center justify-center h-[40px] px-5 font-semibold text-[13px] sm:text-[14px] rounded-xl transition-all"
                  style={{ color: "var(--color-text-primary, #111)" }}
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="primary-button h-[42px] sm:h-[46px] px-5 sm:px-8 text-[13px] sm:text-[14px] rounded-xl font-bold"
                >
                  <span className="hidden sm:inline">Sign up</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </>
            )}

            {/* LOGGED IN */}
            {isLoggedIn && (
              <>
                {/* ── USER ROLE ── */}
                {isUser && (
                  <>
                    {/* Mobile search toggle */}
                    <button
                      onClick={() => { setShowSearch(!showSearch); setShowMobileMenu(false); }}
                      className="lg:hidden flex items-center justify-center h-[40px] w-[40px] rounded-xl transition-all"
                      style={{
                        background: showSearch ? "rgba(249,115,22,0.1)" : "transparent",
                        color: showSearch ? "var(--color-brand,#f97316)" : "var(--color-text-secondary,#666)",
                      }}
                      aria-label={showSearch ? "Close search" : "Open search"}
                    >
                      {showSearch ? <X size={19} /> : <Search size={19} />}
                    </button>

                    {/* Orders */}
                    <button
                      onClick={() => navigate("/my-orders")}
                      className="hidden sm:flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                      style={{ color: "var(--color-text-secondary,#666)" }}
                      aria-label="View my orders"
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                    >
                      <ShoppingBag size={17} />
                      <span className="hidden xl:inline">Orders</span>
                    </button>

                    {/* Notification Bell */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowNotifications(!showNotifications);
                          setShowInfo(false);
                          if (unreadCount > 0) dispatch(markNotificationsRead());
                        }}
                        className="flex items-center justify-center h-[40px] w-[40px] rounded-xl transition-all relative"
                        style={{
                          background: showNotifications ? "rgba(249,115,22,0.1)" : "transparent",
                          color: showNotifications ? "var(--color-brand,#f97316)" : "var(--color-text-secondary,#666)",
                        }}
                        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                        aria-expanded={showNotifications}
                      >
                        <Bell size={19} className={unreadCount > 0 ? "animate-bounce" : ""} />
                        {unreadCount > 0 && (
                          <span
                            className="absolute top-1 right-1 w-[18px] h-[18px] text-white text-[9px] font-black rounded-full flex items-center justify-center"
                            style={{ background: "var(--color-brand,#f97316)", border: "2px solid var(--color-bg-card,#fff)" }}
                          >
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Notification Dropdown — FULLY SOLID, high z-index */}
                      {showNotifications && (
                        <>
                          <div
                            className="fixed inset-0 z-[10000]"
                            onClick={() => setShowNotifications(false)}
                          />
                          <div
                            className="absolute top-[calc(100%+14px)] right-0 w-[300px] sm:w-[320px] z-[10001] overflow-hidden"
                            style={{
                              background: "var(--color-bg-card, #ffffff)",
                              border: "2px solid var(--color-border, #e5e7eb)",
                              borderRadius: "20px",
                              boxShadow:
                                "0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.03)",
                              animation: "navDropdownIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
                            }}
                          >
                            {/* Header */}
                            <div
                              className="px-5 py-4 flex justify-between items-center"
                              style={{
                                background: "var(--color-bg-secondary, #f8f8f8)",
                                borderBottom: "1px solid var(--color-border, #e5e7eb)",
                              }}
                            >
                              <p
                                className="text-[11px] font-black uppercase tracking-widest"
                                style={{ color: "var(--color-text-primary, #111)" }}
                              >
                                Live Updates
                              </p>
                              {persistentNotifications?.length > 0 && (
                                <button
                                  onClick={() => dispatch(clearNotifications())}
                                  className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                                  style={{ color: "var(--color-text-muted, #999)" }}
                                  onMouseEnter={(e) => (e.target.style.color = "var(--color-brand,#f97316)")}
                                  onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted,#999)")}
                                >
                                  Clear All
                                </button>
                              )}
                            </div>

                            {/* Notification list */}
                            <div
                              className="max-h-[380px] overflow-y-auto p-2 space-y-1"
                              style={{ scrollbarWidth: "none" }}
                            >
                              {persistentNotifications?.length > 0 ? (
                                persistentNotifications.map((n) => (
                                  <button
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className="w-full p-3.5 rounded-2xl text-left flex gap-3 group transition-all"
                                    style={{
                                      background: n.read ? "transparent" : "var(--color-bg-secondary,#f5f5f5)",
                                      opacity: n.read ? 0.65 : 1,
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background = n.read
                                        ? "transparent"
                                        : "var(--color-bg-secondary,#f5f5f5)")
                                    }
                                  >
                                    <div
                                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                      style={{
                                        background: "rgba(249,115,22,0.1)",
                                        border: "1.5px solid rgba(249,115,22,0.2)",
                                        color: "var(--color-brand,#f97316)",
                                      }}
                                    >
                                      {n.type === "status" ? (
                                        <CheckCircle2 size={16} />
                                      ) : (
                                        <FileText size={16} />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p
                                        className="text-[12px] font-black truncate"
                                        style={{ color: "var(--color-text-primary,#111)" }}
                                      >
                                        {n.title}
                                      </p>
                                      <p
                                        className="text-[11px] font-medium leading-relaxed mt-0.5 line-clamp-2"
                                        style={{ color: "var(--color-text-secondary,#666)" }}
                                      >
                                        {n.message}
                                      </p>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="py-14 text-center">
                                  <Bell
                                    size={28}
                                    className="mx-auto mb-3"
                                    style={{ color: "var(--color-text-muted,#ccc)" }}
                                  />
                                  <p
                                    className="text-[11px] font-bold uppercase tracking-widest"
                                    style={{ color: "var(--color-text-muted,#bbb)" }}
                                  >
                                    No notifications yet
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* ── OWNER ROLE ── */}
                {isOwner && (
                  <>
                    {myShopData && (
                      <button
                        onClick={() => navigate("/add-item")}
                        className="hidden sm:flex items-center justify-center gap-1.5 h-[40px] px-4 rounded-xl primary-button font-semibold text-[13px]"
                      >
                        <Plus size={15} />
                        <span className="hidden lg:inline">Add Item</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/owner-orders")}
                      className="hidden sm:flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                      style={{ color: "var(--color-text-secondary,#666)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                    >
                      <FileText size={17} />
                      <span className="hidden lg:inline">Orders</span>
                    </button>
                    {/* Mobile menu toggle */}
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="sm:hidden flex items-center justify-center h-[40px] w-[40px] rounded-xl transition-all"
                      style={{ background: "var(--color-bg-secondary,#f5f5f5)", color: "var(--color-text-secondary,#666)" }}
                    >
                      <Menu size={19} />
                    </button>
                  </>
                )}

                {/* ── DELIVERY BOY ROLE ── */}
                {isDeliveryBoy && (
                  <>
                    <button
                      onClick={() => navigate("/delivery-dashboard")}
                      className="hidden sm:flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                      style={{ color: "var(--color-text-secondary,#666)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                    >
                      <BarChart3 size={17} />
                      <span className="hidden lg:inline">Dashboard</span>
                    </button>
                    <button
                      onClick={() => navigate("/delivery-orders")}
                      className="hidden sm:flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                      style={{ color: "var(--color-text-secondary,#666)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                    >
                      <Bike size={17} />
                      <span className="hidden lg:inline">Deliveries</span>
                    </button>
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="sm:hidden flex items-center justify-center h-[40px] w-[40px] rounded-xl transition-all"
                      style={{ background: "var(--color-bg-secondary,#f5f5f5)", color: "var(--color-text-secondary,#666)" }}
                    >
                      <Menu size={19} />
                    </button>
                  </>
                )}

                {/* About */}
                <button
                  onClick={() => navigate("/about")}
                  className="hidden md:flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                  style={{ color: "var(--color-text-secondary,#666)" }}
                  aria-label="About DishDash"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                >
                  <Info size={17} />
                  <span className="hidden lg:inline">About</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex items-center justify-center h-[40px] w-[40px] rounded-xl transition-all"
                  style={{ color: "var(--color-text-secondary,#666)" }}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </button>

                {/* Cart (USER ONLY) */}
                {isUser && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="relative flex items-center justify-center gap-1.5 h-[40px] px-3 xl:px-4 rounded-xl font-semibold text-[13px] transition-all"
                    style={{
                      background: "var(--color-bg-secondary,#f5f5f5)",
                      border: "1.5px solid var(--color-border,#e5e7eb)",
                      color: "var(--color-text-primary,#111)",
                    }}
                    aria-label={`Shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-brand,#f97316)"; e.currentTarget.style.color = "var(--color-brand,#f97316)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border,#e5e7eb)"; e.currentTarget.style.color = "var(--color-text-primary,#111)"; }}
                  >
                    <ShoppingCart
                      size={17}
                      style={{
                        transition: "transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)",
                        transform: cartAnimate ? "scale(1.2)" : "scale(1)",
                        color: cartAnimate ? "var(--color-brand,#f97316)" : "inherit",
                      }}
                    />
                    <span className="hidden xl:inline">Cart</span>
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 text-white text-[9px] font-black rounded-full flex items-center justify-center transition-transform"
                        style={{
                          background: "var(--color-brand,#f97316)",
                          border: "2px solid var(--color-bg-card,#fff)",
                          transform: cartAnimate ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* User Avatar + Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowInfo(!showInfo);
                      setShowNotifications(false);
                    }}
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full transition-all overflow-hidden font-black text-[14px] uppercase"
                    style={{
                      background: showInfo
                        ? "var(--color-brand,#f97316)"
                        : "var(--color-bg-secondary,#f5f5f5)",
                      color: showInfo ? "#fff" : "var(--color-text-primary,#111)",
                      border: showInfo
                        ? "2px solid var(--color-brand,#f97316)"
                        : "2px solid var(--color-border,#e5e7eb)",
                    }}
                    aria-label="User menu"
                    aria-expanded={showInfo}
                  >
                    {userData?.fullname?.charAt(0) || "U"}
                  </button>

                  {/* User Dropdown — FULLY SOLID */}
                  {showInfo && (
                    <>
                      <div
                        className="fixed inset-0 z-[10000]"
                        onClick={() => setShowInfo(false)}
                      />
                      <div
                        className="absolute top-[calc(100%+14px)] right-0 w-[260px] sm:w-[280px] z-[10001] overflow-hidden"
                        style={{
                          background: "var(--color-bg-card, #ffffff)",
                          border: "2px solid var(--color-border, #e5e7eb)",
                          borderRadius: "20px",
                          boxShadow:
                            "0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.03)",
                          animation: "navDropdownIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
                        }}
                      >
                        {/* User header */}
                        <div
                          className="px-5 py-5"
                          style={{
                            background: "var(--color-bg-secondary,#f8f8f8)",
                            borderBottom: "1px solid var(--color-border,#e5e7eb)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[17px] font-black shrink-0"
                              style={{ background: "var(--color-brand,#f97316)" }}
                            >
                              {userData?.fullname?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className="font-bold text-[14px] truncate"
                                style={{ color: "var(--color-text-primary,#111)" }}
                              >
                                {userData?.fullname || "User"}
                              </p>
                              <p
                                className="text-[11px] truncate mt-0.5 font-medium"
                                style={{ color: "var(--color-text-secondary,#666)" }}
                              >
                                {userData?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-2.5 space-y-0.5">
                          {[
                            { icon: <User size={16} />, label: "My Profile", path: "/profile" },
                            { icon: <Heart size={16} />, label: "My Favorites", path: "/favorites" },
                          ].map((item) => (
                            <button
                              key={item.path}
                              onClick={() => { setShowInfo(false); navigate(item.path); }}
                              className="w-full px-3.5 py-3 text-left rounded-xl flex items-center gap-3 group transition-all"
                              style={{ color: "var(--color-text-secondary,#666)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary,#f5f5f5)"; e.currentTarget.style.color = "var(--color-text-primary,#111)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary,#666)"; }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                style={{ background: "var(--color-bg-secondary,#f5f5f5)" }}
                              >
                                {item.icon}
                              </div>
                              <span className="font-semibold text-[13px]">{item.label}</span>
                            </button>
                          ))}

                          <div
                            style={{
                              height: 1,
                              background: "var(--color-border,#e5e7eb)",
                              margin: "4px 0",
                            }}
                          />

                          <button
                            onClick={handleLogout}
                            className="w-full px-3.5 py-3 text-left rounded-xl flex items-center gap-3 transition-all"
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(249,115,22,0.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: "rgba(249,115,22,0.1)" }}
                            >
                              <span style={{ fontSize: 15 }}>🚪</span>
                            </div>
                            <span
                              className="font-bold text-[13px]"
                              style={{ color: "var(--color-brand,#f97316)" }}
                            >
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

        {/* ── MOBILE SEARCH BAR ──
            Rendered below nav with solid background + proper shadow
            Only visible when showSearch = true on mobile/tablet */}
        {isLoggedIn && isUser && showSearch && (
          <div
            className="lg:hidden absolute left-0 w-full px-3 sm:px-5 py-3.5"
            style={{
              top: "100%",                          /* sits right below the nav */
              background: "var(--color-bg-card, #ffffff)",   /* SOLID — never merges */
              borderBottom: "2px solid var(--color-border, #e5e7eb)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
              zIndex: 9998,
              animation: "navSlideDown 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <div
              className="flex items-center gap-3 h-[50px] px-4 rounded-2xl transition-all"
              style={{
                background: "var(--color-bg-secondary, #f5f5f5)",
                border: "1.5px solid var(--color-border, #e5e7eb)",
              }}
            >
              {/* City badge on mobile search */}
              <div
                className="hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0"
                style={{
                  background: "var(--color-bg-card,#fff)",
                  border: "1px solid var(--color-border,#e5e7eb)",
                }}
              >
                <MapPin size={10} style={{ color: "var(--color-brand,#f97316)" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wide max-w-[60px] truncate"
                  style={{ color: "var(--color-text-secondary,#666)" }}
                >
                  {city || "Surat"}
                </span>
              </div>

              <Search size={17} style={{ color: "var(--color-text-muted,#aaa)", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search food or restaurants..."
                className="flex-1 bg-transparent outline-none text-[14px] font-medium min-w-0"
                style={{ color: "var(--color-text-primary,#111)" }}
                autoFocus
              />
              {isSearching && (
                <div
                  className="w-4 h-4 rounded-full shrink-0 animate-spin"
                  style={{ border: "2px solid var(--color-brand,#f97316)", borderTopColor: "transparent" }}
                />
              )}
              {query && (
                <button onClick={closeSearch} aria-label="Clear search" style={{ flexShrink: 0 }}>
                  <X size={15} style={{ color: "var(--color-text-muted,#aaa)" }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── MOBILE MENU for Owner / DeliveryBoy ── */}
        {isLoggedIn && showMobileMenu && (isOwner || isDeliveryBoy) && (
          <div
            className="sm:hidden absolute left-0 w-full px-3 py-4 space-y-2.5"
            style={{
              top: "100%",
              background: "var(--color-bg-card, #ffffff)",   /* SOLID */
              borderBottom: "2px solid var(--color-border, #e5e7eb)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              zIndex: 9998,
              animation: "navSlideDown 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            {isOwner && (
              <>
                <button
                  onClick={() => { setShowMobileMenu(false); navigate("/profile"); }}
                  className="w-full flex items-center justify-center gap-2.5 h-[52px] rounded-2xl font-bold text-[14px] transition-all"
                  style={{
                    background: "var(--color-bg-secondary,#f5f5f5)",
                    border: "1.5px solid var(--color-border,#e5e7eb)",
                    color: "var(--color-text-primary,#111)",
                  }}
                >
                  <User size={17} />
                  My Profile
                </button>
                {myShopData && (
                  <button
                    onClick={() => { setShowMobileMenu(false); navigate("/add-item"); }}
                    className="w-full flex items-center justify-center gap-2.5 h-[52px] primary-button rounded-2xl font-bold text-[14px]"
                  >
                    <Plus size={17} />
                    Add New Item
                  </button>
                )}
              </>
            )}
            {isDeliveryBoy && (
              <button
                onClick={() => { setShowMobileMenu(false); navigate("/delivery-dashboard"); }}
                className="w-full flex items-center justify-center gap-2.5 h-[52px] rounded-2xl font-bold text-[14px] transition-all"
                style={{
                  background: "var(--color-bg-secondary,#f5f5f5)",
                  border: "1.5px solid var(--color-border,#e5e7eb)",
                  color: "var(--color-text-primary,#111)",
                }}
              >
                <BarChart3 size={17} />
                Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setShowMobileMenu(false);
                if (isOwner) navigate("/owner-orders");
                else if (isDeliveryBoy) navigate("/delivery-orders");
              }}
              className="w-full flex items-center justify-center gap-2.5 h-[52px] rounded-2xl font-bold text-[14px] transition-all"
              style={{
                background: "var(--color-bg-secondary,#f5f5f5)",
                border: "1.5px solid var(--color-border,#e5e7eb)",
                color: "var(--color-text-primary,#111)",
              }}
            >
              <FileText size={17} />
              {isOwner ? "View Orders" : "Manage Deliveries"}
            </button>
          </div>
        )}
      </nav>

      {/* Spacer matching nav height */}
      <div className="h-[72px] sm:h-[80px]" />

      <style>{`
        @keyframes navProgressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes navDropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>
    </>
  );
};

export default Nav;