import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimpleHRDashboard from './SimpleHRDashboard';

const SimpleHRApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route path="/" element={<SimpleHRDashboard />} />
          <Route path="/*" element={<SimpleHRDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default SimpleHRApp;