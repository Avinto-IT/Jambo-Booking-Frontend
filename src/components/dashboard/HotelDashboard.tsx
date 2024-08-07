import React from "react";
import { UserDetails } from "@/utils/types";

export default function HotelDashboard({ user }: { user: UserDetails }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">This is Hotel Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Contact: {user?.contactNumber}</p>
    </div>
  );
}
