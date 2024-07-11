import React from "react";
import { UserDetails } from "@/utils/types";
import AdminLayout from "../Layout/AdminLayout";

import Dashboard from "../AdminComponents/Dashboard";

export default function AdminDashboard({ user }: { user: UserDetails }) {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
