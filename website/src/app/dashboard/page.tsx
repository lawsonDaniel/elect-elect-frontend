'use client';
import { useState } from 'react';
import Sidenav from '../component/sideNav';
import DashHeader from '../component/dashHeader';
import {Poppins, Space_Grotesk,} from "next/font/google"
import Image from 'next/image';

 const cards = [
    {
      title: 'Courses Enrolled',
      value: 20,
      sub: 'This Session',
      border: 'border-blue-400',
    },
    {
      title: 'Downloads',
      value: 30,
      sub: 'This Session',
      border: 'border-orange-300',
    },
    {
      title: 'Upcoming Classes',
      value: 5,
      sub: 'This Week',
      border: 'border-red-300',
    },
    {
      title: 'Payment Status',
      value: 'Dues Payment',
      sub: 'Pending',
      border: 'border-yellow-400',
      isBold: true,
    },
  ];


const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // optional: to use as a CSS variable
  display: 'swap',            
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
  
})

export default function Dashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className={`flex min-h-screen`}>
      <div className='h-screen flex items-center justify-start '>
      <Sidenav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      </div>
      
      <div className="flex flex-col mt-1 w-full px-3 lg:pr-7">
        {/* Your dashboard content here */}
        <DashHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
        
        {/* Rest of your dashboard components */}
        <div className='w-full'>
          <h1 className={`text-xl sm:text-2xl font-semibold ${spaceGrotesk.className} mb-2`}>Welcome Back, Enoch</h1>
          <div className='w-full flex flex-col lg:flex-row lg:justify-between gap-4 mb-6'>
            <p className='lg:w-1/2 flex-shrink-0 text-sm sm:text-base'>Here&apos;s your current academic and departmental summary.</p>
            <div className='flex flex-col sm:flex-row gap-2 lg:w-1/2 lg:justify-end'>
              <button className='flex px-2 sm:px-3 bg-white border text-xs sm:text-sm text-navBlue border-navBlue gap-1 sm:gap-2 h-10 items-center justify-center rounded-xl flex-shrink-0 cursor-pointer'>
                <Image 
                src='/refresh.png'
                width={16}
                height={16}
                alt='refresh'
                color='black'
                className='text-white sm:w-5 sm:h-5'
                /> 
                <span className='truncate'>Refresh Dashboard</span>
              </button>
              <button className='flex bg-navBlue border text-xs sm:text-sm text-white h-10 items-center justify-center rounded-xl gap-1 sm:gap-2 px-2 sm:px-3 flex-shrink-0 cursor-pointer'>
                <Image 
                src='/printer.png'
                width={16}
                height={16}
                alt='printer'
                className='sm:w-6 sm:h-6'
                /> 
                <span className='truncate'>Print Receipt</span>
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className='flex flex-col xl:flex-row gap-4 sm:gap-6'>
            {/* Blue Chart/Content Box */}
            <div className='bg-navBlue text-white p-6 w-full lg:w-[31.4rem]  sm:h-80 md:h-[20.75rem] rounded-lg flex-shrink-0 order-1'>
              {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors cursor-pointer">
          See More
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        
        <Image 
          src='/DrTijani.png' 
          width={48} 
          height={48} 
          alt="Profile Picture" 
          className="rounded-full "
        />
        
        <div>
          <h3 className="text-lg font-semibold mb-1">Enoch Folorunso</h3>
          <p className="text-gray-400 text-sm">Student</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <span className="text-gray-400 text-sm">Matt Number:</span>
            <span className="text-white text-sm ml-1">UJ/2018/EL/0001</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Email:</span>
            <span className="text-white text-sm ml-1">enoch@gmail.com</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Faculty:</span>
            <span className="text-white text-sm ml-1">Engineering</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Level:</span>
            <span className="text-white text-sm ml-1">500</span>
          </div>
        </div>
      </div>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 order-1 xl:order-2">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`border-2 ${card.border} rounded-lg p-3 sm:p-4 shadow-sm min-h-[120px] sm:min-h-[140px] flex flex-col justify-between`}
                >
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">{card.title}</div>
                  <div className={`text-base sm:text-lg lg:text-xl ${card.isBold ? 'font-bold' : 'font-semibold'} mb-1 flex-1 flex items-center`}>
                    {card.value}
                  </div>
                  <div className="text-xs text-gray-500">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}