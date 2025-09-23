import mongoose, { Document, Schema } from 'mongoose';

// Payment interface
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userType: 'student' | 'staff';
  paymentType: 'dues' | 'fee' | 'fine' | 'other';
  amount: number;
  currency: string;
  reference: string;
  paystackReference: string;
  status: 'pending' | 'success' | 'failed' | 'abandoned';
  gatewayResponse?: string;
  paidAt?: Date;
  metadata?: {
    level?: string;
    department?: string;
    faculty?: string;
    academicYear?: string;
    semester?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Payment Schema
const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    userType: {
      type: String,
      required: [true, 'User type is required'],
      enum: {
        values: ['student', 'staff'],
        message: 'User type must be student or staff',
      },
    },
    paymentType: {
      type: String,
      required: [true, 'Payment type is required'],
      enum: {
        values: ['dues', 'fee', 'fine', 'other'],
        message: 'Payment type must be dues, fee, fine, or other',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'NGN',
      enum: {
        values: ['NGN', 'USD'],
        message: 'Currency must be NGN or USD',
      },
    },
    reference: {
      type: String,
      required: [true, 'Reference is required'],
      unique: true,
      trim: true,
    },
    paystackReference: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'success', 'failed', 'abandoned'],
        message: 'Status must be pending, success, failed, or abandoned',
      },
    },
    gatewayResponse: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      level: String,
      department: String,
      faculty: String,
      academicYear: String,
      semester: String,
      description: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
paymentSchema.index({ userId: 1 });
paymentSchema.index({ userEmail: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ paidAt: -1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ paystackReference: 1 });

// Compound indexes
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ userType: 1, paymentType: 1 });
paymentSchema.index({ userId: 1, paymentType: 1, status: 1 });

// Virtual to get user details
paymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Static methods
paymentSchema.statics.findByReference = function (reference: string) {
  return this.findOne({ reference });
};

paymentSchema.statics.findByPaystackReference = function (paystackReference: string) {
  return this.findOne({ paystackReference });
};

paymentSchema.statics.findUserPayments = function (
  userId: mongoose.Types.ObjectId,
  paymentType?: string
) {
  const query: any = { userId };
  if (paymentType) query.paymentType = paymentType;
  return this.find(query).sort({ createdAt: -1 });
};

paymentSchema.statics.getPaymentStats = function (userId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
};

// Register the Payment model
const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;