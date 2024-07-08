import React from "react";
import { UserDetails } from "@/utils/types";

export default function AgentDashboard({ user }: { user: UserDetails }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">This is Agent Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Contact: {user?.contactNumber}</p>
    </div>
  );
}
