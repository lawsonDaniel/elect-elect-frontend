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
      
      <div className="flex flex-col mt-4 w-full">
        {/* Your dashboard content here */}
        <DashHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
        <h1 className={`text-2xl  mt-10 font-semibold ${spaceGrotesk.className} `}>Welcome Back, Enoch</h1>
        {/* Rest of your dashboard components */}
      </div>
    </div>
  );
}