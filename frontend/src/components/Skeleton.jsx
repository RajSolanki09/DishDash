import React from "react";

const Skeleton = ({ className = "", variant = "rect", ...props }) => {
  const base = "animate-pulse bg-bg-tertiary rounded-xl";
  const variants = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-lg h-4",
    card: "rounded-2xl h-48",
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export const PageSkeleton = () => (
  <div className="min-h-screen bg-bg-secondary">
    <div className="h-20 bg-bg-card border-b border-border animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-6 w-96" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-bg-card rounded-2xl p-4 border border-border">
            <Skeleton className="h-44 w-full mb-4 rounded-xl" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AuthSkeleton = () => (
  <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      <div className="bg-bg-card rounded-3xl p-8 border border-border shadow-xl">
        <div className="flex justify-center mb-6">
          <Skeleton className="w-14 h-14 rounded-2xl" />
        </div>
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-8" />
        <Skeleton className="h-14 w-full rounded-xl mb-4" />
        <Skeleton className="h-14 w-full rounded-xl mb-4" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-bg-card rounded-2xl p-4 border border-border">
    <Skeleton className="h-44 w-full mb-4 rounded-xl" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

export const OrderSkeleton = () => (
  <div className="bg-bg-card rounded-[2.5rem] p-8 border border-border mb-6">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-16 w-16 rounded-2xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-6" />
    <div className="flex gap-4">
      <Skeleton className="h-12 flex-1 rounded-xl" />
      <Skeleton className="h-12 flex-1 rounded-xl" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-bg-card rounded-[2.5rem] border border-border overflow-hidden">
    <Skeleton className="h-40 w-full" />
    <div className="px-10 pb-10 -mt-16 relative z-10">
      <Skeleton className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-bg-card" />
      <Skeleton className="h-8 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-48 mx-auto mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;
