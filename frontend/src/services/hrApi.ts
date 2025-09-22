import apiCall from './apiService';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hoursWorked?: number;
}

export interface DashboardData {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  newHires: number;
  avgSalary: number;
  departments: { name: string; count: number }[];
  recentActivities: { id: string; type: string; description: string; timestamp: string }[];
}

// HR API endpoints
export const hrApi = {
  // Get HR dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const data = await apiCall<DashboardData>('/hr/dashboard');
      return data;
    } catch (error) {
      console.warn('Using fallback HR dashboard data due to API error:', error);
      return {
        totalEmployees: 45,
        presentToday: 42,
        onLeave: 2,
        newHires: 3,
        avgSalary: 45000,
        departments: [
          { name: 'Production', count: 18 },
          { name: 'Quality Control', count: 8 },
          { name: 'Administration', count: 6 },
          { name: 'Sales & Marketing', count: 7 },
          { name: 'Maintenance', count: 6 }
        ],
        recentActivities: [
          { id: '1', type: 'New Hire', description: 'John Doe joined as Production Supervisor', timestamp: '2025-01-15T10:30:00Z' },
          { id: '2', type: 'Leave', description: 'Jane Smith applied for sick leave', timestamp: '2025-01-15T09:15:00Z' },
          { id: '3', type: 'Promotion', description: 'Mike Johnson promoted to Quality Manager', timestamp: '2025-01-14T16:45:00Z' }
        ]
      };
    }
  },

  // Get employee records
  getEmployeeRecords: async (): Promise<Employee[]> => {
    try {
      const data = await apiCall<Employee[]>('/hr/employees');
      return data;
    } catch (error) {
      console.warn('Using fallback employee data due to API error:', error);
      return [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@dairylicious.com',
          department: 'Production',
          role: 'Production Manager',
          salary: 55000,
          joinDate: '2023-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@dairylicious.com',
          department: 'Quality Control',
          role: 'Quality Analyst',
          salary: 48000,
          joinDate: '2023-03-22',
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike.davis@dairylicious.com',
          department: 'Administration',
          role: 'HR Specialist',
          salary: 52000,
          joinDate: '2022-11-10',
          status: 'active'
        }
      ];
    }
  },

  // Get attendance records
  getAttendanceRecords: async (): Promise<AttendanceRecord[]> => {
    try {
      const data = await apiCall<AttendanceRecord[]>('/hr/attendance');
      return data;
    } catch (error) {
      console.warn('Using fallback attendance data due to API error:', error);
      return [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'John Smith',
          date: '2025-01-15',
          checkIn: '08:00',
          checkOut: '17:00',
          status: 'present',
          hoursWorked: 9
        },
        {
          id: '2',
          employeeId: '2',
          employeeName: 'Sarah Johnson',
          date: '2025-01-15',
          checkIn: '08:15',
          checkOut: '17:00',
          status: 'late',
          hoursWorked: 8.75
        },
        {
          id: '3',
          employeeId: '3',
          employeeName: 'Mike Davis',
          date: '2025-01-15',
          checkIn: '08:00',
          checkOut: '13:00',
          status: 'half-day',
          hoursWorked: 5
        }
      ];
    }
  },

  // Add employee
  addEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    try {
      const data = await apiCall<Employee>('/hr/employees', {
        method: 'POST',
        body: JSON.stringify(employee)
      });
      return data;
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    try {
      const data = await apiCall<Employee>(`/hr/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employee)
      });
      return data;
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    try {
      await apiCall<void>(`/hr/employees/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  }
};

export default hrApi;