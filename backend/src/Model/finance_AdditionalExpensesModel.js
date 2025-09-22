import mongoose from 'mongoose';

const additionalExpensesSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['office-supplies', 'utilities', 'maintenance', 'transportation', 'marketing', 'legal', 'insurance', 'equipment', 'software', 'training', 'travel', 'miscellaneous']
  },
  subcategory: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  vendor: {
    name: String,
    contact: String,
    email: String,
    address: String
  },
  receipt: {
    filename: String,
    url: String,
    uploadDate: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'check', 'petty-cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  paidDate: {
    type: Date
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  department: {
    type: String,
    enum: ['admin', 'operations', 'sales', 'marketing', 'hr', 'finance', 'it', 'general']
  },
  project: {
    name: String,
    code: String
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextDueDate: Date
  },
  taxInfo: {
    taxable: {
      type: Boolean,
      default: true
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    taxAmount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  tags: [String],
  notes: {
    type: String,
    default: ''
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: Date,
    type: String
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budgetAllocation: {
    budgetId: String,
    budgetName: String,
    allocated: Number,
    remaining: Number
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
additionalExpensesSchema.index({ expenseId: 1 });
additionalExpensesSchema.index({ category: 1 });
additionalExpensesSchema.index({ date: -1 });
additionalExpensesSchema.index({ paymentStatus: 1 });
additionalExpensesSchema.index({ approvalStatus: 1 });
additionalExpensesSchema.index({ department: 1 });
additionalExpensesSchema.index({ submittedBy: 1 });
additionalExpensesSchema.index({ dueDate: 1 });

// Virtual for total amount including tax
additionalExpensesSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.taxInfo.taxAmount || 0);
});

// Virtual for overdue status
additionalExpensesSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.paymentStatus === 'pending';
});

// Virtual for days until due
additionalExpensesSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to approve expense
additionalExpensesSchema.methods.approve = function(approvedBy) {
  this.approvalStatus = 'approved';
  this.approvedBy = approvedBy;
  this.approvalDate = new Date();
  return this.save();
};

// Method to reject expense
additionalExpensesSchema.methods.reject = function() {
  this.approvalStatus = 'rejected';
  this.approvalDate = new Date();
  return this.save();
};

// Method to mark as paid
additionalExpensesSchema.methods.markAsPaid = function() {
  this.paymentStatus = 'paid';
  this.paidDate = new Date();
  return this.save();
};

// Pre-save middleware to calculate tax amount
additionalExpensesSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('taxInfo.taxRate')) {
    if (this.taxInfo.taxable && this.taxInfo.taxRate) {
      this.taxInfo.taxAmount = (this.amount * this.taxInfo.taxRate) / 100;
    } else {
      this.taxInfo.taxAmount = 0;
    }
  }
  
  // Auto-generate expense ID if not provided
  if (!this.expenseId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.expenseId = `EXP-${dateStr}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  
  // Update overdue status
  if (this.dueDate && this.dueDate < new Date() && this.paymentStatus === 'pending') {
    this.paymentStatus = 'overdue';
  }
  
  next();
});

// Static method to find overdue expenses
additionalExpensesSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    paymentStatus: 'pending'
  }).sort({ dueDate: 1 });
};

// Static method to find expenses by date range
additionalExpensesSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ date: -1 });
};

// Static method to get expense summary by category
additionalExpensesSchema.statics.getSummaryByCategory = function(startDate, endDate) {
  const match = {};
  if (startDate && endDate) {
    match.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

const AdditionalExpenses = mongoose.model('AdditionalExpenses', additionalExpensesSchema);

export default AdditionalExpenses;