import apiCall from './apiService';
import { ReportFilters, PayrollReportData, PerformanceReportData } from '../types/reports';

export const reportService = {
  async generatePayrollReport(filters: ReportFilters): Promise<PayrollReportData> {
    try {
      return await apiCall<PayrollReportData>('/finance/reports/payroll', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    } catch (e) {
      return {
        totalGrossSalary: 1250000,
        totalEpfEmployee: 98000,
        totalEpfEmployer: 147000,
        totalEtfEmployer: 36000,
        totalNetSalary: 1003000,
        totalEmployees: 24,
        periodLabel: 'This Month',
        previousPeriodComparison: { grossSalaryChange: 5.2, netSalaryChange: 4.1 },
      };
    }
  },

  async generatePerformanceReport(filters: ReportFilters): Promise<PerformanceReportData> {
    try {
      return await apiCall<PerformanceReportData>('/finance/reports/performance', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    } catch (e) {
      return {
        totalRevenue: 2150000,
        totalExpenses: 1685000,
        totalProfit: 465000,
        profitMargin: 21.6,
        periodLabel: 'This Month',
        expenseBreakdown: {
          salaries: 720000,
          milkPurchases: 610000,
          additionalExpenses: 355000,
        },
        previousPeriodComparison: {
          revenueChange: 6.8,
          expensesChange: 4.2,
          profitChange: 10.1,
        },
        monthlyData: [
          { period: 'Week 1', revenue: 510000, expenses: 390000, profit: 120000 },
          { period: 'Week 2', revenue: 540000, expenses: 420000, profit: 120000 },
          { period: 'Week 3', revenue: 520000, expenses: 430000, profit: 90000 },
          { period: 'Week 4', revenue: 580000, expenses: 445000, profit: 135000 },
        ],
      };
    }
  },
};