import apiCall, { apiGet } from './apiService';
import { Expense, CreateExpenseRequest } from '../types/expense';

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    return apiGet<Expense[]>('/finance/additional-expenses', [
      { id: 'e1', category: 'Utilities', description: 'Electricity bill', date: new Date().toISOString(), amount: 25000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]);
  },
  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    try {
      return await apiCall<Expense>('/finance/additional-expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
      });
    } catch (e) {
      return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), category: expense.category || 'Other', description: expense.description || '', date: expense.date || new Date().toISOString(), amount: Number(expense.amount) || 0 } as Expense;
    }
  },
  async updateExpense(expense: Expense): Promise<Expense> {
    try {
      return await apiCall<Expense>(`/finance/additional-expenses/${expense.id}`, {
        method: 'PUT',
        body: JSON.stringify(expense),
      });
    } catch (e) {
      return expense;
    }
  },
  async deleteExpense(id: string): Promise<void> {
    try {
      await apiCall<void>(`/finance/additional-expenses/${id}`, { method: 'DELETE' });
    } catch {
      // no-op fallback
    }
  },
};