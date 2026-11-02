"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  status: "Active" | "Inactive" | "New";
  joined: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: string;
  stock: number;
  minStock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  description: string;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: string;
  status: "Delivered" | "In Progress" | "Pending" | "Shipped" | "Cancelled";
  date: string;
  priority: "high" | "medium" | "low";
}

export interface Enquiry {
  id: string;
  customer: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "New" | "In Progress" | "Replied" | "Closed";
  date: string;
  priority: "high" | "medium" | "low";
}

export interface AnalyticsData {
  kpis: {
    totalRevenue: string;
    totalOrders: number;
    activeCustomers: number;
    conversionRate: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
    conversion: number;
  }>;
  statusDistribution: Array<{
    label: string;
    count: number;
    percent: number;
  }>;
  productPerformance: Array<{
    name: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  customerSegments: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topCustomers: Array<{
    name: string;
    company: string;
    revenue: string;
    orders: number;
    growth: number;
  }>;
}

interface AdminDataContextType {
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // Enquiries
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, "id">) => void;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => void;
  deleteEnquiry: (id: string) => void;
  
  // Analytics
  analytics: AnalyticsData;
  
  // Settings
  settings: Record<string, string>;
  updateSettings: (settings: Record<string, string>) => void;
  
  // Loading states
  loading: boolean;
}

// Initial mock data
const initialCustomers: Customer[] = [
  { id: "CUST-001", name: "Rajesh Kumar", email: "rajesh@company.com", phone: "+91 98765 43210", company: "Kumar Industries", city: "Mumbai", state: "Maharashtra", totalOrders: 12, totalSpent: "₹45,20,000", lastOrder: "2024-01-15", status: "Active", joined: "2022-03-15" },
  { id: "CUST-002", name: "Priya Sharma", email: "priya@industries.in", phone: "+91 98765 43211", company: "Sharma Steel Works", city: "Pune", state: "Maharashtra", totalOrders: 8, totalSpent: "₹32,50,000", lastOrder: "2024-01-14", status: "Active", joined: "2021-11-20" },
  { id: "CUST-003", name: "Amit Patel", email: "amit@manufacturing.com", phone: "+91 98765 43212", company: "Patel Manufacturing", city: "Ahmedabad", state: "Gujarat", totalOrders: 5, totalSpent: "₹18,75,000", lastOrder: "2024-01-13", status: "Active", joined: "2023-02-10" },
  { id: "CUST-004", name: "Suresh Reddy", email: "suresh@engineering.co", phone: "+91 98765 43213", company: "Reddy Engineering", city: "Hyderabad", state: "Telangana", totalOrders: 3, totalSpent: "₹9,45,000", lastOrder: "2024-01-12", status: "Inactive", joined: "2023-06-05" },
  { id: "CUST-005", name: "Neha Singh", email: "neha@construction.in", phone: "+91 98765 43214", company: "Singh Construction", city: "Delhi", state: "Delhi", totalOrders: 7, totalSpent: "₹28,90,000", lastOrder: "2024-01-11", status: "Active", joined: "2022-08-22" },
  { id: "CUST-006", name: "Vikram Singh", email: "vikram@steelworks.com", phone: "+91 98765 43215", company: "Singh Steel Works", city: "Jamshedpur", state: "Jharkhand", totalOrders: 15, totalSpent: "₹67,80,000", lastOrder: "2024-01-10", status: "Active", joined: "2021-05-18" },
  { id: "CUST-007", name: "Anita Desai", email: "anita@powergen.in", phone: "+91 98765 43216", company: "Desai Power Gen", city: "Vadodara", state: "Gujarat", totalOrders: 4, totalSpent: "₹15,60,000", lastOrder: "2024-01-09", status: "Active", joined: "2023-01-30" },
  { id: "CUST-008", name: "Rohit Gupta", email: "rohit@infrabuild.com", phone: "+91 98765 43217", company: "Gupta Infra Build", city: "Bangalore", state: "Karnataka", totalOrders: 2, totalSpent: "₹5,20,000", lastOrder: "2024-01-08", status: "New", joined: "2023-12-01" },
  { id: "CUST-009", name: "Kavya Nair", email: "kavya@shipyard.in", phone: "+91 98765 43218", company: "Nair Shipyard", city: "Kochi", state: "Kerala", totalOrders: 9, totalSpent: "₹42,30,000", lastOrder: "2024-01-07", status: "Active", joined: "2022-04-12" },
  { id: "CUST-010", name: "Manoj Kumar", email: "manoj@cementworks.com", phone: "+91 98765 43219", company: "Kumar Cement", city: "Raipur", state: "Chhattisgarh", totalOrders: 1, totalSpent: "₹3,80,000", lastOrder: "2024-01-06", status: "Inactive", joined: "2023-09-25" },
];

