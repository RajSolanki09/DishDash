import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  FaSearch,
  
  FaTimes,
  FaMapMarkerAlt,
  FaRegCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  IoChevronBackCircleOutline,
  IoLocationOutline,
  IoChevronForward,
} from "react-icons/io5";
import { FaLocationDot, FaLocationCrosshairs } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { serverUrl } from "../App";
import axios from "axios";
import { addMyOrder, clearCart } from "../redux/userSlice";
import { setLocation, setAdress } from "../redux/mapSlice";
import { ClipLoader } from "react-spinners";
import Nav from "../components/Nav";
import { TbArrowLeft } from "react-icons/tb";

// Leaflet Icon Setup (unchanged)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapViewCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const DraggableMarker = ({ position, onPositionChange }) => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) onPositionChange(marker.getLatLng());
      },
    }),
    [onPositionChange]
  );
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={redIcon}
    />
  );
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");

  const deliveryFee = 50;
  const grandTotal = totalAmount + deliveryFee;
  const mapCenter = [
    location?.lat || 23.0225,
    location?.lon || 72.5714,
  ];

  const handlePositionChange = async (newPos) => {
    dispatch(setLocation({ lat: newPos.lat, lon: newPos.lng }));
    await reverseGeocode(newPos.lat, newPos.lng);
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      if (data.display_name) {
        const cleanAddress = data.display_name.split(",").slice(0, 3).join(",");
        dispatch(setAdress(cleanAddress));
      }
    } catch (error) {
      console.error("Reverse geocode failed", error);
    }
  };

  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchAddress
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data?.[0]) {
        const { lat, lon, display_name } = data[0];
        dispatch(
          setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) })
        );
        dispatch(
          setAdress(display_name.split(",").slice(0, 3).join(","))
        );
        setSearchAddress("");
      }
    } catch (error) {
      alert("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        dispatch(setLocation({ lat, lon }));
        await reverseGeocode(lat, lon);
        setGettingLocation(false);
      },
      () => setGettingLocation(false)
    );
  };

  const handlePlaceOrder = async () => {
    if (!location?.lat || !address)
      return alert("Please set delivery location");
    if (!houseNo) return alert("Please enter Flat/House number for delivery");

    setPlacing(true);
    const finalFullAddress = `${houseNo}${
      landmark ? `, Near ${landmark}` : ""
    }, ${address}`;

    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: finalFullAddress,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: grandTotal,
          cartItems,
        },
        { withCredentials: true }
      );

      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data?.newOrder || result.data));
        dispatch(clearCart());
        navigate("/order-placed");
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      alert("Order failed");
    } finally {
      setPlacing(false);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_ID);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Vingo",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result.data));
          dispatch(clearCart());
          navigate("/order-placed");
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("Payment Verification Failed! Please contact support.");
        }
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
      },
      theme: {
        color: "#ff4d2d",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header with consistent back button (styled like global back button but with cart navigation) */}
        <header className="mb-12">
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

          <div className="mt-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Confirm <span className="text-[#ff4d2d]">Order.</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-2 tracking-wide">
              Almost there – just confirm your address and payment
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN – Address & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* 🗺️ Delivery Address Card – Premium Glass */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/70 shadow-md shadow-gray-100/40 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#fff6f0] to-white rounded-2xl flex items-center justify-center text-[#ff4d2d] shadow-sm">
                    <FaLocationDot size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">
                      Delivery Address
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Where should we drop it?
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGetCurrentLocation}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {gettingLocation ? (
                    <ClipLoader size={14} color="white" />
                  ) : (
                    <>
                      <FaLocationCrosshairs size={14} />
                      <span>Use My GPS</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Search Input */}
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200/80 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10 px-14 py-4 rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-400"
                    placeholder="Search for your building, street or area..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
                  />
                  <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" size={16} />
                  {searching && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <ClipLoader size={16} color="#ff4d2d" />
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="h-[350px] md:h-[400px] rounded-2xl overflow-hidden border-2 border-white/50 shadow-lg">
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapViewCenter center={mapCenter} />
                    {location?.lat && (
                      <DraggableMarker
                        position={[location.lat, location.lon]}
                        onPositionChange={handlePositionChange}
                      />
                    )}
                    <MapClickHandler onMapClick={handlePositionChange} />
                  </MapContainer>
                </div>

                {/* Address Details Form */}
                {address && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                          Flat / House No / Floor *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Flat 402, 4th Floor"
                          className="w-full bg-gray-50 border border-gray-200/80 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-xl text-sm font-bold outline-none transition-all"
                          value={houseNo}
                          onChange={(e) => setHouseNo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Apollo Hospital"
                          className="w-full bg-gray-50 border border-gray-200/80 focus:border-[#ff4d2d]/40 focus:ring-2 focus:ring-[#ff4d2d]/10 px-5 py-3.5 rounded-xl text-sm font-bold outline-none transition-all"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-2xl flex items-start gap-4 shadow-md">
                      <IoLocationOutline className="mt-1 text-[#ff4d2d]" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                          Detected Area
                        </p>
                        <p className="text-sm font-bold">{address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 💳 Payment Method Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-200/70 shadow-md shadow-gray-100/40">
              <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ff4d2d] rounded-full"></span>
                Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-[#ff4d2d] bg-gradient-to-br from-[#fff6f0] to-white shadow-md"
                      : "border-gray-200/80 bg-gray-50/50 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      paymentMethod === "cod"
                        ? "bg-[#ff4d2d] text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <FaMoneyBillWave size={18} />
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-black uppercase ${
                        paymentMethod === "cod"
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Cash on Delivery
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      Pay at your door
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                    paymentMethod === "online"
                      ? "border-[#ff4d2d] bg-gradient-to-br from-[#fff6f0] to-white shadow-md"
                      : "border-gray-200/80 bg-gray-50/50 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      paymentMethod === "online"
                        ? "bg-[#ff4d2d] text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <FaRegCreditCard size={18} />
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-black uppercase ${
                        paymentMethod === "online"
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Online Payment
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      UPI, Cards or Netbanking
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Order Summary (Sticky) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-200/70">
              <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ff4d2d] rounded-full"></span>
                Order Summary
              </h2>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar mb-6">
                {cartItems?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-black text-gray-700 group-hover:bg-[#ff4d2d] group-hover:text-white transition-colors">
                        {item.quantity}x
                      </div>
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-tight max-w-[150px] truncate">
                        {item.name}
                      </p>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-5 border-t border-gray-100">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-black">
                    ₹{totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-full text-[11px]">
                    ₹{deliveryFee}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mt-6 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100/80">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 uppercase">
                    Grand Total
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-[#ff4d2d]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                disabled={placing || !location?.lat}
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4a] text-white py-5 rounded-2xl font-black text-lg shadow-md shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {placing ? (
                  <ClipLoader size={22} color="white" />
                ) : (
                  <>
                    PLACE ORDER <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center mt-5 text-gray-400 font-bold uppercase tracking-widest">
                🔒 Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;