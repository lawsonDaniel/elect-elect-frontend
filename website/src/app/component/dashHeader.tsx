'use client';
import { Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";

type DashboardHeaderProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

export default function DashHeader({ isMobileOpen, setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <div className="relative flex items-center justify-between w-full px-4 py-2">
      {/* Left side: menu + search */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className={`md:hidden z-40 text-[#6B7280] ${isMobileOpen ? 'hidden' : ''}`}
        >
          <Menu size={40} className='bg-white p-2 border text-[#6B7280] rounded-md border-[#6B7280]' />
        </div>
        <div className="relative w-[31.5rem]">
          <Image 
            src='/search.png' 
            width={24} 
            height={24} 
            alt="search" 
            className="absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input 
            type="search"
            placeholder="Search for Anything" 
            className="w-full text-[#6B7280] pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Right side: toggle + notification */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 p-1 rounded-full border">
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#6B7280] shadow">
            <Sun size={18} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#6B7280]">
            <Moon size={18} />
          </button>
        </div>
        <Image src='/notification.png' width={24} height={24} alt="notification" />
      </div>

      {/* overlay for mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-transparent z-10 md:hidden"
        ></div>
      )}
    </div>
  )
}
