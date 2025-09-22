import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/FinanceComponents/Sidebar';
import Header from './components/FinanceComponents/Header';
import Dashboard from './components/FinanceComponents/Dashboard';
import PayrollDashboard from './components/FinanceComponents/PayrollDashboard';
import RevenueExpenseTracker from './components/FinanceComponents/finance_RevenueExpenseTracker';
import AdditionalExpenses from './components/FinanceComponents/finance_AdditionalExpenses';
import ReportGeneration from './components/FinanceComponents/ReportGeneration';
import AllowanceManager from './components/FinanceComponents/AllowanceManager';

function FinanceAppWithRouting() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const financeManagerName = 'Sarah Johnson'; // This would come from authentication context

  // Determine active nav item from current route
  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path.includes('/calculate-salary')) return 'calculate-salary';
    if (path.includes('/allowance-management')) return 'allowance-management';
    if (path.includes('/revenue-expenses')) return 'revenue-expenses';
    if (path.includes('/additional-expenses')) return 'additional-expenses';
    if (path.includes('/reports')) return 'reports';
    return 'dashboard';
  };

  const handleNavItemClick = (itemId: string) => {
    setSidebarOpen(false); // Close sidebar on mobile after navigation
    
    // Navigate to the appropriate route
    const routeMap = {
      'dashboard': '/app/finance',
      'calculate-salary': '/app/finance/calculate-salary',
      'allowance-management': '/app/finance/allowance-management',
      'revenue-expenses': '/app/finance/revenue-expenses',
      'additional-expenses': '/app/finance/additional-expenses',
      'reports': '/app/finance/reports'
    };
    
    const route = routeMap[itemId as keyof typeof routeMap];
    if (route) {
      navigate(route);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar 
        activeItem={getActiveNavItem()} 
        onItemClick={handleNavItemClick}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <Header 
        userName={financeManagerName} 
        onToggleSidebar={toggleSidebar}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculate-salary" element={<PayrollDashboard />} />
          <Route path="/allowance-management" element={<AllowanceManager />} />
          <Route path="/revenue-expenses" element={<RevenueExpenseTracker />} />
          <Route path="/additional-expenses" element={<AdditionalExpenses />} />
          <Route path="/reports" element={<ReportGeneration />} />
          {/* Default fallback to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default FinanceAppWithRouting;