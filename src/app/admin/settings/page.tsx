"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Lock,
  Key,
  Moon,
  Sun,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Wrench,
  Zap,
  Trash2,
  Plus,
  Edit,
  Download,
  Upload,
  Settings as SettingsIcon,
  Copy,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Wrench },
  { id: "advanced", label: "Advanced", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("INR");
  const [appName, setAppName] = useState("Sahil Industries Admin");
  const [companyName, setCompanyName] = useState("Sahil Industries");
  const [supportEmail, setSupportEmail] = useState("sahilcranes@gmail.com");
  const [supportPhone, setSupportPhone] = useState("+91 96 2324 2324");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [enquiryAlerts, setEnquiryAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [apiKeys, setApiKeys] = useState([
    { id: "key_1", name: "Production API", key: "sk_live_****_****_****_a1b2", created: "2024-01-10", status: "Active" },
    { id: "key_2", name: "Development API", key: "sk_test_****_****_****_c3d4", created: "2024-01-12", status: "Active" },
    { id: "key_3", name: "Webhook Handler", key: "sk_live_****_****_****_e5f6", created: "2023-12-20", status: "Revoked" },
  ]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      status: "Active"
    };
    setApiKeys(prev => [...prev, newKey]);
    setShowNewKeyModal(false);
    setNewKeyName("");
  };

  return (
    <AdminDashboardLayout activeNav="/admin/settings" pageTitle="Settings" pageDescription="Configure application preferences, security, and integrations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-safety bg-clip-text text-transparent">Settings</h2>
            <p className="text-slate-400 mt-1">Configure application preferences, security, and integrations</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-safety to-yellow-400 text-ink rounded-lg text-sm font-semibold hover:brightness-105 transition-all shadow-sm shadow-safety/20 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Save Success Toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 shadow-2xl"
              role="alert"
            >
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Settings Saved</p>
                <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="border-b border-white/10 overflow-x-auto">
            <nav className="flex gap-1 p-1 min-w-max" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-safety/10 text-safety border-l-4 border-safety shadow-sm shadow-safety/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="p-6 space-y-6">
            {/* General Settings */}
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <SettingsIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">General Settings</h3>
                      <p className="text-sm text-slate-400">Basic application configuration and preferences</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-300">Application Info</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Application Name</label>
                          <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Support Email</label>
                          <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Support Phone</label>
                          <input type="tel" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50 focus:bg-white/10 transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-300">Localization</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Language</label>
                          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="mr">Marathi</option>
                            <option value="gu">Gujarati</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Timezone</label>
                          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York</option>
                            <option value="Europe/London">Europe/London</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Date Format</label>
                          <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Currency</label>
                          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                            <option value="GBP">British Pound (£)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-slate-300">UI Preferences</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" checked={sidebarCollapsed} onChange={(e) => setSidebarCollapsed(e.target.checked)} className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                        <div>
                          <p className="font-medium text-white">Collapse Sidebar by Default</p>
                          <p className="text-xs text-slate-400">Start with sidebar collapsed on desktop</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                        <div>
                          <p className="font-medium text-white">Compact Mode</p>
                          <p className="text-xs text-slate-400">Reduce spacing and padding for dense layouts</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" checked={animationsEnabled} onChange={(e) => setAnimationsEnabled(e.target.checked)} className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                        <div>
                          <p className="font-medium text-white">Enable Animations</p>
                          <p className="text-xs text-slate-400">Enable transitions and micro-interactions</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <Palette size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Appearance</h3>
                      <p className="text-sm text-slate-400">Customize the look and feel of the admin panel</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Theme</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: "light", label: "Light", icon: Sun, desc: "Clean and bright interface" },
                          { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes in low light" },
                          { id: "system", label: "System", icon: Globe, desc: "Match your system preference" },
                        ].map((themeOption) => (
                          <label key={themeOption.id} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${theme === themeOption.id ? "border-safety bg-safety/5" : "border-white/10 hover:border-safety/30"}`}>
                            <input type="radio" name="theme" value={themeOption.id} checked={theme === themeOption.id} onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")} className="sr-only" />
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                                <themeOption.icon size={24} />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{themeOption.label}</p>
                                <p className="text-xs text-slate-400">{themeOption.desc}</p>
                              </div>
                            </div>
                            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === themeOption.id ? "border-safety bg-safety" : "border-white/20"}`}>
                              {theme === themeOption.id && <CheckCircle size={12} className="text-ink" />}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Accent Color</h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        {[
                          { color: "bg-safety", label: "Safety Yellow" },
                          { color: "bg-blue-500", label: "Blue" },
                          { color: "bg-green-500", label: "Green" },
                          { color: "bg-purple-500", label: "Purple" },
                          { color: "bg-orange-500", label: "Orange" },
                          { color: "bg-red-500", label: "Red" },
                        ].map((colorOption) => (
                          <label key={colorOption.color} className="relative cursor-pointer">
                            <input type="radio" name="accent" className="sr-only" />
                            <div className={`h-10 w-10 rounded-xl ${colorOption.color} border-2 ${colorOption.color === "bg-safety" ? "border-safety" : "border-transparent"} transition-all hover:scale-105`} />
                            <span className="text-xs text-slate-400 ml-2">{colorOption.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Notifications</h3>
                      <p className="text-sm text-slate-400">Configure how and when you receive notifications</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">Email Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { id: "emailNotifications", label: "Enable Email Notifications", desc: "Receive email notifications for important events", checked: emailNotifications, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmailNotifications(e.target.checked) },
                        { id: "orderUpdates", label: "Order Status Updates", desc: "Get notified when order status changes", checked: orderUpdates, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setOrderUpdates(e.target.checked) },
                        { id: "enquiryAlerts", label: "New Enquiry Alerts", desc: "Receive notifications for new customer enquiries", checked: enquiryAlerts, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEnquiryAlerts(e.target.checked) },
                        { id: "stockAlerts", label: "Low Stock Alerts", desc: "Get notified when product stock is low", checked: stockAlerts, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStockAlerts(e.target.checked) },
                        { id: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly performance summary emails", checked: weeklyReports, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setWeeklyReports(e.target.checked) },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                          <input type="checkbox" id={item.id} checked={item.checked} onChange={item.onChange} className="w-5 h-5 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                          <div className="flex-1">
                            <p className="font-medium text-white">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4">Push Notifications</h4>
                    <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="checkbox" checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} className="w-5 h-5 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                      <div>
                        <p className="font-medium text-white">Enable Push Notifications</p>
                        <p className="text-xs text-slate-400">Receive real-time browser notifications</p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Security</h3>
                      <p className="text-sm text-slate-400">Manage authentication, access control, and security policies</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Two-Factor Authentication</h4>
                      <label className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" checked={twoFactorEnabled} onChange={(e) => setTwoFactorEnabled(e.target.checked)} className="w-5 h-5 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                        <div>
                          <p className="font-semibold text-white">Enable Two-Factor Authentication (2FA)</p>
                          <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
                        </div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Session Management</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Session Timeout (minutes)</label>
                          <input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))} min={5} max={480} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Password Expiry (days)</label>
                          <input type="number" value={passwordExpiry} onChange={(e) => setPasswordExpiry(Number(e.target.value))} min={30} max={365} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-safety/50" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Login Security</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                          <input type="checkbox" checked={loginAlerts} onChange={(e) => setLoginAlerts(e.target.checked)} className="w-5 h-5 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                          <div>
                            <p className="font-medium text-white">Login Alerts</p>
                            <p className="text-xs text-slate-400">Get notified of new login attempts</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Password</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Current Password</label>
                          <input type="password" placeholder="Enter current password" className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
                          <input type="password" placeholder="Enter new password" className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Confirm New Password</label>
                          <input type="password" placeholder="Confirm new password" className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-safety/50" />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-safety/10 border border-safety/30 rounded-lg text-sm font-medium text-safety hover:bg-safety/20 transition-colors">Update Password</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Integrations Settings */}
              {activeTab === "integrations" && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Integrations</h3>
                      <p className="text-sm text-slate-400">Manage third-party integrations and API connections</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-300">API Keys</h4>
                        <button onClick={() => setShowNewKeyModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-safety/10 border border-safety/30 rounded-lg text-xs font-medium text-safety hover:bg-safety/20 transition-colors">
                          <Plus size={12} />
                          Generate New Key
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                              <th className="px-4 py-3 font-semibold">Name</th>
                              <th className="px-4 py-3 font-semibold">API Key</th>
                              <th className="px-4 py-3 font-semibold">Created</th>
                              <th className="px-4 py-3 font-semibold">Status</th>
                              <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {apiKeys.map((key) => (
                              <tr key={key.id} className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-4 py-3 font-medium text-white">{key.name}</td>
                                <td className="px-4 py-3 font-mono text-slate-300 max-w-[250px] truncate">{key.key}</td>
                                <td className="px-4 py-3 text-slate-400">{key.created}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${key.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                    {key.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors" title="Copy Key">
                                      <Copy size={13} />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors" title="Revoke Key" onClick={() => handleDeleteKey(key.id)}>
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Webhooks</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">Order Status Webhook</p>
                              <p className="text-xs text-slate-400">https://api.sahilindustries.com/webhooks/orders</p>
                            </div>
                            <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-green-500/10 text-green-400">Active</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">Enquiry Notification Webhook</p>
                              <p className="text-xs text-slate-400">https://api.sahilindustries.com/webhooks/enquiries</p>
                            </div>
                            <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-green-500/10 text-green-400">Active</span>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                          <Plus size={14} />
                          Add Webhook
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Advanced Settings */}
              {activeTab === "advanced" && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-safety/10 text-safety flex items-center justify-center">
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Advanced</h3>
                      <p className="text-sm text-slate-400">System configuration, maintenance, and developer options</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Maintenance Mode</h4>
                      <label className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50" />
                        <div>
                          <p className="font-semibold text-white">Enable Maintenance Mode</p>
                          <p className="text-xs text-slate-400">Restrict access to admin users only</p>
                        </div>
                      </label>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Data Management</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                          <Download size={20} className="text-safety" />
                          <div>
                            <p className="font-medium text-white">Export All Data</p>
                            <p className="text-xs text-slate-400">Download complete database backup</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                          <Upload size={20} className="text-blue-400" />
                          <div>
                            <p className="font-medium text-white">Import Data</p>
                            <p className="text-xs text-slate-400">Restore from backup file</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                          <Zap size={20} className="text-orange-400" />
                          <div>
                            <p className="font-medium text-white">Clear Cache</p>
                            <p className="text-xs text-slate-400">Clear application cache and temporary files</p>
                          </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-white/5 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors">
                          <Trash2 size={20} className="text-red-400" />
                          <div>
                            <p className="font-medium text-white">Purge Old Logs</p>
                            <p className="text-xs text-slate-400">Remove logs older than 90 days</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Danger Zone</h4>
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-red-400">Reset Application</p>
                            <p className="text-xs text-slate-400">This will delete all data and reset the application to initial state. This action cannot be undone.</p>
                          </div>
                          <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">Reset Application</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}