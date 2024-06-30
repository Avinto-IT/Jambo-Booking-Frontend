"use client";
import { useEffect, useState } from "react";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import React from "react";
import { UserDetails } from "@/types";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import HotelDashboard from "@/components/dashboard/HotelDashboard";
import withAuth from "@/lib/loginAuth";

interface DashboardProps {
  user: UserDetails;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const userRole = user?.role;

  const renderDashboard = () => {
    if (userRole === "admin") {
      return <AdminDashboard user={user} />;
    } else if (userRole === "agent") {
      return <AgentDashboard user={user} />;
    } else if (userRole === "hotel") {
      return <HotelDashboard user={user} />;
    }
    return null; // Add a fallback return to handle any undefined role
  };

  return <div>{renderDashboard()}</div>;
};

export default withAuth(Dashboard);
