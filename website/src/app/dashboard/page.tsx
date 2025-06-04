'use client';
import { useState } from 'react';
import Sidenav from '../component/sideNav';
import DashHeader from '../component/dashHeader';
import {Poppins, Space_Grotesk,} from "next/font/google"


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
    <div className={`flex `}>
      <div className='h-screen flex items-center justify-start '>
      <Sidenav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      </div>
      
      <div className="flex flex-col mt-1 w-full pr-7">
        {/* Your dashboard content here */}
        <DashHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
        
        {/* Rest of your dashboard components */}
        <div>
          <h1 className={`text-2xl   font-semibold ${spaceGrotesk.className} `}>Welcome Back, Enoch</h1>
        </div>
        
        
      </div>
    </div>
  );
}