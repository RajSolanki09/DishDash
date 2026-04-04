import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Circle, 
  User, 
  Utensils, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Navigation,
  CreditCard,
  Package
} from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import DeliveryBoyTraking from "./DeliveryBoyTraking";
import gsap from "gsap";

const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [availableBoys, setAvailableBoys] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const shopOrder = data?.shopOrder;
  const currentStatus = shopOrder?.status || "pending";

  useEffect(() => {
    const loadDeliveryBoys = async () => {
      if (!shopOrder) return;
      if (shopOrder.assignedDeliveryBoy) {
        try {
          const res = await axios.get(
            `${serverUrl}/api/user/${shopOrder.assignedDeliveryBoy._id || shopOrder.assignedDeliveryBoy}`,
            { withCredentials: true }
          );
          setAvailableBoys([{
            id: res.data._id,
            fullname: res.data.fullname,
            mobile: res.data.mobile,
            assigned: true
          }]);
        } catch (error) {
          console.error("Failed to load assigned delivery boy:", error);
        }
      } else if (currentStatus === 'out of delivery' && shopOrder.assignment) {
        try {
          const res = await axios.post(
            `${serverUrl}/api/order/update-status/${data._id}/${shopOrder.shop._id}`,
            { status: currentStatus },
            { withCredentials: true }
          );
          if (res.data.availableBoys && res.data.availableBoys.length > 0) {
            setAvailableBoys(res.data.availableBoys);
          }
        } catch (error) {
          console.error("Failed to load delivery boys:", error);
        }
      }
    };
    loadDeliveryBoys();
  }, [shopOrder?.assignedDeliveryBoy, shopOrder?.assignment, currentStatus, data?._id, shopOrder?.shop?._id]);

  useEffect(() => {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
      );
  }, []);

  if (!data || !shopOrder) return null;

  const handleStatusChange = async (newStatus) => {
    if (!shopOrder.shop?._id) return;
    try {
      setUpdating(true);
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${data._id}/${shopOrder.shop._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      dispatch(updateOrderStatus({
        orderId: data._id,
        shopId: shopOrder.shop._id,
        status: newStatus,
      }));

      if (result.data && result.data.availableBoys) {
        setAvailableBoys(result.data.availableBoys);
      }
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    preparing: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "out of delivery": "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
    delivered: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div ref={cardRef} className="premium-card overflow-hidden mb-8 group">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-border bg-bg-secondary/50 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center text-text-muted group-hover:border-brand/40 transition-colors">
            <User size={22} />
          </div>
          <div>
            <h3 className="font-black text-text-primary text-lg tracking-tight uppercase">
              {data.user?.fullname || "Customer"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-caption text-brand bg-brand/10 px-2.5 py-1 rounded-md border border-brand/20">
                #{data._id.slice(-6).toUpperCase()}
              </span>
              <span className="text-caption text-text-muted flex items-center gap-1.5 ml-2">
                <Clock size={10} /> 
                {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className={`px-5 py-2 rounded-full border font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${statusColors[currentStatus]}`}>
          <div className={`w-1.5 h-1.5 rounded-full bg-current ${currentStatus !== 'delivered' ? 'animate-pulse' : ''}`} />
          {currentStatus}
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Customer & Address */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-bg-secondary border border-border p-4 rounded-2xl flex items-center gap-4 group/item hover:border-brand/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border flex items-center justify-center text-text-muted group-hover/item:text-brand transition-colors">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-caption text-text-muted mb-0.5">Email</p>
                    <p className="text-[11px] font-bold text-text-secondary truncate">{data.user?.email}</p>
                  </div>
               </div>
               <div className="bg-bg-secondary border border-border p-4 rounded-2xl flex items-center gap-4 group/item hover:border-brand/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border flex items-center justify-center text-text-muted group-hover/item:text-brand transition-colors">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-caption text-text-muted mb-0.5">Mobile</p>
                    <p className="text-[11px] font-bold text-text-secondary truncate">{data.user?.mobile}</p>
                  </div>
               </div>
            </div>

            {/* Address Card */}
            <div className="bg-bg-secondary border border-border rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full pointer-events-none" />
               <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-caption text-text-muted mb-1.5">Delivery Destination</p>
                    <p className="text-sm font-bold text-text-secondary leading-relaxed italic">"{data.deliveryAddress?.text}"</p>
                  </div>
               </div>
               
               <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 text-caption text-brand hover:text-brand-hover transition-all ml-14"
              >
                {showMap ? 'Hide GPS Map' : 'View On Map'}
                <Navigation size={12} className={showMap ? "rotate-180 transition-transform" : ""} />
              </button>

              {showMap && data.deliveryAddress?.latitude && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-border h-48 sm:h-64">
                    <DeliveryBoyTraking
                      data={{
                        customerLocation: {
                          lat: data.deliveryAddress.latitude,
                          lon: data.deliveryAddress.longitude
                        }
                      }}
                    />
                </div>
              )}
            </div>

            {/* Order Items List */}
            <div className="space-y-4">
               <p className="text-caption text-text-muted ml-1 flex items-center gap-2">
                 <Utensils size={12} /> Menu Selection
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shopOrder.shopOrderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-bg-secondary border border-border rounded-2xl group/food hover:bg-bg-tertiary transition-all">
                       <div className="h-14 w-14 rounded-xl overflow-hidden border border-border shrink-0">
                          <img src={item.item?.image || item.image} alt="" className="w-full h-full object-cover group-hover/food:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-black text-text-primary truncate line-clamp-1">{item.item?.name || item.name}</p>
                          <div className="flex items-center justify-between mt-1">
                             <p className="text-caption text-text-muted">Qty: <span className="text-text-primary">{item.quantity}</span></p>
                             <p className="text-[11px] font-black text-brand">₹{item.price * item.quantity}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right: Payment & Status Control */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="premium-card p-8 bg-bg-secondary">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-text-muted">
                     <CreditCard size={14} />
                     <span className="text-caption">Payout Amount</span>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-caption border ${data.paymentStatus === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                    {data.paymentStatus || 'COD'}
                  </div>
               </div>
               <div className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-8">
                  ₹{shopOrder.subTotal}
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="block text-caption text-text-muted mb-3 ml-1">Process Phase</label>
                    <div className="relative">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className="w-full bg-bg-primary border border-border text-text-primary px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                      >
                        <option value="pending">PENDING</option>
                        <option value="preparing">PREPARING</option>
                        <option value="out of delivery">OUT FOR DELIVERY</option>
                        <option value="delivered">DELIVERED</option>
                      </select>
                      <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Delivery Partner Info Section */}
                  {(currentStatus === 'out of delivery' || currentStatus === 'delivered') && (
                    <div className="pt-6 border-t border-border space-y-4 animate-in">
                      <div className="flex items-center justify-between">
                         <span className="text-caption text-text-muted">Logistic Partner</span>
                         <div className={`w-2 h-2 rounded-full ${availableBoys.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </div>
                      
                      {availableBoys.length > 0 ? (
                        <div className="space-y-3">
                           {availableBoys.map((boy, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 bg-bg-primary border border-border rounded-2xl group/boy hover:border-brand/30 transition-all">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                                     <Navigation size={16} />
                                  </div>
                                  <div>
                                     <p className="text-[12px] font-black text-text-primary">{boy.fullname}</p>
                                     <p className="text-caption text-text-muted">{boy.mobile}</p>
                                  </div>
                               </div>
                               {boy.assigned && <CheckCircle2 size={16} className="text-emerald-500" />}
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                          <p className="text-caption text-amber-500 text-center">
                            Awaiting Dispatch Partner...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="h-14 rounded-2xl border border-border bg-bg-secondary text-caption text-text-muted hover:bg-bg-tertiary hover:text-text-primary transition-all">
                   Contact User
                </button>
                <button className="h-14 rounded-2xl border border-border bg-bg-secondary text-caption text-text-muted hover:bg-bg-tertiary hover:text-text-primary transition-all">
                   Print Invoice
                </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-bg-secondary relative">
          <div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-brand to-brand-glow transition-all duration-1000 ease-out ${
              currentStatus === 'pending' ? 'w-1/4' : 
              currentStatus === 'preparing' ? 'w-2/4' : 
              currentStatus === 'out of delivery' ? 'w-3/4' : 'w-full'
            }`} 
          />
      </div>
    </div>
  );
};

export default OwnerOrderCard;
