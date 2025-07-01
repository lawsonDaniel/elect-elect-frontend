"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';


const SignupRole = () => {
  const [role, setRole] = useState<'student' | 'staff' | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col md:flex-col lg:flex-row-reverse bg-[#f8fbfd]">

      {/* Top Image Section for tablet and below */}
      <div className="relative w-full h-[303px] md:h-[303px] lg:h-auto lg:w-1/2">
      <Link href="/">
  <p className="absolute top-4 left-4 text-white text-sm flex items-center space-x-2 lg:hidden cursor-pointer z-10">
    <span>←</span> <span>Back to website</span>
  </p>
</Link>

        <Image
          src="/Frame 172.png"
          alt="Engineering Students"
          layout="fill"
          objectFit="cover"
          className="rounded-none lg:rounded-3xl"
        />
        <div className="absolute inset-0 bg-[#101E27CC] flex flex-col justify-center items-center text-center px-4">
        <h1 className="block lg:hidden text-white text-2xl md:text-3xl font-bold mb-2 max-w-xl">
  Sign Up – Join Our Engineering Community
</h1>

          <p className="block lg:hidden text-white text-sm md:text-base">
            Create Your Account & Stay Connected!
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 space-y-6">
        <div className="w-full max-w-md">
        <Link href="/">
  <p className="text-sm text-gray-600 mb-6 cursor-pointer flex items-center space-x-2 hidden lg:flex">
    <span>←</span> <span>Back to website</span>
  </p>
</Link>


          {/* On tablet, headings are now in the image, so we hide them here */}
          <div className="hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">
              Sign Up – Join Our Engineering Community
            </h1>
            <p className="text-gray-500 mb-8">
              Create Your Account & Stay Connected!
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Select Role</p>
            <p className="text-gray-500 text-sm mb-4">
              Choose the appropriate role to access tailored features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Student */}
              <div
                onClick={() => setRole('student')}
                className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                  role === 'student' ? 'border-black' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2 space-x-2">
                  <div className="p-2 rounded">
                    <Image src="/Frame 175.png" alt="Student" width={40} height={40} />
                  </div>
                  <input type="radio" checked={role === 'student'} readOnly />
                </div>
                <h2 className="font-semibold">Student</h2>
                <p className="text-sm text-gray-500">
                  Your dashboard and access privileges will be student-based only.
                </p>
              </div>

              {/* Staff */}
              <div
                onClick={() => setRole('staff')}
                className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                  role === 'staff' ? 'border-black' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2 space-x-2">
                  <div className="p-2 rounded">
                    <Image src="/Frame 175.png" alt="Staff" width={40} height={40} />
                  </div>
                  <input type="radio" checked={role === 'staff'} readOnly />
                </div>
                <h2 className="font-semibold">Staff</h2>
                <p className="text-sm text-gray-500">
                  Your dashboard and access privileges will be staff-based only.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
           <button
      onClick={() => {
        if (role === 'student') {
          router.push('/signup/student');
        } else if (role === 'staff') {
          router.push('/signup/staff');
        }
      }}
      className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
    >
      Continue
    </button>
          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
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
export default SignupRole;
