import mongoose from 'mongoose';

const allowanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employee'
  },
  employeeName: {
    type: String,
    required: true
  },
  allowanceType: {
    type: String,
    required: true,
    enum: ['travel', 'food', 'housing', 'medical', 'overtime', 'bonus', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  paymentDate: {
    type: Date
  },
  taxable: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for efficient queries
allowanceSchema.index({ employeeId: 1, date: -1 });
allowanceSchema.index({ status: 1 });
allowanceSchema.index({ allowanceType: 1 });

const Allowance = mongoose.model('Allowance', allowanceSchema);

export default Allowance;