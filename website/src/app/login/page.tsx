'use client';
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#EEF4FA] flex flex-col lg:flex-row  ">
      <div className="relative lg:hidden bg-cover bg-center bg-no-repeat h-[198px] md:bg-[image:var(--bg-Faculty)] md:mb-14 ">
          <div className="hidden md:block absolute inset-0 bg-[#101E2799]"></div>
          
          {/* Hero Section */}
          <section className="bg-no-repeat bg-cover flex flex-col ">
            <div className="px-[4.27%] md:px-[7.78%] h-[8.6rem] md:h-[10.438rem] w-full items-center  mt-10    z-20  text-left md:text-center">
            <Link href="/">
              <div className="text-sm text-left mb-6  ">
                <p className="text-black md:text-white hover:underline text-left text-lg 
                 ">
                  &larr; Back to website 
                </p>
              </div></Link>
              <h1 className="text-2xl md:text-3xl text-black md:text-white font-bold  ">Enter the following details</h1> 
            </div>
          </section>
       </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28">
      <div className="flex lg:flex-row flex-row-reverse justify-between">
        {/* Logo */}
        <Link href="/"><div className="lg:mb-6 hidden lg:block">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </div></Link>

        {/* Back to website link */}

        <Link href="/">
        <div className="text-sm text-right mb-6 translate-y-1/4 hidden lg:block">
          <p className="text-gray-600 hover:underline ">
            Back to website &rarr;
          </p>
        </div></Link>
      </div>
        

        <h2 className="hidden md:block text-xl  font-semibold mb-4">Enter the following details</h2>

        <label className="text-sm mb-1">School Email</label>
        <input
          type="email"
          
          className="mb-4 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your Email"
        />

        <label className="text-sm mb-1">Enter Password</label>
        <input
          type="password"
         
          className="mb-6 p-3 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
        />

        <button
          
          className="bg-navBlue text-white py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300 cursor-pointer"
        >
          Continue
        </button>

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
  )
}
