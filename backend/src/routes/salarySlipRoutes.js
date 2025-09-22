import express from 'express';
import { 
  generateSalarySlip, 
  getSalarySlipById, 
  getAllSalarySlips, 
  updatePaymentStatus,
  getAvailableEmployees
} from '../Controllers/salarySlipController.js';

const router = express.Router();

// GET /api/salary-slip/employees - Get all available employees
router.get('/employees', getAvailableEmployees);

// GET /api/salary-slip/:employeeId?month=YYYY-MM - Generate/Get salary slip
router.get('/:employeeId', generateSalarySlip);

// GET /api/salary-slip - Get all salary slips with optional filters
router.get('/', getAllSalarySlips);

// GET /api/salary-slip/id/:id - Get salary slip by ID
router.get('/id/:id', getSalarySlipById);

// PUT /api/salary-slip/:id/status - Update payment status
router.put('/:id/status', updatePaymentStatus);

export default router;
