'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Menu} from 'lucide-react';
import {Poppins} from "next/font/google"
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type SideNavProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', 
  display: 'swap',            
});

export default function SideNav({ isMobileOpen, setIsMobileOpen }: SideNavProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const pathname = usePathname();

    const toggleSidebar = () => {
      setIsExpanded(!isExpanded);
    };

  return (
    <>
    <div 
    className={`bg-[#EEEFF0] z-50 fixed h-[96vh] md:flex ml-2 sm:ml-4 mr-4 sm:mr-10 justify-center flex-col rounded-lg transition-all duration-500 ease-in-out font-light md:translate-x-0 md:relative md:h-[96vh] shadow-lg ${
      isMobileOpen ? 'translate-x-0 opacity-100' : 'md:translate-x-0 md:opacity-100 -translate-x-full opacity-0'
    } ${poppins.className} ${
      isExpanded ? "w-56 sm:w-64" : "w-20 sm:w-[6.25rem]"
    }`}
  >
    {/* Logo and Toggle */}
    <div className="relative flex items-center p-3 sm:p-4">
      <div className="flex items-center">
      <Image 
        src="/logo.png" 
        width={48}
        height={48}
        alt="Logo" 
        className={`w-8 h-8 sm:w-12 sm:h-12 ${isExpanded?'':'translate-x-1/4 transition-all duration-700 ease-in-out'}`} 
      />
        
        {isExpanded && (
          <div className='flex flex-col'>
            <span className="ml-2 text-navBlue font-semibold text-sm sm:text-base">NIEEE</span>
            <span className='ml-2 text-xs sm:text-sm text-[#6B7280]'>Student Dashboard</span>
          </div>
        )}
      </div>

      {/* Toggle button - now visible on mobile too */}
      <button 
        onClick={toggleSidebar} 
        className="absolute -right-3 sm:-right-5 p-1 rounded-full bg-navBlue hover:bg-gray-300"
      >        
        <ChevronLeft
              color='white'
              size={16}
              className={`sm:w-5 sm:h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
            />
      </button>

      
    </div>

    {/* Menu Text */}
    <div className={`text-xs sm:text-sm text-[#6B7280] px-2 pt-2 pb-2 text-left ${isExpanded ? '' : 'text-center'}`}>
      {isExpanded ?'MENU' : 'MENU'}
    </div>

    {/* Navigation Links */}
    <div className="flex-1 overflow-y-auto">
      {/* Dashboard */}
      <Link href="/dashboard" className={`transition-all duration-1000 text-[#6B7280] ease-in-out flex items-center px-3 sm:px-4 py-2 hover:bg-gray-300 ${pathname === '/dashboard' ? 'bg-navBlue text-white' : ''} rounded-lg mx-2 ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/dashboard-square.png' 
            width={16} 
            height={16} 
            alt='dashboard'
            className={`sm:w-5 sm:h-5  ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
        
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Dashboard
        </div>
      </Link>

      {/* Chat Room */}
      <Link href="/dashboard/chat" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${pathname === '/dashboard/chat' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/messages.png' 
            width={16} 
            height={16} 
            alt='chat room'
            className={`sm:w-5 sm:h-5  ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
        
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-500 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Chat Room
        </div>
      </Link>

      {/* Academics Text */}
      <div className={`text-gray-500 px-2 pt-2 pb-2 text-left text-xs sm:text-sm ${isExpanded ? '' : 'text-center'}`}>
        {isExpanded ? 'ACADEMICS' : 'ACADEMICS'}
      </div>

      {/* CGP Calculator */}
      <Link href="dashboard/gpaCalculator" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${pathname === 'dashboard/gpaCalculator' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/calculator.png' 
            width={16} 
            height={16} 
            alt='calculator'
            className={`sm:w-5 sm:h-5  ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
        
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          CGP Calculator
        </div>
      </Link>

      {/* Library */}
      <Link href="/dashboard/MiniLibrary" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${pathname === '/dashboard/MiniLibrary' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/book-01.png' 
            width={16} 
            height={16} 
            alt='library'
            className={`sm:w-5 sm:h-5  ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
        
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Library
        </div>
      </Link>

      {/* Payments */}
      <Link href="/dashboard/payment" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${pathname === '/dashboard/payment' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/elements.png' 
            width={16} 
            height={16} 
            alt='payment'
            className={`sm:w-5 sm:h-5  ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
       
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Payments
        </div>
      </Link>
    </div>

    {/* Bottom Actions */}
    <div className="mt-auto mb-4">
      {/* Settings */}
      <Link href="/dashboard/settings" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 ${pathname === '/dashboard/settings' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/setting.png' 
            width={16} 
            height={16} 
            alt='settings'
            className={`sm:w-5 sm:h-5 ${pathname === '/dashboard/settings' ? 'brightness-0 invert' : ''} ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
       
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Settings
        </div>
      </Link>

      {/* Log Out */}
      <Link href="/logout" className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${pathname === '/logout' ? 'bg-navBlue text-white' : ''} ${isExpanded?'':'justify-center'}`}>
        <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
          <Image src='/logout.png' 
            width={16} 
            height={16} 
            alt='logout'
            className={`sm:w-5 sm:h-5 ${pathname === '/logout' ? 'brightness-0 invert' : ''} ${isExpanded?'':'ml-0'} transition-all duration-700 ease-in-out`}
          />
        </div>
        
        <div
          className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
            isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
          }`}
        >
          Log Out
        </div>
      </Link>
    </div>
  </div>
    </>
  )
}