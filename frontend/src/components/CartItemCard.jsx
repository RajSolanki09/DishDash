import React from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { IoTrashOutline } from "react-icons/io5";

const CartItemCard = ({ data, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="group flex items-start sm:items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-100/40 transition-all duration-300">

      {/* ── Image ── */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col justify-between py-0.5 min-w-0">

        {/* Top row */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-black text-[#ff4d2d] uppercase tracking-[0.22em] mb-1">
              {data.category || "Delicious"}
            </p>
            <h3 className="text-[15px] font-black text-gray-900 tracking-tight leading-tight truncate mb-1">
              {data.name}
            </h3>
            <p className="text-[11px] font-semibold text-gray-400">
              ₹{data.price} <span className="text-gray-300">/ unit</span>
            </p>
          </div>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Remove item"
          >
            <IoTrashOutline size={15} />
          </button>
        </div>

        {/* Bottom row: qty + total */}
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">

          {/* Quantity pill */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1 gap-1">
            <button
              onClick={onDecrease}
              disabled={data.quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                data.quantity <= 1
                  ? "bg-transparent text-gray-300 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-[#ff4d2d] hover:text-white hover:border-transparent hover:shadow-md active:scale-95 cursor-pointer shadow-sm"
              }`}
              aria-label="Decrease quantity"
            >
              <HiOutlineMinus size={13} />
            </button>

            <span className="w-9 text-center text-sm font-black text-gray-900 select-none">
              {data.quantity}
            </span>

            <button
              onClick={onIncrease}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-[#ff4d2d] hover:text-white hover:border-transparent hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
              aria-label="Increase quantity"
            >
              <HiOutlinePlus size={13} />
            </button>
          </div>

          {/* Total */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">
              ₹{(data.price * data.quantity).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;