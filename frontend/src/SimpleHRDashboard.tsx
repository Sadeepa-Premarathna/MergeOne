import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleHRDashboard: React.FC = () => {
  const navigate = useNavigate();

  const goBackToAdmin = () => {
    navigate('/admin');
  };

  const hrCards = [
    {
      title: 'Total Employees',
      value: '450',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'New Hires This Month',
      value: '12',
      icon: '👋',
      color: 'bg-green-500'
    },
    {
      title: 'Attendance Rate',
      value: '94.8%',
      icon: '📊',
      color: 'bg-purple-500'
    },
    {
      title: 'Payroll Status',
      value: 'Current',
      icon: '💰',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back button */}
      <div className="bg-white shadow-md p-4 border-b">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">HR Management Dashboard</h1>
          <button
            onClick={goBackToAdmin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </button>
        </div>
      </div>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* HR Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {hrCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                  </div>
                  <div className={`${card.color} text-white p-3 rounded-full text-2xl`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* HR Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Employee Records',
                description: 'Manage employee profiles and information',
                icon: '📋',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Attendance Tracking',
                description: 'Monitor employee attendance and time tracking',
                icon: '⏰',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Payroll Management',
                description: 'Process payroll and manage compensation',
                icon: '💰',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Leave Management',
                description: 'Handle leave requests and vacation tracking',
                icon: '🏖️',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                title: 'Performance Reviews',
                description: 'Conduct and track employee performance',
                icon: '⭐',
                color: 'from-red-500 to-red-600'
              },
              {
                title: 'HR Reports',
                description: 'Generate comprehensive HR analytics',
                icon: '📊',
                color: 'from-indigo-500 to-indigo-600'
              }
            ].map((module, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                <div className={`h-2 bg-gradient-to-r ${module.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{module.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="text-blue-600">ℹ️</div>
              <p className="text-blue-800">
                <strong>HR System Status:</strong> All modules are operational. Employee data and payroll processing are up to date.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleHRDashboard;