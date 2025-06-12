import mongoose from "mongoose";

// Define role types
enum UserRole {
  STUDENT = "student",
  STAFF = "staff",
  ADMIN = "admin"
}

// Define gender types
enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

const UserSchema = new mongoose.Schema({
  // Basic Information
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  
  // Name fields
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  surname: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Full name for backward compatibility (can be computed from firstName + surname)
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Personal Information
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  
  // Academic Information
  matricNumber: {
    type: Number,
    required: function(this:any): boolean {
      return this.role === UserRole.STUDENT;
    },
    min: [100, 'Matric number must be at least 100'],
    max: [600, 'Matric number cannot exceed 600'],
    unique: true,
    sparse: true // Allows null values to not conflict with uniqueness for non-students
  },
  level: {
    type: Number,
    required: function() {
      return this.role === UserRole.STUDENT;
    },
    enum: [100, 200, 300, 400, 500],
    default: function() {
      return this.role === UserRole.STUDENT ? 100 : undefined;
    }
  },
  
  // Role and Status
  role: {
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.STUDENT
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save middleware to update the updatedAt field
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-generate full name from firstName and surname
  if (this.firstName && this.surname) {
    this.name = `${this.firstName} ${this.surname}`;
  }
  
  next();
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ matricNumber: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);