import React from "react";
import {
  IoChevronForward,
  IoBagHandleOutline,
} from "react-icons/io5";
import { TbArrowLeft, TbRosetteDiscount } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeCartItem } from "../redux/userSlice";
import CartItemCard from "../components/CartItemCard";
import Nav from "../components/Nav";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  };

  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  const tax = totalAmount * 0.05;
  const finalTotal = totalAmount + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── HEADER ── */}
        <header className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-7">

            {/* Back button — unified ghost style */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-wide shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <TbArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              />
              Back
            </button>

            {/* Item count badge */}
            {cartItems?.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] rounded-2xl shadow-md shadow-orange-200">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            )}
          </div>

          <p className="text-[10px] font-black text-[#ff4d2d] uppercase tracking-[0.25em] mb-2">
            Your Selection
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none">
            My <span className="text-[#ff4d2d]">Basket.</span>
          </h1>
        </header>

        {/* ── EMPTY STATE ── */}
        {!cartItems || cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/40 py-20 px-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <IoBagHandleOutline size={28} className="text-[#ff4d2d]" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              Nothing here yet
            </p>
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">
              Your basket is empty
            </h2>
            <p className="text-gray-400 text-sm font-medium mb-8 max-w-xs">
              Looks like you haven't added any delicious items yet. Let's fix that!
            </p>
            <button
              className="px-8 py-3.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Start Ordering
            </button>
          </div>

        ) : (
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ── CART ITEMS ── */}
            <div className="lg:col-span-8 space-y-4">

              {/* Items card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-[0.18em]">
                    Item Details
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Price & Qty
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {cartItems.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <div key={itemId} className="p-3">
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

              {/* Promo banner */}
              <div className="bg-white rounded-3xl border border-orange-100 shadow-md shadow-orange-100/30 px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4a] rounded-2xl flex items-center justify-center shadow-md shadow-orange-200 shrink-0">
                  <TbRosetteDiscount size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-wide">
                    {totalAmount > 500 ? "🎉 Free Delivery Unlocked!" : "Unlock Free Delivery"}
                  </p>
                  <p className="text-[10px] font-bold text-[#ff4d2d] uppercase tracking-wider mt-0.5">
                    {totalAmount > 500
                      ? "Your order qualifies for free delivery"
                      : `Add ₹${(500 - totalAmount).toFixed(0)} more to get free delivery`}
                  </p>
                </div>
              </div>
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-orange-100/30 p-6">

                {/* Summary heading */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
                  <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">
                    Order Summary
                  </h2>
                </div>

                {/* Line items */}
                <div className="space-y-3 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Subtotal
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      GST & Charges (5%)
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Platform Fee
                    </span>
                    <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                      FREE
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="py-5">
                  <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100 px-5 py-4 flex justify-between items-center">
                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-3xl font-black text-[#ff4d2d] tracking-tighter leading-none">
                      ₹{finalTotal.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout
                  <IoChevronForward size={15} />
                </button>

                <p className="text-[9px] text-gray-300 font-medium text-center mt-4 tracking-wider">
                  By placing this order you agree to our Terms & Conditions
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