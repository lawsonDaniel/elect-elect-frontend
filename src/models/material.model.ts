import mongoose, { Document, Schema, Types } from 'mongoose';

// Material interface
export interface IMaterial extends Document {
  courseTitle: string;
  materialType: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloads: number;
  uploadDate: Date;
  uploadedBy: Types.ObjectId;
  level: string;
  courseCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema<IMaterial>(
  {
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Course title cannot exceed 100 characters'],
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{3,4} \d{3}$/, 'Course code must be in format like "EEE 301"'],
    },
    materialType: {
      type: String,
      required: [true, 'Material type is required'],
      enum: {
        values: [
          'Lecture Notes (PDF)',
          'Past Questions (PDF)',
          'Handout (DOCX)',
          'Textbook (PDF)',
          'Assignment (PDF)',
        ],
        message: 'Invalid material type',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be at least 1 byte'],
    },
    downloads: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required'],
    },
    level: {
      type: String,
      required: [false, 'Level is not required'], // Fixed: Corrected typo in required message
      enum: {
        values: ['100', '200', '300', '400', '500'],
        message: 'Level must be 100, 200, 300, 400, or 500',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Extract level from course code before saving
materialSchema.pre('save', function (next) {
  if (this.courseCode) {
    const levelMatch = this.courseCode.match(/\d{3}/);
    if (levelMatch) {
      this.level = levelMatch[0].charAt(0) + '00'; // Ensure level is '100', '200', etc.
    }
  }
  next();
});

// Indexes for better query performance
materialSchema.index({ courseCode: 1 });
materialSchema.index({ level: 1 });
materialSchema.index({ materialType: 1 });
materialSchema.index({ uploadedBy: 1 });
materialSchema.index({ uploadDate: -1 });
materialSchema.index({ downloads: -1 });

// Compound indexes
materialSchema.index({ level: 1, materialType: 1 });
materialSchema.index({ courseCode: 1, materialType: 1 });

// Register the Material model
const Material = mongoose.models.Material || mongoose.model<IMaterial>('Material', materialSchema);
export default Material;