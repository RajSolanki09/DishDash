import React from "react";
import { ChevronRight, ShoppingBag, ArrowLeft, BadgePercent, Trash2, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeCartItem } from "../redux/userSlice";
import CartItemCard from "../components/CartItemCard";
import Nav from "../components/Nav";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleIncrease = (id, currentQty) => dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  const handleDecrease = (id, currentQty) => dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  const handleRemove = (id) => dispatch(removeCartItem(id));

  const tax = totalAmount * 0.05;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const finalTotal = totalAmount + tax + deliveryFee;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

        {/* ── HEADER ── */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[13px] hover:border-brand hover:text-brand active:scale-95 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            {cartItems?.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="text-brand text-[12px] font-black uppercase tracking-widest">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            )}
          </div>

          <p className="text-[12px] font-black text-brand uppercase tracking-widest mb-1">Your Order</p>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            My <span className="text-brand">Basket</span>
          </h1>
        </header>

        {/* ── EMPTY STATE ── */}
        {!cartItems || cartItems.length === 0 ? (
          <div className="bg-bg-card rounded-3xl border border-border shadow-sm py-24 px-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-bg-secondary rounded-3xl flex items-center justify-center mb-6 border border-border">
              <ShoppingBag size={36} className="text-text-muted" />
            </div>
            <h2 className="text-2xl font-black text-text-primary mb-3">Your basket is empty</h2>
            <p className="text-text-secondary text-[15px] font-medium mb-8 max-w-sm">
              Looks like you haven't added anything yet. Start exploring!
            </p>
            <button className="primary-button h-12 px-8 rounded-2xl font-bold text-[15px]" onClick={() => navigate("/")}>
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">

            {/* ── CART ITEMS ── */}
            <div className="lg:col-span-8 space-y-4">
              {/* Items List */}
              <div className="bg-bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg-secondary/50">
                  <h3 className="font-black text-text-primary text-[14px] uppercase tracking-widest">Item Details</h3>
                  <p className="text-[12px] font-bold text-text-muted uppercase tracking-widest">Price & Qty</p>
                </div>
                <div className="divide-y divide-border">
                  {cartItems.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <div key={itemId} className="p-4 sm:p-5 hover:bg-bg-secondary/50 transition-colors">
                        <CartItemCard
                          data={item}
                          onIncrease={() => handleIncrease(itemId, item.quantity)}
                          onDecrease={() => handleDecrease(itemId, item.quantity)}
                          onRemove={() => handleRemove(itemId)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Banner */}
              <div className={`rounded-3xl border px-6 py-5 flex items-center gap-4 ${totalAmount > 500 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-bg-card border-border shadow-sm"}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${totalAmount > 500 ? "bg-emerald-500" : "bg-brand"}`}>
                  <BadgePercent size={20} className="text-white" />
                </div>
                <div>
                  <p className={`text-[14px] font-black mb-0.5 ${totalAmount > 500 ? "text-emerald-400" : "text-text-primary"}`}>
                    {totalAmount > 500 ? <span className="flex items-center gap-2"><Gift size={18} /> Free Delivery Unlocked!</span> : "Unlock Free Delivery"}
                  </p>
                  <p className={`text-[12px] font-medium ${totalAmount > 500 ? "text-emerald-400" : "text-text-secondary"}`}>
                    {totalAmount > 500
                      ? "Your order qualifies for free delivery"
                      : `Add ₹${(500 - totalAmount).toFixed(0)} more to get free delivery`}
                  </p>
                </div>
              </div>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-bg-card rounded-3xl border border-border shadow-lg p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-brand rounded-full" />
                  <h2 className="text-[16px] font-black text-text-primary uppercase tracking-widest">Order Summary</h2>
                </div>

                <div className="space-y-4 pb-5 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-semibold text-text-secondary">Subtotal</span>
                    <span className="text-[15px] font-black text-text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-semibold text-text-secondary">GST & Charges (5%)</span>
                    <span className="text-[15px] font-black text-text-primary">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-semibold text-text-secondary">Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="text-[12px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">FREE</span>
                    ) : (
                      <span className="text-[15px] font-black text-text-primary">₹{deliveryFee}</span>
                    )}
                  </div>
                </div>

                <div className="py-5">
                  <div className="flex justify-between items-center bg-bg-secondary rounded-2xl border border-border px-5 py-4">
                    <span className="text-[14px] font-black text-text-primary uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black text-brand tracking-tight">₹{finalTotal.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full primary-button py-4 rounded-2xl font-bold text-[16px] shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 flex items-center justify-center gap-2"
                >
                  Checkout
                  <ChevronRight size={18} />
                </button>

                <p className="text-[11px] text-text-muted font-medium text-center mt-4 tracking-wide">
                  By checking out, you agree to our Terms
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;