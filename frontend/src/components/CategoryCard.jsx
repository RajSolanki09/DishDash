import React from "react";

const CategoryCard = ({ data, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-4 cursor-pointer group w-fit transition-all duration-300"
    >
      <div className="relative overflow-visible">
        <div
          className={`
            relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36
            bg-white/90 backdrop-blur-sm rounded-3xl p-2.5
            border transition-all duration-300 ease-out
            ${
              isActive
                ? "border-[#ff4d2d] shadow-[0_20px_40px_-8px_rgba(255,77,45,0.25)] -translate-y-1.5 scale-[1.02]"
                : "border-gray-200/70 shadow-sm hover:shadow-md"
            }
            group-hover:border-[#ff4d2d]/50 group-hover:-translate-y-1.5 group-hover:shadow-lg
          `}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={data.image}
              alt={data.category}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Active / Hover Dot – Premium Pulse Effect */}
          <div
            className={`
              absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full
              flex items-center justify-center shadow-md transition-all duration-300
              ${
                isActive
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              }
            `}
          >
            <div
              className={`
                w-2.5 h-2.5 bg-[#ff4d2d] rounded-full
                ${isActive ? "animate-pulse" : ""}
              `}
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <span
          className={`
            text-center font-extrabold text-[11px] md:text-xs uppercase tracking-[0.15em]
            transition-colors duration-300
            ${
              isActive
                ? "text-[#ff4d2d]"
                : "text-gray-500 group-hover:text-[#ff4d2d]"
            }
          `}
        >
          {data.category}
        </span>

        <div
          className={`
            mt-2 h-[3px] rounded-full transition-all duration-300
            ${
              isActive
                ? "w-8 bg-gradient-to-r from-[#ff4d2d] to-[#ff8e6d]"
                : "w-0 bg-gray-200 group-hover:w-5 group-hover:bg-gradient-to-r group-hover:from-[#ff4d2d]/70 group-hover:to-[#ff8e6d]/70"
            }
          `}
        />
      </div>
    </div>
  );
};

export default CategoryCard;