const initialProducts: Product[] = [
  { id: "PRD-001", name: "Single Girder EOT Crane", category: "EOT Cranes", sku: "SG-EOT-001", price: "₹2,45,000", stock: 15, minStock: 5, status: "Active", description: "Heavy-duty single girder overhead crane for industrial applications", image: "products/single-girder-eot-crane.jpg" },
  { id: "PRD-002", name: "Double Girder EOT Crane", category: "EOT Cranes", sku: "DG-EOT-002", price: "₹4,80,000", stock: 8, minStock: 3, status: "Active", description: "High-capacity double girder crane for heavy manufacturing", image: "products/double-girder-eot-crane.jpg" },
  { id: "PRD-003", name: "Electric Wire Rope Hoist", category: "Hoists", sku: "EWRH-003", price: "₹85,000", stock: 25, minStock: 10, status: "Active", description: "Precision electric hoist for material handling operations", image: "products/electric-wire-rope-hoist.jpg" },
  { id: "PRD-004", name: "Goliath Gantry Crane", category: "Gantry Cranes", sku: "GGC-004", price: "₹12,50,000", stock: 3, minStock: 2, status: "Active", description: "Outdoor gantry crane for shipyard and construction sites", image: "products/goliath-gantry-crane.jpg" },
  { id: "PRD-005", name: "JIB Crane", category: "JIB Cranes", sku: "JIB-005", price: "₹1,20,000", stock: 12, minStock: 5, status: "Active", description: "Articulating jib crane for workshop and assembly lines", image: "products/jib-crane.jpg" },
  { id: "PRD-006", name: "Monorail Crane", category: "Monorail Systems", sku: "MRC-006", price: "₹6,75,000", stock: 6, minStock: 3, status: "Active", description: "Single-track monorail system for linear material transport", image: "products/monorail-crane.jpg" },
  { id: "PRD-007", name: "Underslung Crane", category: "Underslung Cranes", sku: "USC-007", price: "₹3,10,000", stock: 9, minStock: 4, status: "Active", description: "Under-running crane system for low headroom applications", image: "products/underslung-cranes.jpg" },
  { id: "PRD-008", name: "Electric Chain Hoist", category: "Hoists", sku: "ECH-008", price: "₹45,000", stock: 30, minStock: 15, status: "Active", description: "Compact electric chain hoist for light duty applications", image: "products/electric-wire-rope-hoist.jpg" },
  { id: "PRD-009", name: "Semi-Goliath Crane", category: "Gantry Cranes", sku: "SGC-009", price: "₹8,90,000", stock: 4, minStock: 2, status: "Low Stock", description: "Semi-gantry crane for medium duty outdoor applications", image: "products/goliath-gantry-crane.jpg" },
  { id: "PRD-010", name: "Wall Mounted JIB Crane", category: "JIB Cranes", sku: "WMJ-010", price: "₹95,000", stock: 0, minStock: 3, status: "Out of Stock", description: "Wall-mounted articulating jib crane for confined spaces", image: "products/jib-crane.jpg" },
];

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "Rajesh Kumar", email: "rajesh@company.com", product: "Single Girder EOT Crane", amount: "₹2,45,000", status: "Delivered", date: "2024-01-15", priority: "high" },
  { id: "ORD-002", customer: "Priya Sharma", email: "priya@industries.in", product: "Double Girder EOT Crane", amount: "₹4,80,000", status: "In Progress", date: "2024-01-14", priority: "high" },
  { id: "ORD-003", customer: "Amit Patel", email: "amit@manufacturing.com", product: "Electric Wire Rope Hoist", amount: "₹85,000", status: "Pending", date: "2024-01-13", priority: "medium" },
  { id: "ORD-004", customer: "Suresh Reddy", email: "suresh@engineering.co", product: "JIB Crane", amount: "₹1,20,000", status: "Delivered", date: "2024-01-12", priority: "low" },
  { id: "ORD-005", customer: "Neha Singh", email: "neha@construction.in", product: "Underslung Crane", amount: "₹3,10,000", status: "Shipped", date: "2024-01-11", priority: "medium" },
  { id: "ORD-006", customer: "Vikram Singh", email: "vikram@steelworks.com", product: "Goliath Gantry Crane", amount: "₹12,50,000", status: "In Progress", date: "2024-01-10", priority: "high" },
  { id: "ORD-007", customer: "Anita Desai", email: "anita@powergen.in", product: "Monorail Crane", amount: "₹6,75,000", status: "Pending", date: "2024-01-09", priority: "medium" },
  { id: "ORD-008", customer: "Rohit Gupta", email: "rohit@infrabuild.com", product: "JIB Crane", amount: "₹1,85,000", status: "Delivered", date: "2024-01-08", priority: "low" },
  { id: "ORD-009", customer: "Kavya Nair", email: "kavya@shipyard.in", product: "Double Girder EOT Crane", amount: "₹8,90,000", status: "Shipped", date: "2024-01-07", priority: "high" },
  { id: "ORD-010", customer: "Manoj Kumar", email: "manoj@cementworks.com", product: "Electric Wire Rope Hoist", amount: "₹95,000", status: "Cancelled", date: "2024-01-06", priority: "low" },
];

