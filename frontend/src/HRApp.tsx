import React, { useState, useEffect } from 'react';
import Sidebar from './components/HR/Sidebar';
import TopNavigation from './components/HR/TopNavigation';
import HRDashboard from './pages/HR/HRDashboard';
import EmployeeRecords from './pages/HR/HREmployeeRecords';
import AttendanceTracking from './pages/HR/HRAttendanceTracking';
import PayrollManagement from './pages/HR/HRPayrollManagement';
import Reports from './pages/HR/HRReports';
import LeaveManagement from './pages/HR/HRLeaveManagement';
import { hrApi } from './services/hrApi';

const HRApp: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAttendanceUpdate = (attendance: any) => {
    console.log('Attendance updated:', attendance);
    // Handle attendance update logic here
  };

  const handlePayrollUpdate = (payroll: any) => {
    console.log('Payroll updated:', payroll);
    // Handle payroll update logic here
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <HRDashboard data={dashboardData} />;
      case 'employees':
        return (
          <EmployeeRecords 
            employees={employees}
            onEmployeeUpdate={handleEmployeeUpdate}
            onEmployeeCreate={handleEmployeeCreate}
            onEmployeeDelete={handleEmployeeDelete}
          />
        );
      case 'attendance':
        return (
          <AttendanceTracking 
            employees={employees}
            attendanceRecords={attendanceRecords}
            onAttendanceUpdate={handleAttendanceUpdate}
          />
        );
      case 'payroll':
        return (
          <PayrollManagement 
            employees={employees}
            attendanceRecords={attendanceRecords}
            onPayrollUpdate={handlePayrollUpdate}
          />
        );
      case 'reports':
        return <Reports />;
      case 'leaves':
        return <LeaveManagement />;
      default:
        return <HRDashboard data={dashboardData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <Sidebar 
          activeItem={activeItem} 
          onItemClick={setActiveItem} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation 
          managerName="Admin"
          notificationCount={3}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRApp;