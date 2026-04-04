import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapPin,
  Clock,
  ChevronRight,
  CreditCard,
  Banknote,
  Star as StarIcon,
  Package,
  ArrowRight,
  Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import ReviewForm from "./ReviewForm";
import { setCartItems } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import gsap from "gsap";

const UserOrderCard = ({ data }) => {
  const cardRef = useRef(null);
  const itemsRef = useRef([]);
  const navigate = useNavigate();
  
  const [isReordering, setIsReordering] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Staggered entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      
      gsap.fromTo(".order-item-row", 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, cardRef);
    
    return () => ctx.revert();
  }, []);

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      const res = await axios.post(`${serverUrl}/api/order/reorder/${data._id}`, {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(setCartItems(res.data.items));
        navigate("/cart");
      }
    } catch (error) {
      console.error("Reorder failed:", error);
    } finally {
      setIsReordering(false);
    }
  };

  const statusConfig = {
    pending: { color: "#F59E0B", label: "Pending", icon: Clock },
    preparing: { color: "#3B82F6", label: "Preparing", icon: Package },
    "out of delivery": { color: "#A855F7", label: "On The Way", icon: Navigation },
    delivered: { color: "#10B981", label: "Delivered", icon: ArrowRight },
  };

  return (
    <div ref={cardRef} className="glass-panel rounded-[2.5rem] mb-12 overflow-hidden border border-border shadow-[0_30px_100px_rgba(0,0,0,0.5)] group/card">
      {data.shopOrders?.map((shopOrder, idx) => {
        const currentStatus = shopOrder.status || "pending";
        const theme = statusConfig[currentStatus] || statusConfig.pending;
        const Icon = theme.icon;

        return (
          <div key={idx} className="relative">
            {/* Header: Subtle Gradient Glow */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[${theme.color}] to-transparent opacity-50`} />
            
            <div className="p-8 sm:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className="relative group/img">
                    <div className="absolute inset-0 bg-brand/20 blur-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 rounded-full" />
                    <div className="relative h-20 w-20 rounded-3xl overflow-hidden border border-border shadow-2xl bg-bg-tertiary">
                      <img
                        src={shopOrder.shop?.image || "https://via.placeholder.com/100"}
                        alt={shopOrder.shop?.name}
                        className="h-full w-full object-cover transform group-hover/img:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter mb-1 uppercase italic">
                      {shopOrder.shop?.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] md:text-[10px] font-black text-brand uppercase tracking-[0.2em] bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
                        #{data._id.slice(-6)}
                      </span>
                      <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <div 
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-3xl shadow-lg transition-all duration-500"
                    style={{ 
                      borderColor: `${theme.color}30`, 
                      backgroundColor: `${theme.color}10`,
                      boxShadow: `0 10px 30px ${theme.color}15`
                    }}
                  >
                    <Icon size={18} style={{ color: theme.color }} className={currentStatus !== "delivered" ? "animate-pulse" : ""} />
                    <span className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: theme.color }}>
                      {theme.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">Ordered Items</p>
                  {shopOrder.shopOrderItems?.map((item, itemIdx) => {
                     const itemId = item.item?._id || item.item;

                     return (
                      <React.Fragment key={itemIdx}>
                        <div className="order-item-row flex items-center justify-between p-5 rounded-3xl border border-border bg-bg-card hover:bg-bg-card-hover transition-all duration-300">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg-tertiary border border-border">
                              <img src={item.item?.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-text-primary font-black text-[14px] tracking-tight">{item.item?.name || item.name}</p>
                              <p className="text-[11px] font-bold text-text-secondary">Qty: <span className="text-text-primary">{item.quantity}</span> • ₹{item.price}</p>
                            </div>
                          </div>

                          {currentStatus === "delivered" && (
                            <button 
                              onClick={() => setActiveReviewId(activeReviewId === itemId ? null : itemId)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeReviewId === itemId ? 'bg-brand text-white' : 'bg-bg-card border border-border text-text-muted hover:text-text-primary hover:bg-bg-card-hover'}`}
                            >
                              {activeReviewId === itemId ? "Close" : "Review"}
                            </button>
                          )}
                        </div>
                        
                        {activeReviewId === itemId && (
                          <ReviewForm 
                            itemId={itemId} 
                            shopId={shopOrder.shop?._id || shopOrder.shop} 
                            orderId={data._id}
                            onComplete={() => setActiveReviewId(null)}
                          />
                        )}
                      </React.Fragment>
                     )
                  })}
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                   <div className="bg-bg-tertiary rounded-[2rem] p-8 border border-border shadow-inner">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">Shipment Info</p>
                      
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Drop-off</p>
                            <p className="text-text-secondary text-xs font-bold leading-relaxed">{data.deliveryAddress?.text}</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                            {data.paymentMethod === 'cod' ? <Banknote size={18} /> : <CreditCard size={18} />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Payment</p>
                            <p className="text-text-primary text-xs font-black uppercase tracking-wider">
                              {data.paymentMethod === 'cod' ? 'Cash On Delivery' : data.payment ? 'Verified Online' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-border flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Bill</p>
                            <p className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter italic">₹{shopOrder.subTotal}</p>
                         </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={handleReorder}
                              disabled={isReordering}
                              className="w-14 h-14 rounded-2xl bg-bg-card border border-border flex items-center justify-center text-text-primary hover:bg-brand hover:border-brand hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                              title="Re-order everything"
                            >
                              {isReordering ? <div className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full animate-spin" /> : <Package size={20} />}
                            </button>
                            <button 
                                onClick={() => navigate(`/track-order/${data._id}`)}
                                className="bg-brand text-white h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(226,55,68,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                              >
                              Track <ChevronRight size={16} />
                            </button>
                          </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrderCard;