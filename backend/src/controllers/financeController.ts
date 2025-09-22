import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

const router = express.Router();

// Get financial overview/dashboard
router.get('/overview', async (req: Request, res: Response) => {
  try {
    // Calculate financial data from orders and other sources
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    // Get revenue from orders
    const orders = await Order.find({
      createdAt: { $gte: currentMonth }
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Mock expense calculation (would come from actual expense records)
    const totalExpenses = totalRevenue * 0.7; // Assuming 70% costs
    const netProfit = totalRevenue - totalExpenses;
    
    // Calculate growth (mock for now)
    const monthlyGrowth = 12.5;
    
    res.json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Finance overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get financial overview',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get monthly financial data
router.get('/monthly', async (req: Request, res: Response) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = await Promise.all(
      months.map(async (month, index) => {
        const startDate = new Date(currentYear, index, 1);
        const endDate = new Date(currentYear, index + 1, 0);
        
        const orders = await Order.find({
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        });
        
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);
        const expenses = revenue * 0.7; // Mock expense calculation
        const profit = revenue - expenses;
        
        return {
          month,
          revenue: Math.round(revenue),
          expenses: Math.round(expenses),
          profit: Math.round(profit)
        };
      })
    );
    
    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Monthly data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get monthly data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current month expenses breakdown
router.get('/expenses/current', async (req: Request, res: Response) => {
  try {
    // Mock expense breakdown (would come from actual expense records)
    const expenseBreakdown = [
      { category: 'Milk Purchase', amount: 125000.00, percentage: 62.8 },
      { category: 'Salaries', amount: 45750.50, percentage: 23.0 },
      { category: 'Additional Expenses', amount: 28000.00, percentage: 14.2 }
    ];
    
    res.json({
      success: true,
      data: expenseBreakdown
    });
  } catch (error) {
    console.error('Expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expense breakdown',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recent transactions
router.get('/transactions/recent', async (req: Request, res: Response) => {
  try {
    // Get recent orders as transactions
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name');
    
    const transactions = recentOrders.map((order, index) => ({
      id: order._id.toString(),
      description: `Product sales - Customer ${order._id.toString().slice(-6)}`,
      amount: order.total,
      date: order.createdAt.toISOString().split('T')[0],
      type: 'income' as const,
      category: 'Sales'
    }));
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Recent transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent transactions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;