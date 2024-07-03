import React from "react";
import AddHotel from "./AdminComponents/AddHotel";
import { UserDetails } from "@/types";

export default function AdminDashboard({ user }: { user: UserDetails }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">This is Admin Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Contact: {user?.contactNumber}</p>
      <AddHotel />
    </div>
  );
}
