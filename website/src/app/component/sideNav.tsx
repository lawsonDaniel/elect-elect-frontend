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
    className={`bg-[#EEEFF0] z-50 fixed h-[96vh] md:flex ml-4 mr-10 justify-center flex-col rounded-lg transition-all  duration-500 ease-in-out font-light md:translate-x-0 md:relative md:h-[96vh]  shadow-lg  ${
      isMobileOpen ? 'translate-x-0 opacity-100' : 'md:translate-x-0 md:opacity-100 -translate-x-full opacity-0 '
    }  ${poppins.className} ${
      isExpanded ? "w-64" : "w-[6.25rem]"
    } `}
  >
    {/* Logo and Toggle */}
    <div className="relative flex items-center p-4">
      <div className="flex items-center">
      <img src="logo.png" alt="logo" className={`w-12 h-12 ${isExpanded?'':'translate-x-1/4 transition-all duration-700 ease-in-out'}`} />
        
        {isExpanded && (
          <div className='flex flex-col '>
            <span className="ml-2 text-navBlue font-semibold">NIEEE</span>
            <span className='ml-2 text-sm text-[#6B7280]'>Student Dashboard</span>
          </div>
          
        )}
      </div>

      <button 
        onClick={toggleSidebar} 
        className="absolute -right-5  p-1 rounded-full bg-navBlue hover:bg-gray-300"
      >        
        <ChevronLeft
              color='white'
              className={`transition-transform duration-300 \
                ${isExpanded ? '' : 'rotate-180'}`}
            />
      </button>
    </div>

    {/* Menu Text */}
    <div className="text-sm text-[#6B7280] px-2 pt-2 pb-2 text-left">
      MENU
    </div>

    {/* Dashboard */}
    <Link href="/dashboard" className={` transition-all duration-1000 text-[#6B7280]  ease-in-out flex items-center px-4 py-2 hover:bg-gray-300 ${pathname === '/dashboard' ? 'bg-navBlue text-white' : ''} rounded-lg mx-2 ${isExpanded?'':'px-3'}`}>
    <div className="min-w-[24px] flex justify-center items-center">
    <Image src='/dashboard-square.png' 
      width={20} 
      height={20} 
      alt='dashboard'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out` }/>
    </div>
    
      
      <div
        className={`ml-3 overflow-hidden  transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Dashboard
      </div>
    </Link>

    {/* Chat Room */}
    <Link href="/chat" className={`transition-all duration-1000 ease-in-out flex items-center px-4  text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${isExpanded?'py-2':'px-3 py-0'}`}>
    <div className="min-w-[24px] flex justify-center items-center">
    <Image src='/messages.png' 
      width={22} 
      height={22} 
      alt='chat room'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
    </div>
    
      <div
        className={`ml-3 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Chat Room
      </div>
    </Link>

    {/* Academics Text */}
    
    <div className={` text-gray-500 px-2 pt-2 pb-2 text-left ${isExpanded? 'text-sm':'text-sm'}`}>
      ACADEMICS
    </div>

    {/* CGP Calculator */}
    <Link href="/cgp-calculator" className={`transition-all duration-1000 ease-in-out flex items-center px-4  text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${isExpanded?'py-2':'px-3 py-0'}`}>
    <div className="min-w-[24px] flex justify-center items-center">
    <Image src='/calculator.png' 
      width={22} 
      height={22} 
      alt='calculator'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
    </div>
    
      <div
        className={`ml-3 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        CGP Calculator
      </div>
    </Link>

    {/* Library */}
    <Link href="/library" className={`transition-all duration-1000 ease-in-out flex items-center px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${isExpanded?'':'px-3'}`}>
    <div className="min-w-[24px] flex justify-center items-center">
    <Image src='/book-01.png' 
      width={22} 
      height={22} 
      alt='library'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
    </div>
    
      <div
        className={`ml-3 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Library
      </div>
    </Link>

    {/* Payments */}
    <Link href="/payments" className={`transition-all duration-1000 ease-in-out flex items-center px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${isExpanded?'':'px-3'}`}>
    <div className="min-w-[24px] flex justify-center items-center">
    <Image src='/elements.png' 
      width={22} 
      height={22} 
      alt='payment'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
    </div>
   
      <div
        className={`ml-3 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Payments
      </div>
    </Link>

    {/* Bottom Actions */}
    <div className="mt-auto mb-4 ">
      {/* Settings */}
      <Link href="/settings" className={`transition-all duration-1000 ease-in-out flex items-center px-4 py-2 text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 ${isExpanded?'':'px-3'}`}>
      <div className="min-w-[24px] flex justify-center items-center">
      <Image src='/setting.png' 
      width={22} 
      height={22} 
      alt='payment'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
      </div>
     
        <div
        className={`ml-3 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Settings
      </div>
      </Link>

      {/* Log Out */}
      <Link href="/logout" className={`transition-all duration-1000 ease-in-out flex items-center px-4  text-[#6B7280] hover:bg-gray-300 rounded-lg mx-2 mt-1 ${isExpanded?'py-2':'px-3 py-0'}`}>
      <div className="min-w-[24px] flex justify-center items-center">
      <Image src='/logout.png' 
      width={22} 
      height={22} 
      alt='payment'
      className={`${pathname? 'text-white':'text-navBlue'} ${isExpanded?'':'ml-3 '}transition-all duration-700 ease-in-out`}/>
      </div>
      
        <div
        className={`ml-3 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
        }`}
      >
        Log Out
      </div>
      </Link>
    </div>
    
  </div>
  {/* <div 
    onClick={() => setIsMobileOpen(!isMobileOpen)} 
    className={`md:hidden fixed top-4 left-4 z-40  text-[#6B7280] ${isMobileOpen? 'hidden':''}`}>
      <Menu  size={40} className=' bg-white p-2 border-[1px] text-[#6B7280]  rounded-md border-[#6B7280] '/>
  </div>
  {isMobileOpen && (
  <div 
    onClick={() => setIsMobileOpen(false)} 
    className="fixed inset-0 bg-transparent bg-opacity-90 z-10 md:hidden"
  ></div>
)} */}
    </>
  )
}

