import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeliveryBoyTraking from '../components/DeliveryBoyTraking';
import { Navigation, ArrowLeft, Bike, CheckCircle } from 'lucide-react';
import { FaCircle } from 'react-icons/fa';
import OrderStepper from '../components/OrderStepper';
import { updateRealtimeOrderStatus } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const TrackOrderPage = () => {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState(null);
    const navigate = useNavigate();
    const { socket } = useSelector((state) => state.user);
    const [liveLocation, setLiveLocation] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const handleGetOrderById = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, {
                    withCredentials: true,
                });
                setCurrentOrder(res.data.order);
            } catch (err) {
                console.error("❌ Error fetching order:", err);
            }
        };

        handleGetOrderById();

        // Socket Listeners
        if (socket) {
            socket.on('update-status', (payload) => {
                if (payload.orderId === orderId) {
                    handleGetOrderById();
                    dispatch(updateRealtimeOrderStatus(payload));
                }
            });

            socket.on('delivery-boy-assigned', (payload) => {
                if (payload.orderId === orderId) {
                    handleGetOrderById();
                }
            });

            socket.on('delivery-boy-location', (payload) => {
                setLiveLocation(prev => ({ ...prev, [payload.deliveryBoyId]: payload.location }));
            });
        }

        return () => {
            if (socket) {
                socket.off('update-status');
                socket.off('delivery-boy-assigned');
                socket.off('delivery-boy-location');
            }
        };
    }, [orderId, socket, dispatch]);

    if (!currentOrder) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand border-t-transparent mx-auto mb-4"></div>
                    <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest animate-pulse">Loading tracking details...</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: { color: "#F59E0B", light: "rgba(245, 158, 11, 0.1)", label: "Pending" },
        preparing: { color: "#3B82F6", light: "rgba(59, 130, 246, 0.1)", label: "In Kitchen" },
        "out of delivery": {
            color: "#8B5CF6",
            light: "rgba(139, 92, 246, 0.1)",
            label: "On the Way",
        },
        delivered: { color: "#10B981", light: "rgba(16, 185, 129, 0.1)", label: "Delivered" },
    };

    return (
        <div className="min-h-screen relative bg-bg-secondary text-text-primary overflow-hidden pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand shadow-sm active:scale-95 transition-all duration-300 mb-8"
                >
                    <ArrowLeft
                        size={14}
                    />
                    Go Back
                </button>

                {/* Page header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-brand rounded-full" />
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">
                            Live <span className="text-brand">Tracking.</span>
                        </h1>
                    </div>
                    <p className="text-text-secondary font-bold text-[11px] uppercase tracking-widest mt-3 ml-6">
                        Order <span className="text-text-primary">#{orderId.slice(-6)}</span>
                    </p>
                </div>

                {/* Order cards */}
                {currentOrder.shopOrders.map((shopOrder, index) => {
                    const currentStatus = shopOrder.status || "pending";
                    const theme = statusConfig[currentStatus] || statusConfig.pending;

                    return (
                        <div key={index} className="bg-bg-card border border-border rounded-[2.5rem] shadow-md overflow-hidden mb-8 relative">
                            {/* Shop header */}
                            <div className="px-6 sm:px-10 py-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative z-10 bg-bg-secondary/30 shadow-sm">
                                <div className="flex items-center gap-5">
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-bg-secondary border border-border shadow-inner p-0.5">
                                        <div className="w-full h-full rounded-xl overflow-hidden">
                                            {shopOrder.shop?.image ? (
                                                <img
                                                    src={shopOrder.shop.image}
                                                    alt={shopOrder.shop?.name || "Shop"}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/48?text=Shop";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-text-muted text-[10px] font-black uppercase">
                                                    Shop
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-text-primary text-xl tracking-tight leading-none mb-1">
                                            {shopOrder.shop?.name || "Restaurant"}
                                        </h3>
                                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">
                                            Order #{orderId.slice(-6)}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="px-5 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 backdrop-blur-md"
                                    style={{
                                        borderColor: `${theme.color}40`,
                                        color: theme.color,
                                        backgroundColor: theme.light,
                                    }}
                                >
                                    <FaCircle
                                        size={6}
                                        className={currentStatus !== "delivered" ? "animate-pulse" : ""}
                                    />
                                    {theme.label}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-10 space-y-8 relative z-10">
                                {/* Order Stepper */}
                                <div className="bg-bg-secondary border border-border rounded-3xl pb-10 shadow-inner">
                                    <OrderStepper currentStatus={currentStatus} />
                                </div>

                                {/* Items summary */}
                                <div className="bg-bg-secondary p-6 rounded-[1.5rem] border border-border shadow-inner">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">
                                        Items Checkout List
                                    </p>
                                    <div className="space-y-4">
                                        {shopOrder.shopOrderItems?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-text-secondary">
                                                    {item.item?.name || item.name}{" "}
                                                    <span className="text-brand ml-2 font-black text-[11px] bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                                </span>
                                                <span className="font-black text-text-primary text-[15px]">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-border mt-5 pt-5 flex justify-between items-center">
                                        <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Subtotal</span>
                                        <span className="font-black text-text-primary text-lg">₹{shopOrder.subTotal}</span>
                                    </div>
                                </div>

                                {/* Delivery address */}
                                <div className="bg-bg-card p-6 rounded-[1.5rem] border border-border flex items-start gap-5 shadow-sm">
                                    <div className="mt-1 text-brand"><Navigation className="rotate-180" size={24} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                                            Delivery Address
                                        </p>
                                        <p className="text-text-primary font-bold text-[14px] leading-relaxed max-w-lg">
                                            {currentOrder.deliveryAddress?.text}
                                        </p>
                                    </div>
                                </div>

                                {/* Tracking section */}
                                {shopOrder.status !== 'delivered' ? (
                                    <div>
                                        {shopOrder.assignedDeliveryBoy ? (
                                            <div className="space-y-6">
                                                {/* Delivery boy info card */}
                                                <div className="bg-blue-500/10 p-6 rounded-[1.5rem] border border-blue-500/20 shadow-sm">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-inner">
                                                            <Bike size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-text-primary text-[15px]">
                                                                {shopOrder.assignedDeliveryBoy.fullname}
                                                            </p>
                                                            <p className="text-[11px] font-bold text-text-secondary tracking-widest mt-0.5">
                                                                {shopOrder.assignedDeliveryBoy.mobile}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm" />
                                                        Delivery partner assigned & on the way
                                                    </p>
                                                </div>

                                                {/* Live map */}
                                                {shopOrder.assignedDeliveryBoy.location?.coordinates && currentOrder.deliveryAddress && (
                                                    <div className="relative mt-8">
                                                        {liveLocation[shopOrder.assignedDeliveryBoy._id] && (
                                                            <div className="absolute top-4 left-4 z-10 bg-bg-card/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3 border border-border">
                                                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                                                    Live Tracking Active
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="h-[400px] w-full rounded-[2rem] overflow-hidden shadow-md border border-border group">
                                                            <DeliveryBoyTraking
                                                                data={{
                                                                    deliveryBoyLocation: liveLocation[shopOrder.assignedDeliveryBoy._id] || {
                                                                        lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                                                        lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                                                    },
                                                                    customerLocation: {
                                                                        lat: currentOrder.deliveryAddress.latitude,
                                                                        lon: currentOrder.deliveryAddress.longitude
                                                                    }
                                                                }}
                                                            />
                                                        </div>

                                                        <p className="text-[9px] text-text-muted font-bold mt-4 text-center uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                            <Navigation size={12} className="text-text-muted" />
                                                            Map updates in real-time
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-amber-500/10 p-8 rounded-[1.5rem] border border-amber-500/20 text-center shadow-sm">
                                                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-inner">
                                                    <Bike size={28} className="text-amber-400" />
                                                </div>
                                                <p className="font-black text-amber-400 text-[13px] uppercase tracking-widest mb-2">
                                                    Awaiting Delivery Partner
                                                </p>
                                                <p className="text-amber-400/60 text-xs font-medium max-w-xs mx-auto">
                                                    Your premium order is being processed and will be assigned shortly.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-emerald-500/10 p-8 rounded-[1.5rem] border border-emerald-500/20 text-center shadow-sm">
                                        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-inner">
                                            <CheckCircle className="text-emerald-400" size={32} />
                                        </div>
                                        <p className="font-black text-emerald-400 text-[13px] uppercase tracking-widest mb-2">
                                            Order Delivered
                                        </p>
                                        <p className="text-emerald-400/60 text-xs font-medium max-w-sm mx-auto">
                                            Your order has been successfully delivered. We hope you enjoy the experience!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackOrderPage;