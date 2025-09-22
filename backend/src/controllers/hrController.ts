import express, { Request, Response } from 'express';

const router = express.Router();

// Mock data for HR system (would come from Employee model)
const mockEmployees = [
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

// Get HR dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const dashboardData = {
      totalEmployees: mockEmployees.length,
      presentToday: mockEmployees.length - 1,
      onLeave: 1,
      newHires: 2,
      avgSalary: Math.round(mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length),
      departments: [
        { name: 'Production', count: 18 },
        { name: 'Quality Control', count: 8 },
        { name: 'Administration', count: 6 },
        { name: 'Sales & Marketing', count: 7 },
        { name: 'Maintenance', count: 6 }
      ],
      recentActivities: [
        { id: '1', type: 'New Hire', description: 'John Doe joined as Production Supervisor', timestamp: new Date().toISOString() },
        { id: '2', type: 'Leave', description: 'Jane Smith applied for sick leave', timestamp: new Date().toISOString() },
        { id: '3', type: 'Promotion', description: 'Mike Johnson promoted to Quality Manager', timestamp: new Date().toISOString() }
      ]
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('HR dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get HR dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all employees
router.get('/employees', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockEmployees
    });
  } catch (error) {
    console.error('Employee list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get employees',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get attendance records
router.get('/attendance', async (req: Request, res: Response) => {
  try {
    const attendanceRecords = mockEmployees.map((emp, index) => ({
      id: (index + 1).toString(),
      employeeId: emp.id,
      employeeName: emp.name,
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:00',
      checkOut: index === 0 ? '17:00' : index === 1 ? '17:00' : '13:00',
      status: index === 0 ? 'present' : index === 1 ? 'late' : 'half-day',
      hoursWorked: index === 0 ? 9 : index === 1 ? 8.75 : 5
    }));
    
    res.json({
      success: true,
      data: attendanceRecords
    });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance records',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add new employee
router.post('/employees', async (req: Request, res: Response) => {
  try {
    const newEmployee = {
      id: (mockEmployees.length + 1).toString(),
      ...req.body
    };
    
    mockEmployees.push(newEmployee);
    
    res.status(201).json({
      success: true,
      data: newEmployee,
      message: 'Employee added successfully'
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update employee
router.put('/employees/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    mockEmployees[employeeIndex] = { ...mockEmployees[employeeIndex], ...req.body };
    
    res.json({
      success: true,
      data: mockEmployees[employeeIndex],
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete employee
router.delete('/employees/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    mockEmployees.splice(employeeIndex, 1);
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;