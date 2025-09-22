import mongoose from 'mongoose';

const RawMaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { 
      type: String, 
      enum: ['Feed', 'Medicine', 'Equipment', 'Chemicals', 'Supplements', 'Other'],
      default: 'Other'
    },
    unit: { 
      type: String, 
      enum: ['kg', 'lbs', 'tons', 'liters', 'gallons', 'pcs', 'boxes'],
      default: 'kg'
    },
    unitCost: { type: Number, required: true, min: 0 },
    supplier: { type: String, required: true, trim: true },
    supplierContact: {
      phone: String,
      email: String,
      address: String
    },
    reorderLevel: { type: Number, default: 0, min: 0 },
    maxStockLevel: { type: Number, min: 0 },
    currentStock: { type: Number, default: 0, min: 0 },
    expiryDate: Date,
    batchNumber: String,
    storageLocation: String,
    storageConditions: {
      temperature: String,
      humidity: String,
      specialRequirements: String
    },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total value
RawMaterialSchema.virtual('totalValue').get(function() {
  return this.currentStock * this.unitCost;
});

// Virtual for stock status
RawMaterialSchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= this.reorderLevel) return 'Low Stock';
  if (this.maxStockLevel && this.currentStock >= this.maxStockLevel) return 'Overstocked';
  return 'Normal';
});

export default mongoose.model('RawMaterial', RawMaterialSchema);