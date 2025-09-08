// src/components/DashboardHeader.tsx
'use client';

import { Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useDarkMode } from '@/contexts/DarkModeContext';

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});

type DashboardHeaderProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

export default function DashHeader({ isMobileOpen, setIsMobileOpen }: DashboardHeaderProps) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <div className={`relative flex items-center justify-between w-full mb-5 py-2 ${poppins.className}`}>
      {/* Left side: menu + search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 flex-1 min-w-0">
        <div
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden z-40 text-[#6B7280] flex-shrink-0 ${isMobileOpen ? 'hidden' : ''}`}
        >
          <Menu size={40} className={`p-2 border text-[#6B7280]   rounded-md ${darkMode? 'bg-[#070E12] border-[#EDF3F8]':'bg-white border-[#6B7280] '} `} />
        </div>
        
       
        
      </div>

      {/* Right side: toggle + notification */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4 flex-shrink-0">
        <div className={`flex items-center gap-1 sm:gap-2 p-1 rounded-full border ${darkMode? 'border-[#EDF3F8]':'[#101E27]'} `}>
          <button 
            onClick={handleToggle}
            className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
              !darkMode 
                ? 'bg-[#101E27] text-[#EDF3F8] shadow' 
                : 'text-[#6B7280] dark:text-[#EDF3F8]'
            }`}
          >
            <Sun size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button 
            onClick={handleToggle}
            className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
              darkMode 
                ? 'bg-gray-600 dark:text-[#EDF3F8] shadow' 
                : 'text-[#101E27] '
            }`}
          >
            <Moon size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        
        <Image 
          src='/notification.png' 
          width={20} 
          height={20} 
          alt="notification" 
          className={`sm:w-6 sm:h-6 flex-shrink-0 ${darkMode && 'invert'}`}
        />
      </div>
      
      <div className="flex flex-row ml-2 mr-2">
        <Image 
          src='/DrTijani.png' 
          width={48} 
          height={48} 
          alt="Profile Picture" 
          className="rounded-full"
        />
        <div className="hidden md:flex flex-col ml-3 text-[#101E27] dark:text-[#EDF3F8]">
          <p className={`font-bold ${darkMode? 'text-[#FFFFFF]':'text-[#101E27]'}`}>John Doe</p>
          <p className={` ${darkMode? 'text-[#FFFFFF]':'text-[#101E27]'}`}>student</p>
        </div>
      </div>

      {/* overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-transparent z-10 md:hidden"
        ></div>
      )}
    </div>
  );
}