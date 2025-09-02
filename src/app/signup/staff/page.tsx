"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const StaffSignup = () => {
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    gender: 'Male',
    rank: 'Professor',
    schoolEmail: '',
    staffId: '',
    password: '',
    repeatPassword: ''
  });

  // const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
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

          {/* Form Fields */}
          <div className="space-y-3 md:space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Surname
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
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
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rank
                </label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Lecturer I">Lecturer I</option>
                  <option value="Lecturer II">Lecturer II</option>
                  <option value="Assistant Lecturer">Assistant Lecturer</option>
                  <option value="Technician">Technician</option>
                </select>
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
                value={formData.schoolEmail}
                onChange={handleInputChange}
                placeholder="Value"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Staff ID */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Staff ID
              </label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                placeholder="Value"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
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
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Repeat Password
                </label>
                <input
                  type="password"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  placeholder="Value"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 mt-4 md:mt-6 mb-3 md:mb-4"
          >
            Continue
          </button>

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
  );
};

export default StaffSignup;