"use client";

import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { useAdminData } from "@/context/AdminDataContext";

export default function AdminPage() {
  const { isAuthenticated } = useAdminData();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
