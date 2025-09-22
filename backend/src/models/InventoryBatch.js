import mongoose from 'mongoose';

const inventoryBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  originalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  manufactureDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  supplier: {
    name: String,
    id: String,
    contact: String
  },
  costPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'consumed', 'damaged'],
    default: 'active'
  },
  location: {
    warehouse: String,
    section: String,
    shelf: String
  },
  qualityCheck: {
    passed: {
      type: Boolean,
      default: true
    },
    checkedBy: String,
    checkDate: Date,
    notes: String
  },
  receivedDate: {
    type: Date,
    default: Date.now
  },
  consumedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingQuantity: {
    type: Number,
    default: function() {
      return this.quantity;
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
inventoryBatchSchema.index({ batchId: 1 });
inventoryBatchSchema.index({ productId: 1 });
inventoryBatchSchema.index({ expiryDate: 1 });
inventoryBatchSchema.index({ status: 1 });
inventoryBatchSchema.index({ 'supplier.id': 1 });

// Virtual for expired status
inventoryBatchSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for days until expiry
inventoryBatchSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const diffTime = this.expiryDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to consume quantity from batch
inventoryBatchSchema.methods.consume = function(quantity) {
  if (quantity > this.remainingQuantity) {
    throw new Error('Cannot consume more than remaining quantity');
  }
  
  this.consumedQuantity += quantity;
  this.remainingQuantity = this.quantity - this.consumedQuantity;
  
  if (this.remainingQuantity === 0) {
    this.status = 'consumed';
  }
  
  return this.save();
};

// Method to check if batch is near expiry (within 7 days)
inventoryBatchSchema.methods.isNearExpiry = function() {
  return this.daysUntilExpiry <= 7 && this.daysUntilExpiry >= 0;
};

// Pre-save middleware to update remaining quantity
inventoryBatchSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('consumedQuantity')) {
    this.remainingQuantity = this.quantity - this.consumedQuantity;
  }
  
  // Auto-update status based on expiry
  if (this.expiryDate < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

// Static method to find batches expiring soon
inventoryBatchSchema.statics.findExpiringSoon = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    expiryDate: { $lte: futureDate, $gte: new Date() },
    status: 'active',
    remainingQuantity: { $gt: 0 }
  }).sort({ expiryDate: 1 });
};

// Static method to find expired batches
inventoryBatchSchema.statics.findExpired = function() {
  return this.find({
    expiryDate: { $lt: new Date() },
    status: { $ne: 'expired' }
  });
};

const InventoryBatch = mongoose.model('InventoryBatch', inventoryBatchSchema);

export default InventoryBatch;