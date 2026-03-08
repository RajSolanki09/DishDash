import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashbord";
import OwnerDashboard from "../components/OwnerDashbord";
import DeliveryBoy from "../components/DeliveryBoy";
import LandingPage from "./LandingPage";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  // ═══════════════════════════════════════════════════════════════════
  // NOT LOGGED IN → Show Landing Page
  // ═══════════════════════════════════════════════════════════════════
  if (!userData || !userData.role) {
    return <LandingPage />;
  }

  // ═══════════════════════════════════════════════════════════════════
  // LOGGED IN → Show Role-Specific Dashboard
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen w-full">
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
};

export default Home;