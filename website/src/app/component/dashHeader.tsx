'use client';
import { Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import {Poppins} from "next/font/google"

type DashboardHeaderProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // optional: to use as a CSS variable
  display: 'swap',            
});

export default function DashHeader({ isMobileOpen, setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <div className={`relative flex items-center justify-between w-full mb-5 py-2 ${poppins.className}`}>
      {/* Left side: menu + search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 flex-1 min-w-0">
        <div
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden z-40 text-[#6B7280] flex-shrink-0 ${isMobileOpen ? 'hidden' : ''}`}
        >
          <Menu size={40} className='bg-white p-2 border text-[#6B7280] rounded-md border-[#6B7280]' />
        </div>
        
        {/* Mobile: Show only search icon */}
        <div className="sm:hidden flex-shrink-0">
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-[#6B7280] rounded-md">
            <Image
              src='/search.png'
              width={20}
              height={20}
              alt="search"
            />
          </button>
        </div>

        {/* Desktop: Show full search bar */}
        <div className="hidden sm:block relative w-full max-w-sm md:max-w-md lg:w-[31.5rem] lg:max-w-none">
          <Image
            src='/search.png'
            width={24}
            height={24}
            alt="search"
            className="absolute top-1/2 -translate-y-1/2 left-3 flex-shrink-0"
          />
          <input
            type="search"
            placeholder="Search for Anything"
            className="w-full text-[#6B7280] pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Right side: toggle + notification */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4 flex-shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-full border">
          <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[#6B7280] shadow">
            <Sun size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[#6B7280]">
            <Moon size={14} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        <Image 
          src='/notification.png' 
          width={20} 
          height={20} 
          alt="notification" 
          className="sm:w-6 sm:h-6 flex-shrink-0"
        />
      </div>
      <div className="flex flex-row ml-2 mr-2">
        <Image 
          src='/DrTijani.png' 
          width={48} 
          height={48} 
          alt="Profile Picture" 
          className="rounded-full "
        />
        <div className="hidden md:flex flex-col ml-3">
          <p className="font-bold">John Doe</p>
          <p>student</p>
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