"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import endPoints from '@/utils/endpoints.class';
import { useDarkMode } from '@/contexts/DarkModeContext';

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
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'You must be at least 16 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 16;
    }),
  schoolEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('School email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@unijos\.edu\.ng$/,
      'Please use your official University of Jos email address (@unijos.edu.ng)'
    ),
  mattNumber: Yup.string()
    .required('Matriculation number is required')
    .min(3, 'Matriculation number must be at least 3 characters')
    .max(20, 'Matriculation number must not exceed 20 characters'),
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
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  level: Yup.string()
    .required('Level is required')
    .oneOf(['100', '200', '300', '400', '500'], 'Please select a valid level')
});

const StudentSignup = () => {
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const formik = useFormik({
    initialValues: {
      surname: '',
      firstName: '',
      gender: 'Male',
      dob: '',
      schoolEmail: '',
      mattNumber: '',
      password: '',
      repeatPassword: '',
      level: '500'
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Transform the form data to match the API interface
        const apiData:any = {
          surname: values.surname.trim(),
          firstName: values.firstName.trim(),
          gender: values.gender,
          dob: values.dob, // Already in YYYY-MM-DD format from date input
          schoolEmail: values.schoolEmail.trim().toLowerCase(),
          mattNumber: values.mattNumber.trim(),
          password: values.password,
          level: values.level
        };
        
        console.log("Submitting student registration:", apiData);
        const response = await endPoints.studentRegister(apiData);
        console.log(response);
        
        toast.success('Student registration successful! Check your email for verification instructions.');
        
        // Reset form after successful registration
        resetForm();
        
        // Redirect after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);

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
              case 'User already exists with this email or matriculation number':
                toast.error('An account with this email or matriculation number already exists. Please use different credentials.');
                break;
              case 'schoolEmail already exists':
                toast.error('This school email is already registered. Please use a different email.');
                break;
              case 'mattNumber already exists':
                toast.error('This matriculation number is already registered. Please check your matriculation number.');
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
            background: darkMode ? '#101E27' : '#333',
            color: '#fff',
          },
        }}
      />
      
      <div className={`min-h-screen flex flex-col lg:flex-row-reverse ${
        darkMode ? 'bg-[#070E12]' : 'bg-[#f8fbfd]'
      }`}>
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
              alt="Engineering Students"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl lg:rounded-3xl"
              priority
            />
            
            <div className="absolute inset-0 bg-[#101E27CC] rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center text-center px-4">
              <h1 className="block lg:hidden text-white text-lg md:text-xl font-bold mb-2 max-w-md leading-tight">
                Sign Up – Join Our Engineering Community
              </h1>
              <p className="block lg:hidden text-white text-xs md:text-sm">
                Create Your Account & Stay Connected!
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center items-center p-4 md:p-6 lg:p-8 overflow-y-auto min-h-0">
          <div className="w-full max-w-lg">
            <Link href="/">
              <p className={`text-sm mb-4 cursor-pointer flex items-center space-x-2 hidden lg:flex ${
                darkMode ? 'text-[#EDF3F8] hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
                <span>←</span> <span>Back to website</span>
              </p>
            </Link>

            {/* Header for desktop */}
            <div className="hidden lg:block mb-6">
              <h1 className={`text-2xl font-bold mb-2 ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>
                Sign Up – Join Our Engineering Community
              </h1>
              <p className={`${
                darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
              }`}>
                Create Your Account & Stay Connected!
              </p>
            </div>

            <div className="mb-3 md:mb-4">
              <h2 className={`text-base md:text-lg font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Enter the following details</h2>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-3 md:space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
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
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    } ${
                      hasFieldError('surname') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('surname') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('surname')}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
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
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    } ${
                      hasFieldError('firstName') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('firstName') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('firstName')}</p>
                  )}
                </div>
              </div>

              {/* Gender and DOB */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF]' 
                        : 'bg-white border-gray-300 text-black'
                    } ${
                      hasFieldError('gender') ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {getFieldError('gender') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('gender')}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
                    D.O.B
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF]' 
                        : 'bg-white border-gray-300 text-black'
                    } ${
                      hasFieldError('dob') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('dob') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('dob')}</p>
                  )}
                </div>
              </div>

              {/* School Email */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                }`}>
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
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                      : 'bg-white border-gray-300 text-black placeholder-gray-500'
                  } ${
                    hasFieldError('schoolEmail') ? 'border-red-500' : ''
                  }`}
                />
                {getFieldError('schoolEmail') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('schoolEmail')}</p>
                )}
              </div>

              {/* Matt Number */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                }`}>
                  Matt Number
                </label>
                <input
                  type="text"
                  name="mattNumber"
                  value={formik.values.mattNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter matriculation number"
                  disabled={formik.isSubmitting}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                      : 'bg-white border-gray-300 text-black placeholder-gray-500'
                  } ${
                    hasFieldError('mattNumber') ? 'border-red-500' : ''
                  }`}
                />
                {getFieldError('mattNumber') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('mattNumber')}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
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
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    } ${
                      hasFieldError('password') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('password') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('password')}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                  }`}>
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
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode 
                        ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                    } ${
                      hasFieldError('repeatPassword') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('repeatPassword') && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError('repeatPassword')}</p>
                  )}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'
                }`}>
                  Level
                </label>
                <select
                  name="level"
                  value={formik.values.level}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF]' 
                      : 'bg-white border-gray-300 text-black'
                  } ${
                    hasFieldError('level') ? 'border-red-500' : ''
                  }`}
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>
                {getFieldError('level') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('level')}</p>
                )}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full bg-navBlue text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-6 mb-3 md:mb-4 flex items-center justify-center space-x-2"
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
            <p className={`text-center text-xs pb-4 md:pb-0 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <Link href="/login">
                <span className={`underline font-semibold cursor-pointer ${
                  darkMode ? 'text-[#FFFFFF] hover:opacity-75' : 'text-black hover:opacity-75'
                }`}>Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSignup;