// utils/fileUpload.ts
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export interface FileUploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  originalName: string;
}

export async function handleFileUpload(
  file: File,
  uploadDir: string = 'uploads'
): Promise<FileUploadResult> {
  // Ensure upload directory exists
  const fullUploadDir = join(process.cwd(), 'public', uploadDir);
  if (!existsSync(fullUploadDir)) {
    await mkdir(fullUploadDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const originalName = file.name;
  const fileExtension = originalName.split('.').pop();
  const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = join(fullUploadDir, fileName);
  
  await writeFile(filePath, buffer);

  return {
    fileName,
    fileUrl: `/${uploadDir}/${fileName}`,
    fileSize: file.size,
    originalName
  };
}

// middleware/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  userType: 'student' | 'lecturer' | 'admin';
}

export function extractToken(request: NextRequest): string | null {
  // Try to get token from cookie first
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) return cookieToken;

  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }

  return null;
}

export function verifyToken(token: string): AuthenticatedUser {
  const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function authenticateRequest(request: NextRequest): AuthenticatedUser {
  const token = extractToken(request);
  
  if (!token) {
    throw new Error('No authentication token provided');
  }

  return verifyToken(token);
}

// utils/validation.ts
export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  public errors: ValidationError[] = [];

  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrorMessages(): string[] {
    return this.errors.map(error => `${error.field}: ${error.message}`);
  }

  getFirstError(): string | null {
    return this.errors.length > 0 ? this.errors[0].message : null;
  }
}

export function validateMaterialData(data: {
  courseTitle?: string;
  courseCode?: string;
  materialType?: string;
  description?: string;
  file?: File;
}): ValidationResult {
  const result = new ValidationResult();

  // Course Title validation
  if (!data.courseTitle || data.courseTitle.trim().length === 0) {
    result.addError('courseTitle', 'Course title is required');
  } else if (data.courseTitle.length > 100) {
    result.addError('courseTitle', 'Course title cannot exceed 100 characters');
  }

  // Course Code validation
  if (!data.courseCode || data.courseCode.trim().length === 0) {
    result.addError('courseCode', 'Course code is required');
  } else {
    const courseCodeRegex = /^[A-Z]{3,4} \d{3}$/;
    if (!courseCodeRegex.test(data.courseCode.trim().toUpperCase())) {
      result.addError('courseCode', 'Course code must be in format like "EEE 301"');
    }
  }

  // Material Type validation
  const validMaterialTypes = [
    'Lecture Notes (PDF)',
    'Past Questions (PDF)',
    'Handout (DOCX)',
    'Textbook (PDF)',
    'Assignment (PDF)'
  ];
  
  if (!data.materialType) {
    result.addError('materialType', 'Material type is required');
  } else if (!validMaterialTypes.includes(data.materialType)) {
    result.addError('materialType', 'Invalid material type');
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    result.addError('description', 'Description is required');
  } else if (data.description.length > 500) {
    result.addError('description', 'Description cannot exceed 500 characters');
  }

  // File validation (only for uploads)
  if (data.file) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(data.file.type)) {
      result.addError('file', 'Invalid file type. Only PDF, DOC, and DOCX files are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (data.file.size > maxSize) {
      result.addError('file', 'File size too large. Maximum size is 10MB');
    }

    if (data.file.size === 0) {
      result.addError('file', 'File is empty');
    }
  }

  return result;
}

// utils/responseHelpers.ts
import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination?: PaginationInfo;
}

export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    ...(data && { data }),
    ...(message && { message })
  };

  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  error: string,
  status: number = 400,
  errors?: string[]
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    ...(errors && { errors })
  };

  return NextResponse.json(response, { status });
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationInfo,
  message?: string
): NextResponse {
  const response: PaginatedApiResponse<T[]> = {
    success: true,
    data,
    pagination,
    ...(message && { message })
  };

  return NextResponse.json(response);
}

export function calculatePagination(
  page: number,
  limit: number,
  totalItems: number
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  return {
    currentPage,
    totalPages,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    limit
  };
}

// types/api.ts
export interface MaterialFilters {
  level?: string;
  materialType?: string;
  courseCode?: string;
  uploadedBy?: string;
  search?: string;
}

export interface MaterialQueryParams extends MaterialFilters {
  page?: number;
  limit?: number;
  sortBy?: 'uploadDate' | 'downloads' | 'courseTitle';
  sortOrder?: 'asc' | 'desc';
}

export interface MaterialStats {
  totalMaterials: number;
  totalDownloads: number;
  averageDownloads: number;
  materialsByType: Array<{
    _id: string;
    count: number;
    totalDownloads: number;
  }>;
  materialsByLevel: Array<{
    _id: string;
    count: number;
    totalDownloads: number;
  }>;
  recentUploads: any[];
}

// constants/materials.ts
export const MATERIAL_TYPES = [
  'Lecture Notes (PDF)',
  'Past Questions (PDF)',
  'Handout (DOCX)',
  'Textbook (PDF)',
  'Assignment (PDF)'
] as const;

export const ACADEMIC_LEVELS = ['100', '200', '300', '400', '500'] as const;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx']
} as const;

export const PAGINATION_CONFIG = {
  defaultLimit: 10,
  maxLimit: 50
} as const;