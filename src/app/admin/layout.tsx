import { AdminDataProvider } from "@/context/AdminDataContext";
import { ReactNode } from "react";

export const metadata = {
  // Do not disclose the protected dashboard in the unauthenticated document
  // metadata. The page itself is client-rendered after the session check.
  title: "Administrator Sign In | Sahil Industries",
  description: "Secure administrator sign in for Sahil Industries",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminDataProvider>{children}</AdminDataProvider>;
}
