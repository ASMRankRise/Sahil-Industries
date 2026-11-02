import { AdminDataProvider } from "@/context/AdminDataContext";
import { ReactNode } from "react";

export const metadata = {
  title: "Admin Dashboard | Sahil Industries",
  description: "Sahil Industries Management Portal",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminDataProvider>{children}</AdminDataProvider>;
}
