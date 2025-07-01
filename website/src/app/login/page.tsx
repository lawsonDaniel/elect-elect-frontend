'use client';
import Image from "next/image";
import Link from "next/link";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Notification from "../component/notification";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 

  // Form submission handler
  interface LoginFormValues {
    email: string;
    password: string;
  }

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Notification.info('Login successful!');
        console.log('Login successful:', data);
        
        // Handle successful login (e.g., redirect to dashboard)
        // Example: router.push('/dashboard');
        // You might also want to store the user token or session data
        
      } else {
        // Handle API error response
        Notification.info(data.message || 'Login failed. Please try again.');
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
      Notification.info('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Formik object
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="min-h-screen bg-[#EEF4FA] flex flex-col lg:flex-row ">
      <div className="relative lg:hidden bg-cover bg-center bg-no-repeat h-[198px] bg-[image:var(--bg-Faculty)] mb-14 ">
        <div className=" absolute inset-0 bg-[#101E2799]"></div>
        {/* Hero Section */}
        <section className="bg-no-repeat bg-cover flex flex-col ">
          <div className="px-[4.27%] md:px-[7.78%] h-[8.6rem] md:h-[10.438rem] w-full items-center mt-10 z-20 text-left md:text-center">
            <Link href="/">
              <div className="text-sm text-left mb-6 ">
                <p className="text-white hover:underline text-left text-lg">
                  &larr; Back to website
                </p>
              </div>
            </Link>
            <h1 className=" text-center text-2xl md:text-3xl text-white font-bold ">LOGIN</h1>
          </div>
        </section>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28">
        <div className="flex lg:flex-row flex-row-reverse justify-between">
          {/* Logo */}
          <Link href="/"> 
            <div className="lg:mb-6 hidden lg:block">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </Link>
          {/* Back to website link */}
          <Link href="/">
            <div className="text-sm text-right mb-6 translate-y-1/4 hidden lg:block">
              <p className="text-gray-600 hover:underline ">
                Back to website &rarr;
              </p>
            </div>
          </Link>
        </div>

        <h2 className=" md:block text-xl mt-1 md:mt-0  font-semibold mb-4">Enter the following details:</h2>

        {/* Form using Formik object */}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="text-sm mb-1 block">School Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={`p-3 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your Email"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-sm mb-1 block">Enter Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                className={`p-3 pr-12 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-navBlue text-white py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        <p className="mt-3 text-black  font-medium hover:underline cursor-pointer">Forgot password?</p>

        <p className="text-sm text-gray-500 mt-6">
          Don’t Have an account?{' '}
          <a href="#" className="text-black font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 h-[95vh] relative my-auto mx-4 ">
        <div className="absolute inset-0 bg-[#101E274D] z-20 rounded-xl"></div>
        <Image
          src="/FacultyIMG3.jpg"
          alt="Students working"
          fill
          className="rounded-xl"
        />
      </div>
    </div>
  );
}