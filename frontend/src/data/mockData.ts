import { FinancialData, MonthlyData, ExpenseBreakdown, Transaction } from '../types';

// Simulating data that would come from other components in the system
export const getFinancialOverview = (): FinancialData => {
  // This would normally come from various components:
  // - Total Revenue from Inventory Manager
  // - Expenses from HR, Collection, and Finance components
  return {
    totalRevenue: 287500.00,
    totalExpenses: 198750.50,
    netProfit: 88749.50,
    monthlyGrowth: 12.5
  };
};

export const getMonthlyData = (): MonthlyData[] => {
  // This would come from monthly data stored by various components
  return [
    { month: 'Jan', revenue: 245000, expenses: 180000, profit: 65000 },
    { month: 'Feb', revenue: 267000, expenses: 195000, profit: 72000 },
    { month: 'Mar', revenue: 289000, expenses: 201000, profit: 88000 },
    { month: 'Apr', revenue: 301000, expenses: 215000, profit: 86000 },
    { month: 'May', revenue: 278000, expenses: 198000, profit: 80000 },
    { month: 'Jun', revenue: 312000, expenses: 225000, profit: 87000 },
    { month: 'Jul', revenue: 295000, expenses: 208000, profit: 87000 },
    { month: 'Aug', revenue: 287500, expenses: 198750, profit: 88750 },
    { month: 'Sep', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Oct', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Nov', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Dec', revenue: 0, expenses: 0, profit: 0 }
  ];
};

export const getCurrentMonthExpenses = (): ExpenseBreakdown[] => {
  // This would come from:
  // - HR Manager component (salaries)
  // - Collection & Distribution Manager (milk purchase)
  // - Finance Manager additional expenses form
  return [
    { category: 'Milk Purchase', amount: 125000.00, percentage: 62.8 },
    { category: 'Salaries', amount: 45750.50, percentage: 23.0 },
    { category: 'Additional Expenses', amount: 28000.00, percentage: 14.2 }
  ];
};

export const getRecentTransactions = (): Transaction[] => {
  // This would come from the Inventory Manager/Sales system
  return [
    {
      id: '1',
      description: 'Product sales - SuperMart Ltd.',
      amount: 15750.00,
      date: '2025-01-15',
      type: 'income',
      category: 'Sales'
    },
    {
      id: '2',
      description: 'Milk collection - FreshMilk Co.',
      amount: 28900.00,
      date: '2025-01-14',
      type: 'expense',
      category: 'Raw Materials'
    },
    {
      id: '3',
      description: 'Product sales - Dairy Delights Inc.',
      amount: 12300.00,
      date: '2025-01-13',
      type: 'income',
      category: 'Sales'
    },
    {
      id: '4',
      description: 'Equipment purchase - Pure Valley Foods',
      amount: 31200.00,
      date: '2025-01-12',
      type: 'expense',
      category: 'Equipment'
    },
    {
      id: '5',
      description: 'Product sales - Golden Dairy Ltd.',
      amount: 22450.00,
      date: '2025-01-11',
      type: 'income',
      category: 'Sales'
    }
  ];
};

// Employee interface for mockData compatibility
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