'use client';
import { useState } from 'react';
import SideNav from '@/app/component/sideNav';
import DashHeader from '@/app/component/dashHeader';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});



export default function Chat() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className='h-screen flex items-center justify-start'>
        <SideNav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      </div>
      
      <div className="flex flex-col mt-1 w-full px-3 lg:pr-7 overflow-y-auto h-screen">
        <DashHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
        
        {/* Page Content Area */}
        <div className={`w-full ${poppins.className}`}>
          {/* Your page content goes here */}
          
        </div>
      </div>
    </div>
  );
}