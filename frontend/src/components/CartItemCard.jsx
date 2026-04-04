import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItemCard = ({ data, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="group flex items-start sm:items-center gap-5 p-5 glass-card rounded-3xl transition-all duration-300">

      {/* ── Image ── */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-bg-tertiary shadow-inner">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col justify-between py-1 min-w-0">

        {/* Top row */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1.5 opacity-90">
              {data.category || "Delicious"}
            </p>
            <h3 className="text-[16px] font-bold text-text-primary tracking-tight leading-tight truncate mb-1">
              {data.name}
            </h3>
            <p className="text-[12px] font-medium text-text-secondary">
              ₹{data.price} <span className="text-text-muted">/ unit</span>
            </p>
          </div>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-90 transition-all duration-300 cursor-pointer"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Bottom row: qty + total */}
        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">

          {/* Quantity pill */}
          <div className="flex items-center bg-bg-tertiary border border-border rounded-2xl p-1 gap-1 shadow-inner">
            <button
              onClick={onDecrease}
              disabled={data.quantity <= 1}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                data.quantity <= 1
                  ? "bg-transparent text-text-muted cursor-not-allowed"
                  : "bg-bg-card border border-border text-text-secondary hover:bg-brand hover:text-white hover:border-brand hover:shadow-[0_0_10px_rgba(255,77,45,0.4)] active:scale-95 cursor-pointer"
              }`}
            >
              <Minus size={14} />
            </button>

            <span className="w-10 text-center text-sm font-black text-text-primary select-none">
              {data.quantity}
            </span>

            <button
              onClick={onIncrease}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-secondary hover:bg-brand hover:text-white hover:border-brand hover:shadow-[0_0_10px_rgba(255,77,45,0.4)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Total */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</span>
            <span className="text-xl font-black text-brand-glow tracking-tighter">
              ₹{(data.price * data.quantity).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;