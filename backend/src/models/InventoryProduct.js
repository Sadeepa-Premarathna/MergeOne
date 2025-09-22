import mongoose from 'mongoose';

const inventoryProductSchema = new mongoose.Schema({
  name: {
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
    enum: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice-cream', 'other']
  },
  brand: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  barcode: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['liter', 'kg', 'piece', 'pack', 'bottle', 'carton']
  },
  stock: {
    currentQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    maxThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 1000
    }
  },
  batches: [{
    batchId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    manufactureDate: {
      type: Date,
      required: true
    },
    supplier: {
      type: String,
      default: ''
    },
    costPerUnit: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  supplier: {
    name: String,
    contact: String,
    email: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
inventoryProductSchema.index({ sku: 1 });
inventoryProductSchema.index({ category: 1 });
inventoryProductSchema.index({ 'stock.currentQuantity': 1 });
inventoryProductSchema.index({ isActive: 1 });
inventoryProductSchema.index({ 'batches.expiryDate': 1 });

// Virtual for stock status
inventoryProductSchema.virtual('stockStatus').get(function() {
  if (this.stock.currentQuantity <= 0) return 'out-of-stock';
  if (this.stock.currentQuantity <= this.stock.minThreshold) return 'low-stock';
  if (this.stock.currentQuantity >= this.stock.maxThreshold) return 'overstock';
  return 'in-stock';
});

// Method to add stock
inventoryProductSchema.methods.addStock = function(quantity, batchInfo) {
  this.stock.currentQuantity += quantity;
  if (batchInfo) {
    this.batches.push({
      ...batchInfo,
      quantity
    });
  }
  return this.save();
};

// Method to remove stock (FIFO)
inventoryProductSchema.methods.removeStock = function(quantity) {
  let remaining = quantity;
  
  for (let i = 0; i < this.batches.length && remaining > 0; i++) {
    const batch = this.batches[i];
    if (batch.quantity > 0) {
      const takeFromBatch = Math.min(batch.quantity, remaining);
      batch.quantity -= takeFromBatch;
      remaining -= takeFromBatch;
    }
  }
  
  // Remove empty batches
  this.batches = this.batches.filter(batch => batch.quantity > 0);
  
  this.stock.currentQuantity -= (quantity - remaining);
  return this.save();
};

const InventoryProduct = mongoose.model('InventoryProduct', inventoryProductSchema);

export default InventoryProduct;