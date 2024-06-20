"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import UserDashboard from "../../components/dashboard/UserDashboard";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import EditorDashboard from "../../components/dashboard/EditorDashboard";
import React from "react";

interface UserDetails {
  email: string;
  username: string;
  role: string;
  contactNumber: number;
  agencyName: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const userRole = user?.role;
  console.log(userRole);
  useEffect(() => {
    const userDetails = Cookies.get("userDetails");
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }
  const renderComponent = () => {
    switch (userRole) {
      case "user":
        return <UserDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "editor":
        return <EditorDashboard />;
    }
  };
  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Contact: {user.contactNumber}</p>
      <p>Agency: {user.agencyName}</p>
      {renderComponent()}
    </div>
  );
}
