import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  Crosshair,
  CreditCard,
  Banknote,
  ArrowLeft,
  ChevronRight,
  Lock,
  Navigation
} from "lucide-react";
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
import gsap from "gsap";

// Leaflet Icon Setup
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

  const containerRef = useRef(null);

  const deliveryFee = 40;
  const grandTotal = totalAmount + deliveryFee;
  const mapCenter = [
    location?.lat || 23.0225,
    location?.lon || 72.5714,
  ];

  // GSAP Entry Animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".header-anim",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
      )
        .fromTo(
          ".address-card-anim",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.6"
        )
        .fromTo(
          ".payment-card-anim",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".summary-card-anim",
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.6"
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
      console.error(error);
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
    const finalFullAddress = `${houseNo}${landmark ? `, Near ${landmark}` : ""
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
      console.error(error);
      alert("Order failed");
    } finally {
      setPlacing(false);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
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
    <div className="min-h-screen relative bg-bg-secondary text-text-primary overflow-hidden pb-20" ref={containerRef}>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <header className="mb-10 header-anim">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 h-10 px-5 bg-bg-card border border-border rounded-xl text-text-secondary font-bold text-[10px] uppercase tracking-widest hover:border-brand hover:text-brand shadow-sm active:scale-95 transition-all duration-300 mb-8"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          <div className="mt-4">
            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">
              Confirm <span className="text-brand">Order.</span>
            </h1>
            <p className="text-text-secondary font-medium text-sm mt-3 tracking-wide">
              Securely finalize your address and payment details
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN – Address & Payment */}
          <div className="lg:col-span-8 space-y-8">
            {/* 🗺️ Delivery Address Card */}
            <div className="address-card-anim bg-bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden relative">
              <div className="p-6 sm:p-8 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-bg-secondary/30">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-brand/5 border border-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text-primary leading-tight">
                      Delivery Address
                    </h2>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                      Pinpoint your location
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGetCurrentLocation}
                  className="flex items-center gap-2 px-6 py-3 bg-bg-secondary border border-border rounded-xl text-[10px] font-black text-text-primary uppercase tracking-widest shadow-sm hover:bg-brand hover:border-brand hover:text-white active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  {gettingLocation ? (
                    <ClipLoader size={14} color="#ff4d2d" />
                  ) : (
                    <>
                      <Crosshair size={14} />
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
                    className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card pl-14 pr-12 py-4 rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-text-muted text-text-primary shadow-inner focus:shadow-md"
                    placeholder="Search building, street, or area..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                  {searching && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <ClipLoader size={16} color="#ff4d2d" />
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-border shadow-md relative group">
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    className="h-full w-full z-0"
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
                  <div className="space-y-5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
                          Flat / House No / Floor *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Flat 402, 4th Floor"
                          className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card px-5 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                          value={houseNo}
                          onChange={(e) => setHouseNo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Apollo Hospital"
                          className="w-full bg-bg-secondary border border-border focus:border-brand focus:bg-bg-card px-5 py-4 rounded-xl text-sm font-bold text-text-primary outline-none transition-all placeholder:text-text-muted shadow-inner focus:shadow-md"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-bg-secondary border border-border p-5 rounded-2xl flex items-start gap-4 shadow-inner mt-4">
                      <Navigation className="mt-1 text-brand" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">
                          Detected Location
                        </p>
                        <p className="text-sm font-bold text-text-primary leading-relaxed">{address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 💳 Payment Method Card */}
            <div className="payment-card-anim bg-bg-card rounded-[2.5rem] border border-border shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-black text-text-primary mb-8 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/5 border border-brand/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-brand" size={18} />
                </div>
                Payment Choice
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex flex-col items-start gap-4 p-6 rounded-2xl border transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden ${paymentMethod === "cod"
                      ? "border-brand bg-brand/5 shadow-md"
                      : "border-border bg-bg-card hover:border-brand/30 hover:bg-bg-secondary"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all border ${paymentMethod === "cod"
                        ? "bg-brand text-white border-brand"
                        : "bg-bg-secondary border-border text-text-muted"
                      }`}
                  >
                    <Banknote size={24} />
                  </div>
                  <div className="text-left mt-2">
                    <p
                      className={`text-[13px] font-black uppercase tracking-wider mb-1 ${paymentMethod === "cod" ? "text-text-primary" : "text-text-secondary"
                        }`}
                    >
                      Cash on Delivery
                    </p>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Pay at your door
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`flex flex-col items-start gap-4 p-6 rounded-2xl border transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden ${paymentMethod === "online"
                      ? "border-brand bg-brand/5 shadow-md"
                      : "border-border bg-bg-card hover:border-brand/30 hover:bg-bg-secondary"
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all border ${paymentMethod === "online"
                        ? "bg-brand text-white border-brand"
                        : "bg-bg-secondary border-border text-text-muted"
                      }`}
                  >
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left mt-2">
                    <p
                      className={`text-[13px] font-black uppercase tracking-wider mb-1 ${paymentMethod === "online" ? "text-text-primary" : "text-text-secondary"
                        }`}
                    >
                      Online Payment
                    </p>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      UPI, Cards & Netbanking
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Order Summary (Sticky) */}
          <div className="lg:col-span-4 sticky top-28 summary-card-anim">
            <div className="bg-bg-card border border-border rounded-[2.5rem] p-6 sm:p-8 shadow-lg">
              <h2 className="text-[16px] font-black text-text-primary uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-brand rounded-full" />
                Final Summary
              </h2>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {cartItems?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group bg-bg-secondary/50 border border-border p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-bg-card border border-border rounded-lg flex items-center justify-center text-[11px] font-black text-brand shadow-sm">
                        {item.quantity}x
                      </div>
                      <p className="text-[12px] font-bold text-text-primary uppercase tracking-widest max-w-[130px] truncate">
                        {item.name}
                      </p>
                    </div>
                    <span className="text-[13px] font-black text-text-primary">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-text-primary text-[13px]">
                    ₹{totalAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                  <span>White-Glove Delivery</span>
                  <span className="text-brand text-[11px] bg-brand/5 border border-brand/10 px-3 py-1 rounded-lg">
                    ₹{deliveryFee}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mt-8 bg-bg-secondary p-6 rounded-[1.5rem] border border-border shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black text-text-primary uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-4xl font-black text-brand leading-none">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                disabled={placing || !location?.lat}
                onClick={handlePlaceOrder}
                className="w-full mt-8 primary-button py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {placing ? (
                  <ClipLoader size={22} color="white" />
                ) : (
                  <>
                    CONFIRM & PAY <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[9px] text-center mt-6 text-text-muted font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Lock size={10} className="text-brand opacity-70" />
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;