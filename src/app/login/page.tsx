"use client";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Notification from "../component/notification";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import endPoints from '@/utils/endpoints.class';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useDarkMode } from '@/contexts/DarkModeContext';

// Validation schema using Yup
const validationSchema = Yup.object({
  schoolEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@unijos\.edu\.ng$/,
      'Please use your official University of Jos email address (@unijos.edu.ng)'
    ),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const { darkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Form submission handler
  interface LoginFormValues {
    schoolEmail: string;
    password: string;
  }

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Step 1: Validate credentials with your MongoDB backend
      const response = await endPoints.login({
        email: values.schoolEmail,
        password: values.password,
      });

      if (!response?.user) {
        throw new Error('Invalid response from server');
      }

      console.log('MongoDB validation successful:', response?.user?.supabase_user_id);
      
      // Step 2: Authenticate with Supabase
      let { data: authData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: values.schoolEmail,
        password: values.password,
      });

      if (supabaseError) {
        if (supabaseError.message === 'Invalid login credentials') {
          console.log('User not found in Supabase, creating account...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: values.schoolEmail,
            password: values.password,
            options: {
              data: {
                first_name: response.user?.firstName || '',
                surname: response.user?.surname || '',
                user_type: response.user?.userType || '',
                level: response.user?.level || '',
                mongo_id: response.user?._id || ''
              }
            }
          });

          if (signUpError) {
            console.error('Supabase signup error:', signUpError);
            throw new Error(`Account creation failed: ${signUpError.message}`);
          }

          console.log('Supabase account created, signing in...');
          
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: values.schoolEmail,
            password: values.password,
          });

          if (retryError) {
            console.error('Retry Supabase authentication error:', retryError);
            throw new Error(`Login after account creation failed: ${retryError.message}`);
          }
          
          authData = retryData;
        } else {
          let userFriendlyMessage = 'Authentication failed';
          
          switch (supabaseError.message) {
            case 'Email not confirmed':
              userFriendlyMessage = 'Please check your email and confirm your account before signing in';
              break;
            case 'Invalid login credentials':
              userFriendlyMessage = 'Invalid email or password. Please check your credentials';
              break;
            case 'Too many requests':
              userFriendlyMessage = 'Too many login attempts. Please try again later';
              break;
            case 'Email rate limit exceeded':
              userFriendlyMessage = 'Too many requests. Please wait before trying again';
              break;
            case 'Signup disabled':
              userFriendlyMessage = 'Account registration is currently disabled';
              break;
            default:
              userFriendlyMessage = `Authentication error: ${supabaseError.message}`;
          }
          
          throw new Error(userFriendlyMessage);
        }
      }

      if (!authData?.user) {
        throw new Error('Authentication failed: No user data returned');
      }

      // Step 3: Store additional data in cookies
      if (response.token) {
        setCookie(null, 'auth-token', response.token, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        
        console.log('Auth token cookie set', response);
        
        setCookie(null, 'user-info', JSON.stringify({
          id: response.user._id,
          email: response.user.schoolEmail,
          userType: response.user.userType,
          firstName: response.user.firstName,
          surname: response.user.surname,
          supabase_user_id: response?.user.supabase_user_id
        }), {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
      }

      Notification.info('Login successful!');
      console.log('Full login successful');
      
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (!navigator.onLine) {
        const errorMsg = 'No internet connection. Please check your network and try again.';
        setError(errorMsg);
        Notification.error(errorMsg);
        return;
      }
      
      if (error.response?.data) {
        const backendError = error.response.data;
        let errorMsg = 'Login failed. Please check your credentials.';
        
        if (backendError.message) {
          errorMsg = `Login failed: ${backendError.message}`;
        } else if (backendError.error) {
          errorMsg = `Login failed: ${backendError.error}`;
        }
        
        setError(errorMsg);
        Notification.error(errorMsg);
        return;
      }
      
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      Notification.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      schoolEmail: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${
      darkMode ? 'bg-[#070E12]' : 'bg-[#EEF4FA]'
    }`}>
      <div className="relative lg:hidden bg-cover bg-center bg-no-repeat h-[198px] bg-[image:var(--bg-Faculty)] mb-14">
        <div className="absolute inset-0 bg-[#101E2799]"></div>
        <section className="bg-no-repeat bg-cover flex flex-col">
          <div className="px-[4.27%] md:px-[7.78%] h-[8.6rem] md:h-[10.438rem] w-full items-center mt-10 z-20 text-left md:text-center">
            <Link href="/">
              <div className="text-sm text-left mb-6">
                <p className="text-white hover:underline text-left text-lg">
                  &larr; Back to website
                </p>
              </div>
            </Link>
            <h1 className="text-center text-2xl md:text-3xl text-white font-bold">LOGIN</h1>
          </div>
        </section>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28">
        <div className="flex lg:flex-row flex-row-reverse justify-between">
          <Link href="/"> 
            <div className="lg:mb-6 hidden lg:block">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </Link>
          <Link href="/">
            <div className="text-sm text-right mb-6 translate-y-1/4 hidden lg:block">
              <p className={`hover:underline ${
                darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
              }`}>
                Back to website &rarr;
              </p>
            </div>
          </Link>
        </div>

        <h2 className={`md:block text-xl mt-1 md:mt-0 font-semibold mb-4 ${
          darkMode ? 'text-[#FFFFFF]' : 'text-black'
        }`}>Enter the following details:</h2>

        {error && (
          <div className={`mb-4 p-3 border rounded-md ${
            darkMode 
              ? 'bg-red-900/30 border-red-700 text-red-300' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError('')}
                  className="text-red-400 hover:opacity-75"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className={`text-sm mb-1 block ${
              darkMode ? 'text-[#EDF3F8]' : 'text-black'
            }`}>School Email</label>
            <input
              type="email"
              name="schoolEmail"
              value={formik.values.schoolEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={`p-3 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode 
                  ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              } ${
                formik.errors.schoolEmail && formik.touched.schoolEmail ? 'border-red-500' : ''
              }`}
              placeholder="Enter your Email"
            />
            {formik.errors.schoolEmail && formik.touched.schoolEmail && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.schoolEmail}</div>
            )}
          </div>

          <div className="mb-6">
            <label className={`text-sm mb-1 block ${
              darkMode ? 'text-[#EDF3F8]' : 'text-black'
            }`}>Enter Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={`p-3 pr-12 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                    : 'bg-white border-gray-300 text-black placeholder-gray-500'
                } ${
                  formik.errors.password && formik.touched.password ? 'border-red-500' : ''
                }`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
                }`}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting || isLoading}
            className={`py-3 rounded-md font-medium transition duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode 
                ? 'bg-navBlue text-white hover:bg-gray-800' 
                : 'bg-navBlue text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        
        <p className={`mt-3 font-medium hover:underline cursor-pointer ${
          darkMode ? 'text-[#EDF3F8]' : 'text-black'
        }`}>Forgot password?</p>

        <p className={`text-sm mt-6 ${
          darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
        }`}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={`font-medium hover:underline ${
            darkMode ? 'text-[#FFFFFF]' : 'text-black'
          }`}>
            Sign Up
          </Link>
        </p>
      </div>

      <div className="hidden lg:block w-1/2 h-[95vh] relative my-auto mx-4">
        <div className="absolute inset-0 bg-[#101E274D] z-20 rounded-xl"></div>
        <Image
          src="/FacultyIMG3.jpg"
          alt="Students working"
          fill
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
}