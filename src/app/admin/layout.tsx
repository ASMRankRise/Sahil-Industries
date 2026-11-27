import { AdminDataProvider } from "@/context/AdminDataContext";
import { ToastProvider } from "@/context/ToastContext";
import { ReactNode } from "react";

export const metadata = {
  // Do not disclose the protected dashboard in the unauthenticated document
  // metadata. The page itself is client-rendered after the session check.
  title: "Administrator Sign In | Sahil Industries",
  description: "Secure administrator sign in for Sahil Industries",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <ToastProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("admin_theme")||"dark";document.documentElement.setAttribute("data-admin-theme",t);if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
        {children}
      </ToastProvider>
    </AdminDataProvider>
  );
}
