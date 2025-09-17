'use client';
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function Navbar() {
    const [openNav, setOpenNav] = useState(false);
    const pathname = usePathname();
    const { darkMode, toggleDarkMode } = useDarkMode();

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

    const handleToggle = () => {
        toggleDarkMode();
    };

    return(
        <div className="mt-2 absolute w-full">
            <nav className="fixed left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] h-18 bg-navBlue dark:bg-[#101E27] flex items-center justify-between rounded-md shadow-sm px-7 z-50">
                <img src="logo.png" alt="logo" className="w-12 h-12" />
                <ul className="hidden lg:flex text-[#D1D5DB] text-lg justify-center list-none text items-center space-x-10">
                    <Link href="/">
                        <li className={`cursor-pointer hover:text-white ${pathname === '/' ? 'text-gold font-semibold' : ''}`}>Home</li>
                    </Link>

                    <Link href="/about-us">
                        <li className={`cursor-pointer hover:text-white ${pathname === '/about-us' ? 'text-gold font-semibold' : ''}`}>About Us</li>
                    </Link>

                    <Link href="/contact-us">
                        <li className={`cursor-pointer hover:text-white ${pathname === '/contact-us' ? 'text-gold font-semibold' : ''}`}>Contact</li>
                    </Link>

                    <Link href="/blog">
                        <li className={`cursor-pointer hover:text-white ${pathname === '/blog' ? 'text-gold font-semibold' : ''}`}>Blog</li>
                    </Link>
                </ul>
                
                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <div className={`hidden md:flex items-center gap-1 p-1 bg-transparent rounded-full border transition-colors duration-900  ${darkMode? 'border-[#EDF3F8]':'border-[#6B7280]'} `}>
                        <button 
                            onClick={handleToggle}
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                                !darkMode 
                                    ? 'bg-[#EDF3F8] text-navBlue shadow-md scale-105' 
                                    : 'text-[#EDF3F8] hover:bg-gray-700/30 '
                            }`}
                        >
                            <Sun size={14} className="transition-transform duration-1000" />
                        </button>
                        <button 
                            onClick={handleToggle}
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                                darkMode 
                                    ? 'bg-gray-600 text-[#EDF3F8] shadow-md scale-105' 
                                    : 'text-[#EDF3F8] hover:bg-gray-700/30 '
                            }`}
                        >
                            <Moon size={14} className="transition-transform duration-1000" />
                        </button>
                    </div>
                    
                    <Link href="/login">
                        <button className="bg-[#B3A273] text-white w-[4rem] h-10 md:w-24 md:h-10 rounded-md text-sm md:text-md cursor-pointer">Login</button>
                    </Link>
                    {openNav ? 
                        <X className="lg:hidden cursor-pointer w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" color="white" size={35} onClick={toggleNav}/> : 
                        <Menu className="lg:hidden cursor-pointer w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" color="white" size={35} onClick={toggleNav}/>
                    }
                </div>
            </nav>
            
            {openNav && (
                <>
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={toggleNav}></div>
                    <div className="lg:hidden fixed left-1/2 -translate-x-1/2 w-[91%] md:w-[85%] mt-[5rem] z-50 bg-navBlue dark:bg-[#101E27] p-6 m-auto transition-all duration-500 ease-in-out rounded-lg">
                        <ul className="space-y-3 text-center text-greyText text-md md:text-2xl">
                            <Link href="/">
                                <li className={`cursor-pointer hover:text-white ${pathname === '/' ? 'text-gold font-semibold' : ''}`}>Home</li>
                            </Link>

                            <Link href="/about-us">
                                <li className={`cursor-pointer py-2 hover:text-white ${pathname === '/about-us' ? 'text-gold font-semibold' : ''}`}>About Us</li>
                            </Link>
                            
                            <Link href="/contact-us">
                                <li className={`cursor-pointer hover:text-white ${pathname === '/contact-us' ? 'text-gold font-semibold' : ''}`}>Contact</li>
                            </Link>
                            
                            <Link href="/blog">
                                <li className={`cursor-pointer hover:text-white ${pathname === '/blog' ? 'text-gold font-semibold' : ''}`}>Blog</li>
                            </Link>
                            
                            {/* Mobile Dark Mode Toggle */}
                            <li className="flex justify-center items-center pt-4">
                                <div className={`hidden md:flex items-center gap-1 p-1 bg-transparent rounded-full border transition-colors duration-900  ${darkMode? 'border-[#EDF3F8]':'border-[#6B7280]'} `}>
                                    <button 
                                        onClick={handleToggle}
                                        className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                                            !darkMode 
                                                ? 'bg-[#EDF3F8] text-navBlue shadow-md scale-105' 
                                                : 'text-[#EDF3F8] hover:bg-gray-700/30 '
                                        }`}
                                    >
                                        <Sun size={14} className="transition-transform duration-1000" />
                                    </button>
                                    <button 
                                        onClick={handleToggle}
                                        className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                                            darkMode 
                                                ? 'bg-gray-600 text-[#EDF3F8] shadow-md scale-105' 
                                                : 'text-[#EDF3F8] hover:bg-gray-700/30 '
                                        }`}
                                    >
                                        <Moon size={14} className="transition-transform duration-1000" />
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>        
    );
}