const initialEnquiries: Enquiry[] = [
  { id: "ENQ-001", customer: "Rajesh Kumar", email: "rajesh@company.com", phone: "+91 98765 43210", subject: "Single Girder EOT Crane Inquiry", message: "Need pricing for 10-ton capacity crane for our new facility", status: "New", date: "2024-01-15", priority: "high" },
  { id: "ENQ-002", customer: "Priya Sharma", email: "priya@industries.in", phone: "+91 98765 43211", subject: "Double Girder EOT Crane Quote", message: "Requesting quote for 20-ton double girder crane with 15m span", status: "In Progress", date: "2024-01-14", priority: "high" },
  { id: "ENQ-003", customer: "Amit Patel", email: "amit@manufacturing.com", phone: "+91 98765 43212", subject: "Electric Wire Rope Hoist", message: "Looking for 5-ton electric hoist for warehouse operations", status: "Replied", date: "2024-01-13", priority: "medium" },
  { id: "ENQ-004", customer: "Suresh Reddy", email: "suresh@engineering.co", phone: "+91 98765 43213", subject: "JIB Crane Specification", message: "Need technical specs for 3-ton articulating jib crane", status: "New", date: "2024-01-12", priority: "low" },
  { id: "ENQ-005", customer: "Neha Singh", email: "neha@construction.in", phone: "+91 98765 43214", subject: "Underslung Crane Quote", message: "Requesting quote for 2-ton underslung crane system", status: "Closed", date: "2024-01-11", priority: "medium" },
  { id: "ENQ-006", customer: "Vikram Singh", email: "vikram@steelworks.com", phone: "+91 98765 43215", subject: "Goliath Gantry Crane", message: "Need 50-ton gantry crane for shipyard project", status: "In Progress", date: "2024-01-10", priority: "high" },
  { id: "ENQ-007", customer: "Anita Desai", email: "anita@powergen.in", phone: "+91 98765 43216", subject: "Monorail Crane System", message: "Looking for monorail system for production line", status: "Replied", date: "2024-01-09", priority: "medium" },
  { id: "ENQ-008", customer: "Rohit Gupta", email: "rohit@infrabuild.com", phone: "+91 98765 43217", subject: "Custom Crane Solution", message: "Need custom crane for specialized application", status: "New", date: "2024-01-08", priority: "high" },
];

const initialAnalytics: AnalyticsData = {
  kpis: {
    totalRevenue: "₹2.84Cr",
    totalOrders: 1247,
    activeCustomers: 436,
    conversionRate: 3.42,
  },
  revenueData: [
    { month: "Jan", revenue: 48.5, orders: 124, customers: 45, conversion: 3.2 },
    { month: "Feb", revenue: 52.3, orders: 138, customers: 52, conversion: 3.5 },
    { month: "Mar", revenue: 45.8, orders: 112, customers: 38, conversion: 2.9 },
    { month: "Apr", revenue: 61.2, orders: 156, customers: 61, conversion: 3.8 },
    { month: "May", revenue: 55.7, orders: 142, customers: 55, conversion: 3.4 },
    { month: "Jun", revenue: 68.9, orders: 178, customers: 68, conversion: 4.1 },
  ],
  statusDistribution: [
    { label: "Delivered", count: 847, percent: 68 },
    { label: "In Progress", count: 234, percent: 19 },
    { label: "Pending", count: 112, percent: 9 },
    { label: "Shipped", count: 54, percent: 4 },
  ],
  productPerformance: [
    { name: "Single Girder EOT Crane", revenue: 18.5, orders: 45, growth: 12 },
    { name: "Double Girder EOT Crane", revenue: 15.2, orders: 28, growth: 8 },
    { name: "Electric Wire Rope Hoist", revenue: 8.7, orders: 62, growth: 15 },
    { name: "Goliath Gantry Crane", revenue: 12.3, orders: 18, growth: 5 },
    { name: "JIB Crane", revenue: 5.8, orders: 32, growth: 18 },
    { name: "Monorail Crane", revenue: 4.2, orders: 15, growth: -3 },
    { name: "Underslung Crane", revenue: 3.5, orders: 22, growth: 9 },
  ],
  customerSegments: [
    { name: "Enterprise", value: 45, color: "bg-blue-500" },
    { name: "SME", value: 35, color: "bg-green-500" },
    { name: "Government", value: 12, color: "bg-purple-500" },
    { name: "Individual", value: 8, color: "bg-yellow-500" },
  ],
  topCustomers: [
    { name: "Vikram Singh", company: "Singh Steel Works", revenue: "₹67.8L", orders: 15, growth: 22 },
    { name: "Kavya Nair", company: "Nair Shipyard", revenue: "₹42.3L", orders: 9, growth: 15 },
    { name: "Rajesh Kumar", company: "Kumar Industries", revenue: "₹45.2L", orders: 12, growth: 8 },
    { name: "Priya Sharma", company: "Sharma Steel Works", revenue: "₹32.5L", orders: 8, growth: 12 },
    { name: "Neha Singh", company: "Singh Construction", revenue: "₹28.9L", orders: 7, growth: 5 },
  ],
};

const initialSettings: Record<string, string> = {
  appName: "Sahil Industries Admin",
  companyName: "Sahil Industries",
  supportEmail: "sahilcranes@gmail.com",
  supportPhone: "+91 96 2324 2324",
  language: "en",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  currency: "INR",
  theme: "dark",
  sidebarCollapsed: "false",
  compactMode: "false",
  animationsEnabled: "true",
  emailNotifications: "true",
  pushNotifications: "true",
  orderUpdates: "true",
  enquiryAlerts: "true",
  stockAlerts: "true",
  weeklyReports: "false",
  twoFactorEnabled: "false",
  sessionTimeout: "30",
  passwordExpiry: "90",
  loginAlerts: "true",
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_customers");
      if (stored) return JSON.parse(stored);
    }
    return initialCustomers;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_products");
      if (stored) return JSON.parse(stored);
    }
    return initialProducts;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_orders");
      if (stored) return JSON.parse(stored);
    }
    return initialOrders;
  });
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_enquiries");
      if (stored) return JSON.parse(stored);
    }
    return initialEnquiries;
  });
  
  const [analytics] = useState<AnalyticsData>(initialAnalytics);
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_settings");
      if (stored) return JSON.parse(stored);
    }
    return initialSettings;
  });
  
  const [loading, setLoading] = useState(false);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("admin_customers", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("admin_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("admin_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("admin_enquiries", JSON.stringify(enquiries)); }, [enquiries]);
  useEffect(() => { localStorage.setItem("admin_settings", JSON.stringify(settings)); }, [settings]);

  // Customer CRUD
  const addCustomer = useCallback((customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
    };
    setCustomers(prev => [newCustomer, ...prev]);
  }, [customers.length]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  // Product CRUD
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  }, [products.length]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Order CRUD
  const addOrder = useCallback((order: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
    };
    setOrders(prev => [newOrder, ...prev]);
  }, [orders.length]);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  // Enquiry CRUD
  const addEnquiry = useCallback((enquiry: Omit<Enquiry, "id">) => {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `ENQ-${String(enquiries.length + 1).padStart(3, "0")}`,
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
  }, [enquiries.length]);

  const updateEnquiry = useCallback((id: string, updates: Partial<Enquiry>) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEnquiry = useCallback((id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Record<string, string>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AdminDataContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrder,
      deleteOrder,
      enquiries,
      addEnquiry,
      updateEnquiry,
      deleteEnquiry,
      analytics,
      settings,
      updateSettings,
      loading,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}