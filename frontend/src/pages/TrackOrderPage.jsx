import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeliveryBoyTraking from '../components/DeliveryBoyTraking';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { TbArrowLeft, TbBike } from 'react-icons/tb';
import { FaCircle } from 'react-icons/fa';

const TrackOrderPage = () => {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState(null);
    const navigate = useNavigate();
    const { socket } = useSelector((state) => state.user);
    const [liveLocation, setLiveLocation] = useState({});

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

    // 🔥 REAL-TIME LOCATION LISTENER
    useEffect(() => {
        if (!socket) return;

        const handleLocationUpdate = ({ deliveryBoyId, latitude, longitude }) => {
            console.log(`📍 Delivery boy location updated: ${deliveryBoyId}`, { latitude, longitude });
            
            setLiveLocation(prev => ({
                ...prev,
                [deliveryBoyId]: {
                    lat: latitude,
                    lon: longitude
                }
            }));
        };

        socket.on('updateDeliveryLocation', handleLocationUpdate);

        // Cleanup
        return () => {
            socket.off('updateDeliveryLocation', handleLocationUpdate);
        };
    }, [socket]);
    
    useEffect(() => {
        handleGetOrderById();
    }, [orderId]);
    
    if (!currentOrder) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#ff4d2d] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: { color: "#F59E0B", light: "#FFFBEB", label: "Pending" },
        preparing: { color: "#3B82F6", light: "#EFF6FF", label: "In Kitchen" },
        "out of delivery": {
            color: "#8B5CF6",
            light: "#F5F3FF",
            label: "On the Way",
        },
        delivered: { color: "#10B981", light: "#ECFDF5", label: "Delivered" },
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
               {/* Back button — unified ghost style */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-wide shadow-sm hover:bg-orange-50 hover:border-[#ff4d2d]/30 hover:text-[#ff4d2d] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer mb-7"
            >
              <TbArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform duration-200"
              />
              Back
            </button>

                {/* Page header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-[#ff4d2d] to-[#ff8e6d] rounded-full" />
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                            Track <span className="text-[#ff4d2d]">Order</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 font-medium text-sm mt-2 ml-4">
                        Order ID: #{orderId.slice(-6)}
                    </p>
                </div>

                {/* Order cards */}
                {currentOrder.shopOrders.map((shopOrder, index) => {
                    const currentStatus = shopOrder.status || "pending";
                    const theme = statusConfig[currentStatus] || statusConfig.pending;

                    return (
                        <div key={index} className="bg-white rounded-3xl border-2 border-gray-200/80 shadow-md shadow-gray-200/50 overflow-hidden mb-6">
                            {/* Shop header */}
                            <div className="px-6 sm:px-8 py-5 border-b-2 border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border-2 border-gray-200">
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
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                Shop
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg tracking-tight leading-none mb-1">
                                            {shopOrder.shop?.name || "Restaurant"}
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Order #{orderId.slice(-6)}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="px-5 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                                    style={{
                                        borderColor: theme.color,
                                        color: theme.color,
                                        backgroundColor: "white",
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
                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Items summary */}
                                <div className="bg-gray-50/50 p-5 rounded-2xl border-2 border-gray-200/60">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                        Items
                                    </p>
                                    <div className="space-y-2">
                                        {shopOrder.shopOrderItems?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-gray-700">
                                                    {item.item?.name || item.name}{" "}
                                                    <span className="text-gray-400 font-medium">x{item.quantity}</span>
                                                </span>
                                                <span className="font-black text-gray-900">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t-2 border-gray-200 mt-3 pt-3 flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-500 uppercase">Subtotal</span>
                                        <span className="font-black text-gray-900">₹{shopOrder.subTotal}</span>
                                    </div>
                                </div>

                                {/* Delivery address */}
                                <div className="bg-gray-50/50 p-5 rounded-2xl border-2 border-gray-200/60 flex items-start gap-4">
                                    <div className="mt-1 text-[#ff4d2d]">
                                        <IoChevronBackCircleOutline className="rotate-180" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Delivery Address
                                        </p>
                                        <p className="text-gray-900 font-bold text-sm leading-snug">
                                            {currentOrder.deliveryAddress?.text}
                                        </p>
                                    </div>
                                </div>

                                {/* Tracking section */}
                                {shopOrder.status !== 'delivered' ? (
                                    <div>
                                        {shopOrder.assignedDeliveryBoy ? (
                                            <div className="space-y-4">
                                                {/* Delivery boy info card */}
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-200">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black">
                                                            <TbBike size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-sm">
                                                                {shopOrder.assignedDeliveryBoy.fullname}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-gray-500">
                                                                {shopOrder.assignedDeliveryBoy.mobile}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                                        Delivery partner assigned
                                                    </p>
                                                </div>

                                                {/* Live map */}
                                                {shopOrder.assignedDeliveryBoy.location?.coordinates && currentOrder.deliveryAddress && (
                                                    <div className="relative">
                                                        {liveLocation[shopOrder.assignedDeliveryBoy._id] && (
                                                            <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 border-2 border-gray-200">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">
                                                                    Live Tracking
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="h-[350px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-white">
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

                                                        <p className="text-[10px] text-gray-400 font-bold mt-3 text-center uppercase tracking-widest">
                                                            📍 Map updates in real-time as delivery boy moves
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 text-center">
                                                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-200">
                                                    <TbBike size={24} className="text-amber-600" />
                                                </div>
                                                <p className="font-black text-amber-800 text-sm uppercase tracking-widest mb-1">
                                                    No Delivery Boy Assigned Yet
                                                </p>
                                                <p className="text-amber-600 text-xs font-medium">
                                                    Your order will be assigned to a delivery boy soon.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 text-center">
                                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-green-200">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="font-black text-green-800 text-sm uppercase tracking-widest mb-1">
                                            Delivered
                                        </p>
                                        <p className="text-green-600 text-xs font-medium">
                                            Your order has been successfully delivered!
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