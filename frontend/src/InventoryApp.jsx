import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/InventoryComponents/InventoryAppLayoutFixed.jsx";
import AdminDashboard from "./pages/InventoryPages/InventoryAdminDashboard.jsx";
import Dashboard from "./pages/InventoryPages/InventoryDashboard.jsx";
import Products from "./pages/InventoryPages/InventoryProducts.jsx";
import Inventory from "./pages/InventoryPages/InventoryInventory.jsx";
import RawMaterials from "./pages/InventoryPages/InventoryRawMaterials.jsx";
import FinanceApp from "./Finance_App.tsx";
import HRApp from "./HRApp.tsx";
import Users from "./pages/InventoryPages/InventoryUsers.jsx";
import Reports from "./pages/InventoryPages/InventoryReports.jsx";
import Orders from "./pages/InventoryPages/InventoryOrders.jsx";
import Delivery from "./pages/InventoryPages/InventoryDelivery";

export default function InventoryAppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/app/*" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="orders" element={<Orders />} />
        <Route path="delivery" element={<Delivery />} />
        {/* Fallback to dashboard for unknown routes under /app */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/app/finance" element={<FinanceApp />} />
      <Route path="/app/hr" element={<HRApp />} />
    </Routes>
  );
}