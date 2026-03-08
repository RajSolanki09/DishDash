import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";


import deliveryBoyImg from "../assets/scooter.png";       
import customerImg from "../assets/home.png";         

// Create custom icons using your images (crisp and sharp)
const deliveryBoyIcon = L.icon({
  iconUrl: deliveryBoyImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customerIcon = L.icon({
  iconUrl: customerImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const DeliveryBoyTraking = ({ data }) => {
  const { deliveryBoyLocation, customerLocation } = data || {};

  if (
    !deliveryBoyLocation?.lat ||
    !deliveryBoyLocation?.lon ||
    !customerLocation?.lat ||
    !customerLocation?.lon
  ) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Location not available
      </p>
    );
  }

  const path = [
    [deliveryBoyLocation.lat, deliveryBoyLocation.lon],
    [customerLocation.lat, customerLocation.lon],
  ];

  return (
    <div className="w-full aspect-video min-h-[200px] rounded-xl overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={[deliveryBoyLocation.lat, deliveryBoyLocation.lon]}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[deliveryBoyLocation.lat, deliveryBoyLocation.lon]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>

        <Marker
          position={[customerLocation.lat, customerLocation.lon]}
          icon={customerIcon}
        >
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} color="#ff4d2d" weight={4} opacity={0.7} />
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTraking;