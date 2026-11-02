"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";

export default function AdminLogin() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminData();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-safety to-yellow-400 flex items-center justify-center shadow-md shadow-safety/25">
            <Zap size={20} className="text-ink" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-white">SAHIL</span>
            <span className="text-[10px] font-medium text-safety uppercase tracking-wider block">INDUSTRIES</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Admin Login</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to manage Sahil Industries</p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@sahilcranes.in"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-safety/50 focus:ring-1 focus:ring-safety transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-safety/50 focus:ring-1 focus:ring-safety transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                <input type="checkbox" className="rounded bg-white/5 border border-white/10 text-safety focus:ring-safety" />
                <span>Remember me</span>
              </label>
              <a href="/" className="text-xs text-safety hover:text-safety/80 underline underline-offset-4">Back to website</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-safety text-ink font-bold rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-safety/20 hover:shadow-safety/30"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center text-xs text-slate-500">
            <span className="mr-2">Demo credentials</span>
            <span className="text-safety font-mono text-[11px]">admin@sahilcranes.in</span>
            <span className="ml-2 text-slate-500">/</span>
            <span className="ml-2 text-safety font-mono text-[11px]">admin123</span>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Sahil Industries &copy; {new Date().getFullYear()} &bull; Management Portal (Demo)
        </p>
      </div>
    </div>
  );
}
