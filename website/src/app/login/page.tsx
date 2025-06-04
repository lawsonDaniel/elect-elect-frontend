'use client';
import Image from "next/image";
import Link from "next/link";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Notification from "../component/notification";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export default function Login() {
  // Form submission handler
  interface LoginFormValues {
    email: string;
    password: string;
  }

  const handleSubmit = (values: LoginFormValues): void => {
    console.log('Form values:', values);
    Notification.info('Form submitted successfully!');
    // Add your login logic here
    // Example: await loginUser(values.email, values.password);
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
              className={`p-3 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-md border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Password"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-navBlue text-white py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Don't Have an account?{' '}
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