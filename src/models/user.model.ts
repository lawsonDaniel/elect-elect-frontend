import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// User interface
export interface IUser extends Document {
  surname: string;
  firstName: string;
  gender: 'Male' | 'Female' | 'Other';
  userType: 'student' | 'staff';
  schoolEmail: string;
  password: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  // Student fields
  dob?: Date;
  mattNumber?: string;
  level?: string;
  // Staff fields
  rank?: string;
  staffId?: string;
  department?: string;
  faculty?: string;
  // Methods
  fullName: string;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    surname: {
      type: String,
      required: [true, 'Surname is required'],
      trim: true,
      maxlength: [50, 'Surname cannot exceed 50 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other',
      },
    },
    userType: {
      type: String,
      required: [true, 'User type is required'],
      enum: {
        values: ['student', 'staff'],
        message: 'User type must be student or staff',
      },
    },
    schoolEmail: {
      type: String,
      required: [true, 'School email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@unijos\.edu\.ng$/,
        'School email must be a valid @unijos.edu.ng address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    // Student fields
    dob: {
      type: Date,
    },
    mattNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    level: {
      type: String,
      enum: {
        values: ['100', '200', '300', '400', '500'],
        message: 'Level must be 100, 200, 300, 400, or 500',
      },
    },
    // Staff fields
    rank: {
      type: String,
      enum: {
        values: [
          'Professor',
          'Associate Professor',
          'Senior Lecturer',
          'Lecturer I',
          'Lecturer II',
          'Assistant Lecturer',
          'Technician',
        ],
        message: 'Invalid rank value',
      },
    },
    staffId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      trim: true,
    },
    faculty: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.surname}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to validate schoolEmail
userSchema.pre('save', function (next) {
  if (!this.schoolEmail) {
    return next(new Error('School email cannot be null or undefined'));
  }
  if (!/^[a-zA-Z0-9._%+-]+@unijos\.edu\.ng$/.test(this.schoolEmail)) {
    return next(new Error('Invalid school email format'));
  }
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Password reset token method
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

// Static methods
userSchema.statics.findByEmailWithPassword = function (email: string) {
  return this.findOne({ schoolEmail: email }).select('+password');
};

userSchema.statics.findByResetToken = function (token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });
};

// Indexes
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ level: 1 }, { sparse: true });
userSchema.index({ rank: 1 }, { sparse: true });
userSchema.index({ department: 1 }, { sparse: true });
userSchema.index({ faculty: 1 }, { sparse: true });

// Compound indexes
userSchema.index({ userType: 1, level: 1 });
userSchema.index({ userType: 1, rank: 1 });
userSchema.index({ userType: 1, department: 1 });

// Export model - FIXED: Check if model already exists to prevent overwrite
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;