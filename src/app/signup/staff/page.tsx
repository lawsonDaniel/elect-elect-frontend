"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import endPoints from '@/utils/endpoints.class';
// Define the Gender enum to match your API
enum Gender {
  MALE = "Male",
  FEMALE = "Female"
}

// Validation schema
const validationSchema = Yup.object({
  surname: Yup.string()
    .required('Surname is required')
    .min(2, 'Surname must be at least 2 characters')
    .max(50, 'Surname must not exceed 50 characters'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['Male', 'Female'], 'Please select a valid gender'),
  rank: Yup.string()
    .required('Rank is required'),
  schoolEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('School email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@unijos\.edu\.ng$/,
      'Please use your official University of Jos email address (@unijos.edu.ng)'
    ),
  staffId: Yup.string()
    .required('Staff ID is required')
    .min(3, 'Staff ID must be at least 3 characters')
    .max(20, 'Staff ID must not exceed 20 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  repeatPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

const StaffSignup = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      surname: '',
      firstName: '',
      gender: '',
      rank: '',
      schoolEmail: '',
      staffId: '',
      password: '',
      repeatPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Transform the form data to match the API interface
        const apiData = {
          surname: values.surname.trim(),
          firstName: values.firstName.trim(),
          gender: values.gender === 'Male' ? Gender.MALE : Gender.FEMALE,
          rank: values.rank,
          schoolEmail: values.schoolEmail.trim().toLowerCase(),
          staffId: values.staffId.trim(),
          password: values.password,
          repeatPassword: values.repeatPassword
        };
        console.log("Submitting staff registration:", apiData);
        const response = await endPoints.staffRegister(apiData);
        console.log(response)
        toast.success('Staff registration successful! Welcome to our faculty.');
        
        // Reset form after successful registration
        resetForm();
        
        // Uncomment to redirect after successful registration
        // setTimeout(() => {
        //   router.push('/login');
        // }, 2000);

      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle different types of errors from the backend
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Handle validation errors with multiple error messages
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Display the first validation error
            toast.error(errorData.errors[0] || 'Validation failed');
          } 
          // Handle single error messages
          else if (errorData.message) {
            // Customize specific error messages for better user experience
            switch (errorData.message) {
              case 'User already exists with this email or staff ID':
                toast.error('An account with this email or staff ID already exists. Please use different credentials.');
                break;
              case 'schoolEmail already exists':
                toast.error('This school email is already registered. Please use a different email.');
                break;
              case 'staffId already exists':
                toast.error('This staff ID is already registered. Please check your staff ID.');
                break;
              case 'Passwords do not match':
                toast.error('The passwords you entered do not match. Please check and try again.');
                break;
              case 'All fields are required':
                toast.error('Please fill in all required fields to continue.');
                break;
              case 'Method not allowed':
                toast.error('Registration service is currently unavailable. Please try again later.');
                break;
              case 'Internal server error':
                toast.error('Something went wrong on our end. Please try again in a few moments.');
                break;
              default:
                toast.error(errorData.message);
            }
          } else {
            toast.error('Registration failed. Please try again.');
          }
        } 
        // Handle network errors or other issues
        else if (error.message) {
          if (error.message.includes('Network Error') || error.message.includes('fetch')) {
            toast.error('Unable to connect to the server. Please check your internet connection and try again.');
          } else {
            toast.error(error.message);
          }
        } 
        // Fallback error message
        else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Helper function to get error message for a field
  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : null;
  };

  // Helper function to determine if field has error
  const hasFieldError = (fieldName: keyof typeof formik.values) => {
    return Boolean(formik.touched[fieldName] && formik.errors[fieldName]);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-[#f8fbfd]">
        {/* Image Section */}
        <div className="relative w-full h-[180px] md:h-[220px] lg:h-screen lg:w-1/2 p-2 lg:p-4 flex-shrink-0">
          <Link href="/">
            <p className="absolute top-4 left-4 md:top-6 md:left-6 text-white text-sm flex items-center space-x-2 lg:hidden cursor-pointer z-10">
              <span>←</span> <span>Back to website</span>
            </p>
          </Link>

          <div className="relative w-full h-full">
            <Image
              src="/Frame 172.png"
              alt="Engineering Staff"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl lg:rounded-3xl"
              priority
            />
            
            <div className="absolute inset-0 bg-[#101E27CC] rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center text-center px-4">
              <h1 className="block lg:hidden text-white text-lg md:text-xl font-bold mb-2 max-w-md leading-tight">
                Staff Registration – Join Our Faculty
              </h1>
              <p className="block lg:hidden text-white text-xs md:text-sm">
                Create Your Account & Connect with Colleagues!
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center items-center p-4 md:p-6 lg:p-8 overflow-y-auto min-h-0">
          <div className="w-full max-w-lg">
            <Link href="/">
              <p className="text-sm text-gray-600 mb-4 cursor-pointer flex items-center space-x-2 hidden lg:flex">
                <span>←</span> <span>Back to website</span>
              </p>
            </Link>

            {/* Header for desktop */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Staff Registration  Join Our Faculty
              </h1>
              <p className="text-gray-500">
                Create Your Account & Connect with Colleagues!
              </p>
            </div>

            <div className="mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold">Enter the following details</h2>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-3 md:space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Surname
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formik.values.surname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter surname"
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('surname') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('surname') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('surname')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter first name"
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('firstName') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('firstName') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('firstName')}</p>
                  )}
                </div>
              </div>

              {/* Gender and Rank */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('gender') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {getFieldError('gender') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('gender')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rank
                  </label>
                  <select
                    name="rank"
                    value={formik.values.rank}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('rank') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Lecturer I">Lecturer I</option>
                    <option value="Lecturer II">Lecturer II</option>
                    <option value="Assistant Lecturer">Assistant Lecturer</option>
                    <option value="Technician">Technician</option>
                  </select>
                  {getFieldError('rank') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('rank')}</p>
                  )}
                </div>
              </div>

              {/* School Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  School Email
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formik.values.schoolEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter school email"
                  disabled={formik.isSubmitting}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    hasFieldError('schoolEmail') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getFieldError('schoolEmail') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('schoolEmail')}</p>
                )}
              </div>

              {/* Staff ID */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Staff ID
                </label>
                <input
                  type="text"
                  name="staffId"
                  value={formik.values.staffId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter staff ID"
                  disabled={formik.isSubmitting}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    hasFieldError('staffId') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {getFieldError('staffId') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('staffId')}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Create password"
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('password') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('password') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('password')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Repeat Password
                  </label>
                  <input
                    type="password"
                    name="repeatPassword"
                    value={formik.values.repeatPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Repeat password"
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasFieldError('repeatPassword') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('repeatPassword') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('repeatPassword')}</p>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 md:mt-6 mb-3 md:mb-4 flex items-center justify-center space-x-2"
              >
                {formik.isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs text-gray-600 pb-4 md:pb-0">
              Already have an account?{' '}
              <Link href="/login">
                <span className="underline font-semibold cursor-pointer">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffSignup;