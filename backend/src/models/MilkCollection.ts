import mongoose, { Document, Schema } from 'mongoose';

export interface IMilkCollection extends Document {
  date: Date;
  supplier: string;
  quantity: number; // in liters
  quality: 'A' | 'B' | 'C';
  fatContent: number; // percentage
  proteinContent: number; // percentage
  temperature: number; // in Celsius
  pH: number;
  pricePerLiter: number;
  totalAmount: number;
  batchNumber: string;
  testResults: {
    bacteriaCount: number;
    somaticCellCount: number;
    antibiotics: boolean;
    adulterants: boolean;
  };
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const milkCollectionSchema = new Schema<IMilkCollection>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  supplier: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  quality: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  fatContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  proteinContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number,
    required: true
  },
  pH: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  pricePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  testResults: {
    bacteriaCount: {
      type: Number,
      required: true,
      min: 0
    },
    somaticCellCount: {
      type: Number,
      required: true,
      min: 0
    },
    antibiotics: {
      type: Boolean,
      required: true,
      default: false
    },
    adulterants: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

milkCollectionSchema.index({ date: -1 });
milkCollectionSchema.index({ supplier: 1 });
milkCollectionSchema.index({ batchNumber: 1 });
milkCollectionSchema.index({ status: 1 });

// Calculate total amount before saving
milkCollectionSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.pricePerLiter;
  next();
});

const MilkCollection = mongoose.model<IMilkCollection>('MilkCollection', milkCollectionSchema);
export default MilkCollection;