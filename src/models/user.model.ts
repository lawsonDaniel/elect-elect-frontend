import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Interface for User document
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
  
  // Student-specific fields
  dob?: Date;
  mattNumber?: string;
  level?: '100' | '200' | '300' | '400' | '500';
  
  // Staff-specific fields
  rank?: 'Professor' | 'Associate Professor' | 'Senior Lecturer' | 'Lecturer I' | 'Lecturer II' | 'Assistant Lecturer' | 'Technician';
  staffId?: string;
  department?: string;
  faculty?: string;
  
  // Virtual and methods
  fullName: string;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema<IUser>({
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
    maxlength: [50, 'Surname cannot exceed 50 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other'
    }
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['student', 'staff'],
      message: 'User type must be either student or staff'
    }
  },
  schoolEmail: {
    type: String,
    required: [true, 'School email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: Date,
  
  // Student-specific fields
  dob: {
    type: Date,
    required: function(this: IUser) {
      return this.userType === 'student';
    },
    validate: {
      validator: function(value: Date) {
        if (this.userType === 'student') {
          return value < new Date();
        }
        return true;
      },
      message: 'Date of birth must be in the past'
    }
  },
  mattNumber: {
    type: String,
    required: function(this: IUser) {
      return this.userType === 'student';
    },
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness for non-null values
    trim: true,
    uppercase: true,
    validate: {
      validator: function(mattNumber: string) {
        if (this.userType === 'student' && mattNumber) {
          return /^[A-Z0-9]{6,}$/.test(mattNumber);
        }
        return true;
      },
      message: 'Invalid matt number format'
    }
  },
  level: {
    type: String,
    required: function(this: IUser) {
      return this.userType === 'student';
    },
    enum: {
      values: ['100', '200', '300', '400', '500'],
      message: 'Level must be 100, 200, 300, 400, or 500'
    },
    validate: {
      validator: function(level: string) {
        if (this.userType === 'student') {
          return ['100', '200', '300', '400', '500'].includes(level);
        }
        return true;
      },
      message: 'Level is required for students'
    }
  },
  
  // Staff-specific fields
  rank: {
    type: String,
    required: function(this: IUser) {
      return this.userType === 'staff';
    },
    enum: {
      values: [
        'Professor',
        'Associate Professor',
        'Senior Lecturer',
        'Lecturer I',
        'Lecturer II',
        'Assistant Lecturer',
        'Technician'
      ],
      message: 'Invalid rank selected'
    },
    validate: {
      validator: function(rank: string) {
        if (this.userType === 'staff') {
          return [
            'Professor',
            'Associate Professor',
            'Senior Lecturer',
            'Lecturer I',
            'Lecturer II',
            'Assistant Lecturer',
            'Technician'
          ].includes(rank);
        }
        return true;
      },
      message: 'Rank is required for staff'
    }
  },
  staffId: {
    type: String,
    required: function(this: IUser) {
      return this.userType === 'staff';
    },
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness for non-null values
    trim: true,
    uppercase: true,
    validate: {
      validator: function(staffId: string) {
        if (this.userType === 'staff' && staffId) {
          return /^[A-Z0-9]{4,}$/.test(staffId);
        }
        return true;
      },
      message: 'Invalid staff ID format'
    }
  },
  department: {
    type: String,
    trim: true,
    validate: {
      validator: function(department: string) {
        // Only allow department for staff
        if (department && this.userType !== 'staff') {
          return false;
        }
        return true;
      },
      message: 'Department can only be set for staff members'
    }
  },
  faculty: {
    type: String,
    trim: true,
    validate: {
      validator: function(faculty: string) {
        // Only allow faculty for staff
        if (faculty && this.userType !== 'staff') {
          return false;
        }
        return true;
      },
      message: 'Faculty can only be set for staff members'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.surname}`;
});

// Pre-save middleware to hash passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to clean up fields based on userType
userSchema.pre('save', function(next) {
  if (this.userType === 'student') {
    // Clear staff-specific fields for students
    this.rank = undefined;
    this.staffId = undefined;
    this.department = undefined;
    this.faculty = undefined;
  } else if (this.userType === 'staff') {
    // Clear student-specific fields for staff
    this.dob = undefined;
    this.mattNumber = undefined;
    this.level = undefined;
  }
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(
  candidatePassword: string, 
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to generate password reset token
userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Indexes for better query performance
userSchema.index({ schoolEmail: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ mattNumber: 1 }, { sparse: true }); // Sparse index for optional field
userSchema.index({ staffId: 1 }, { sparse: true }); // Sparse index for optional field
userSchema.index({ level: 1 });
userSchema.index({ rank: 1 });
userSchema.index({ department: 1 });
userSchema.index({ createdAt: -1 });

// Compound indexes
userSchema.index({ userType: 1, level: 1 }); // For querying students by level
userSchema.index({ userType: 1, rank: 1 }); // For querying staff by rank
userSchema.index({ userType: 1, department: 1 }); // For querying staff by department

// Create and export model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;