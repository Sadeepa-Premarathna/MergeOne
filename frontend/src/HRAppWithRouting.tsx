import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/HR/Sidebar';
import TopNavigation from './components/HR/TopNavigation';
import HRDashboard from './pages/HR/HRDashboard';
import EmployeeRecords from './pages/HR/HREmployeeRecords';
import AttendanceTracking from './pages/HR/HRAttendanceTracking';
import PayrollManagement from './pages/HR/HRPayrollManagement';
import Reports from './pages/HR/HRReports';
import LeaveManagement from './pages/HR/HRLeaveManagement';
import { hrApi } from './services/hrApi';

const HRAppWithRouting: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active item from current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/employees')) return 'employees';
    if (path.includes('/attendance')) return 'attendance';
    if (path.includes('/payroll')) return 'payroll';
    if (path.includes('/leave')) return 'leave';
    if (path.includes('/reports')) return 'reports';
    return 'dashboard';
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashData, empData, attData] = await Promise.all([
          hrApi.getDashboardData(),
          hrApi.getEmployeeRecords(),
          hrApi.getAttendanceRecords()
        ]);
        
        setDashboardData(dashData);
        setEmployees(empData);
        setAttendanceRecords(attData);
      } catch (error) {
        console.error('Failed to load HR data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigation = (itemId: string) => {
    const routeMap = {
      'dashboard': '/app/hr',
      'employees': '/app/hr/employees',
      'attendance': '/app/hr/attendance',
      'payroll': '/app/hr/payroll',
      'leave': '/app/hr/leave',
      'reports': '/app/hr/reports'
    };
    
    const route = routeMap[itemId as keyof typeof routeMap];
    if (route) {
      navigate(route);
    }
  };

  const handleEmployeeUpdate = (employee: any) => {
    console.log('Employee updated:', employee);
    // Handle employee update logic here
  };

  const handleEmployeeCreate = (employee: any) => {
    console.log('Employee created:', employee);
    // Handle employee creation logic here
  };

  const handleEmployeeDelete = (employeeId: string) => {
    console.log('Employee deleted:', employeeId);
    // Handle employee deletion logic here
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <Routes>
        <Route 
          path="/" 
          element={<HRDashboard />} 
        />
        <Route 
          path="/employees" 
          element={<EmployeeRecords />} 
        />
        <Route 
          path="/attendance" 
          element={<AttendanceTracking />} 
        />
        <Route 
          path="/payroll" 
          element={<PayrollManagement />} 
        />
        <Route 
          path="/leave" 
          element={<LeaveManagement />} 
        />
        <Route 
          path="/reports" 
          element={<Reports />} 
        />
        {/* Default fallback to dashboard */}
        <Route 
          path="*" 
          element={<HRDashboard />} 
        />
      </Routes>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeItem={getActiveItem()}
        onItemClick={handleNavigation}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userName="HR Manager"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRAppWithRouting;