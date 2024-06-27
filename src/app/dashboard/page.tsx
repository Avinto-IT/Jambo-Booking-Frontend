"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import React from "react";
import { UserDetails } from "@/types";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import HotelDashboard from "@/components/dashboard/HotelDashboard";

export default function Dashboard() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const userRole = user?.role;

  useEffect(() => {
    const userDetails = Cookies.get("userDetails");
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }
  const renderDashboard = () => {
    if (userRole === "admin") {
      return <AdminDashboard user={user} />;
    } else if (userRole === "agent") {
      return <AgentDashboard user={user} />;
    } else if (userRole === "hotel") {
      return <HotelDashboard user={user} />;
    }
  };

  return <div>{renderDashboard()}</div>;
}
