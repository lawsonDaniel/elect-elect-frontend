'use client';
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";


export default function Navbar() {
    const [openNav, setOpenNav] = useState(false);

    const toggleNav = () => {
        setOpenNav(!openNav);
      };
      useEffect(() => {
          if (openNav) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = '';
          }
      
          return () => {
            document.body.style.overflow = '';
          };
        }, [openNav]);

    return(
        <div className="mt-2 absolute w-full ">
        <nav className=" fixed left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] h-18 bg-navBlue  flex  items-center justify-between rounded-md shadow-sm px-7 z-50">
           <img src="logo.png" alt="logo" className="w-12 h-12" />
            <ul className="hidden lg:flex text-[#D1D5DB]  text-lg justify-center list-none text items-center space-x-10  ">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Contact</li>
            <li className="cursor-pointer">Resource</li>
            <li className="cursor-pointer">Blog</li>
            </ul>
            <div className="flex items-center gap-3">
                <button className="bg-[#B3A273] text-white w-[4rem] h-10 md:w-24 md:h-10 rounded-md text-sm md:text-md cursor-pointer  ">Join Us</button>
                {openNav ? <X className=" lg:hidden cursor-pointer w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 " color="white" size={35} onClick={toggleNav}/> : 
                <Menu className=" lg:hidden cursor-pointer w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" color="white"  size={35} onClick={toggleNav}/>}
            </div>
        
            
        </nav>
        {openNav && (
        <div className="lg:hidden fixed left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] mt-[5rem] z-50 bg-navBlue p-4 m-auto transition-all duration-500 ease-in-out rounded-lg">
          <ul className="space-y-4 text-center text-greyText text-md md:text-2xl">
            <li  className="block py-2">Home</li>
            <li className="block py-2">About Us</li>
            <li className="block py-2">Contact</li>
            <li className="block py-2">Resources</li>
            <li className="block py-2">Blog</li>
          </ul>
        </div>
      )}
        </div>        
    );
}