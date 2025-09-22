import EmployeeSalarySlip from '../models/EmployeeSalarySlip.js';
import Allowance from '../models/AllowanceModel.js';

// Mock payroll data with multiple employees using EMP001 format
const getMockPayrollData = (employeeId, month) => {
  const mockPayrollRecords = {
    'EMP001': {
      employeeId: 'EMP001',
      employeeName: 'John Anderson',
      basicSalary: 75000,
      overtimeAmount: 12500,
      noPayDeductionAmount: 2500
    },
    'EMP002': {
      employeeId: 'EMP002',
      employeeName: 'Sarah Mitchell',
      basicSalary: 85000,
      overtimeAmount: 15000,
      noPayDeductionAmount: 3000
    },
    'EMP003': {
      employeeId: 'EMP003',
      employeeName: 'Michael Chen',
      basicSalary: 65000,
      overtimeAmount: 8000,
      noPayDeductionAmount: 1500
    },
    'EMP004': {
      employeeId: 'EMP004',
      employeeName: 'Emma Thompson',
      basicSalary: 95000,
      overtimeAmount: 18000,
      noPayDeductionAmount: 4000
    },
    'EMP005': {
      employeeId: 'EMP005',
      employeeName: 'Robert Wilson',
      basicSalary: 70000,
      overtimeAmount: 10000,
      noPayDeductionAmount: 2000
    },
    'EMP006': {
      employeeId: 'EMP006',
      employeeName: 'Lisa Garcia',
      basicSalary: 80000,
      overtimeAmount: 14000,
      noPayDeductionAmount: 2800
    },
    'EMP007': {
      employeeId: 'EMP007',
      employeeName: 'David Brown',
      basicSalary: 60000,
      overtimeAmount: 7500,
      noPayDeductionAmount: 1200
    },
    'EMP008': {
      employeeId: 'EMP008',
      employeeName: 'Jennifer Lee',
      basicSalary: 90000,
      overtimeAmount: 16500,
      noPayDeductionAmount: 3500
    }
  };

  const payrollData = mockPayrollRecords[employeeId];
  if (!payrollData) {
    throw new Error(`Employee ${employeeId} not found in payroll records`);
  }

  return {
    ...payrollData,
    month
  };
};

// Generate salary slip for a specific employee and month
const generateSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month } = req.query;

    // Validate required parameters
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required (format: YYYY-MM)" });
    }

    // Check if salary slip already exists for this employee and month
    const existingSlip = await EmployeeSalarySlip.findOne({ 
      employeeId, 
      month 
    });

    if (existingSlip) {
      return res.status(200).json(existingSlip);
    }

    // Get mock payroll data for the employee
    const payrollData = getMockPayrollData(employeeId, month);

    // Fetch allowances for the employee and month
    const allowances = await Allowance.find({ 
      employeeId, 
      month 
    });

    // Calculate total allowances
    const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

    // Calculate EPF and ETF contributions
    const epfEmployeeContribution = Math.round(payrollData.basicSalary * 0.08);
    const epfEmployerContribution = Math.round(payrollData.basicSalary * 0.12);
    const etfEmployerContribution = Math.round(payrollData.basicSalary * 0.03);

    // Calculate gross salary
    const grossSalary = payrollData.basicSalary + payrollData.overtimeAmount + totalAllowances;

    // Calculate total deductions
    const totalDeductions = payrollData.noPayDeductionAmount + epfEmployeeContribution;

    // Calculate net salary
    const netSalary = grossSalary - totalDeductions;

    // Generate unique salary slip ID
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const salarySlipId = `SLIP${year}-${employeeId}-${monthNum}${day}`;

    // Create salary slip record
    const salarySlip = await EmployeeSalarySlip.create({
      salarySlipId,
      employeeId,
      month,
      basicSalary: payrollData.basicSalary,
      otAmount: payrollData.overtimeAmount,
      totalAllowances,
      totalDeductions,
      epfEmployeeContribution,
      epfEmployerContribution,
      etfEmployerContribution,
      grossSalary,
      netSalary,
      paymentStatus: 'Pending',
      createdBy: null
    });

    return res.status(201).json(salarySlip);

  } catch (error) {
    console.error("Error generating salary slip:", error);
    return res.status(500).json({ 
      message: "Server error while generating salary slip",
      error: error.message 
    });
  }
};

// Get salary slip by ID
const getSalarySlipById = async (req, res) => {
  try {
    const { id } = req.params;
    const salarySlip = await EmployeeSalarySlip.findById(id);
    
    if (!salarySlip) {
      return res.status(404).json({ message: "Salary slip not found" });
    }

    return res.status(200).json(salarySlip);
  } catch (error) {
    console.error("Error fetching salary slip:", error);
    return res.status(500).json({ message: "Server error while fetching salary slip" });
  }
};

// Get all salary slips with optional filters
const getAllSalarySlips = async (req, res) => {
  try {
    const { employeeId, month, paymentStatus } = req.query;
    const filter = {};

    if (employeeId) {
      filter.employeeId = employeeId;
    }

    if (month) {
      filter.month = month;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const salarySlips = await EmployeeSalarySlip.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(salarySlips);
  } catch (error) {
    console.error("Error fetching salary slips:", error);
    return res.status(500).json({ message: "Server error while fetching salary slips" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Pending', 'Paid', 'Failed'].includes(paymentStatus)) {
      return res.status(400).json({ 
        message: "Valid payment status is required (Pending, Paid, Failed)" 
      });
    }

    const updatedSlip = await EmployeeSalarySlip.findByIdAndUpdate(
      id, 
      { paymentStatus }, 
      { new: true }
    );

    if (!updatedSlip) {
      return res.status(404).json({ message: "Salary slip not found" });
    }

    return res.status(200).json(updatedSlip);
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Server error while updating payment status" });
  }
};

// Get all available employees from mock payroll data
const getAvailableEmployees = async (req, res) => {
  try {
    const employees = [
      { employeeId: 'EMP001', employeeName: 'John Anderson' },
      { employeeId: 'EMP002', employeeName: 'Sarah Mitchell' },
      { employeeId: 'EMP003', employeeName: 'Michael Chen' },
      { employeeId: 'EMP004', employeeName: 'Emma Thompson' },
      { employeeId: 'EMP005', employeeName: 'Robert Wilson' },
      { employeeId: 'EMP006', employeeName: 'Lisa Garcia' },
      { employeeId: 'EMP007', employeeName: 'David Brown' },
      { employeeId: 'EMP008', employeeName: 'Jennifer Lee' }
    ];

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching available employees:", error);
    return res.status(500).json({ message: "Server error while fetching employees" });
  }
};

export { 
  generateSalarySlip, 
  getSalarySlipById, 
  getAllSalarySlips, 
  updatePaymentStatus,
  getAvailableEmployees
};
