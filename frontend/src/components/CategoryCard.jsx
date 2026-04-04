import React from "react";

const CategoryCard = ({ data, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 cursor-pointer group w-fit"
    >
      <div className="relative overflow-visible">
        {/* Glow ring for active */}
        {isActive && (
          <div className="absolute inset-[-6px] rounded-full bg-brand/10 blur-md animate-pulse" />
        )}

        <div
          className={`
            relative w-[76px] h-[76px] sm:w-24 sm:h-24 md:w-[104px] md:h-[104px]
            rounded-full overflow-hidden
            transition-all duration-300 ease-out
            ${
              isActive
                ? "ring-2 ring-brand ring-offset-2 ring-offset-bg-card shadow-lg shadow-brand/25 scale-105 -translate-y-1"
                : "ring-2 ring-border group-hover:ring-brand/30 group-hover:shadow-md group-hover:-translate-y-0.5"
            }
          `}
        >
          <img
            src={data.image}
            alt={data.category}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover overlay */}
          {!isActive && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          )}
        </div>

        {/* Active Check Badge */}
        {isActive && (
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-brand rounded-full flex items-center justify-center shadow-md shadow-brand/30 border-2 border-bg-card">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-white">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      <span
        className={`
          text-center font-bold text-[11px] sm:text-[12px] md:text-[13px]
          tracking-wide leading-tight max-w-[80px] sm:max-w-[96px] truncate
          transition-colors duration-300
          ${isActive ? "text-brand" : "text-text-secondary group-hover:text-text-primary"}
        `}
      >
        {data.category}
      </span>
    </div>
  );
};

export default CategoryCard;