'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDarkMode } from '@/contexts/DarkModeContext';
import endPoints from '@/utils/endpoints.class';

type SideNavProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

export default function SideNav({ isMobileOpen }: SideNavProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userRole, setUserRole] = useState('student');
  const [error, setError] = useState<any>(null);
  const { darkMode } = useDarkMode();
  const pathname = usePathname();
  const router = useRouter();

  // Fetch user profile to determine user type
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await endPoints.getUserProfile();
        setUserRole(profile.userType === 'staff' ? 'lecturer' : 'student');
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user profile');
        setUserRole('student');
      }
    };
    fetchUserProfile();
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle logout functionality
// Handle logout functionality
const handleLogout = (e: React.MouseEvent) => {
  e.preventDefault();
  
  try {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
    });

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Force redirect even if logout process fails
    router.push('/login');
  }
};
  return (
    <div
      className={`z-50 fixed h-[96vh] md:flex ml-2 sm:ml-4 mr-4 sm:mr-10 justify-center flex-col rounded-lg transition-all duration-500 ease-in-out font-light md:translate-x-0 md:relative md:h-[96vh] shadow-lg 
      ${isMobileOpen ? 'translate-x-0 opacity-100' : 'md:translate-x-0 md:opacity-100 -translate-x-full opacity-0'}  
      ${isExpanded ? 'w-56 sm:w-64' : 'w-20 sm:w-[6.25rem]'} 
      ${darkMode ? 'bg-[#070E12] border border-[#EEEFF0]' : 'bg-[#EEEFF0]'}`}
    >
      {/* Logo and Toggle */}
      <div className="relative flex items-center p-3 sm:p-4">
        <div className="flex items-center">
          <Link href="/"><Image
            src="/logo.png"
            width={48}
            height={48}
            alt="Logo"
            className={`w-8 h-8 sm:w-12 sm:h-12 ${isExpanded ? '' : 'translate-x-1/4 transition-all duration-700 ease-in-out'}`}
          /> </Link>
          {isExpanded && (
            <div className="flex flex-col">
              <span
                className={`ml-2 font-semibold text-sm sm:text-base ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-navBlue'
                }`}
              >
                NIEEE
              </span>
              <span
                className={`ml-2 text-xs sm:text-sm ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                }`}
              >
                {userRole === 'lecturer' ? 'Lecturer Dashboard' : 'Student Dashboard'}
              </span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 sm:-right-5 p-1 rounded-full bg-navBlue hover:bg-gray-300"
        >
          <ChevronLeft
            color="white"
            size={16}
            className={`sm:w-5 sm:h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/* Menu Text */}
      <div
        className={`text-xs sm:text-sm px-2 pt-2 pb-2 text-left ${isExpanded ? '' : 'text-center'} ${
          darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
        }`}
      >
        {isExpanded ? 'MENU' : 'MENU'}
      </div>

      {/* Navigation Links */}
      <div className="">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
            pathname === '/dashboard'
              ? 'bg-navBlue text-white'
              : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/dashboard-square.png"
              width={16}
              height={16}
              alt="dashboard"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                pathname === '/dashboard' || darkMode ? '' : 'brightness-0 opacity-60'
              }`}
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
        <Link
          href="/dashboard/chat"
          className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
            pathname === '/dashboard/chat'
              ? 'bg-navBlue text-white'
              : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/messages.png"
              width={16}
              height={16}
              alt="chat room"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                pathname === '/dashboard/chat' && darkMode ? 'brightness-0 invert' : ''
              }`}
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
        <div
          className={`px-2 pt-2 pb-2 text-left text-xs sm:text-sm ${isExpanded ? '' : 'text-center'} ${
            darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'
          }`}
        >
          {isExpanded ? 'ACADEMICS' : 'ACADEMICS'}
        </div>

        {/* CGP Calculator */}
        <Link
          href="/dashboard/gpaCalculator"
          className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
            pathname === '/dashboard/gpaCalculator'
              ? 'bg-navBlue text-white'
              : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/calculator.png"
              width={16}
              height={16}
              alt="calculator"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                pathname === '/dashboard/gpaCalculator' && darkMode ? 'brightness-0 invert' : ''
              }`}
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
        <Link
          href="/dashboard/mini-library"
          className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
            pathname === '/dashboard/mini-library'
              ? 'bg-navBlue text-white'
              : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/book-01.png"
              width={16}
              height={16}
              alt="library"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                pathname === '/dashboard/mini-library' && darkMode ? 'brightness-0 invert' : ''
              }`}
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

        {/* Payments - Only show for students */}
        {userRole === 'student' && (
          <Link
            href="/dashboard/payment"
            className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
              pathname === '/dashboard/payment'
                ? 'bg-navBlue text-white'
                : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
            } ${isExpanded ? '' : 'justify-center'}`}
          >
            <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
              <Image
                src="/elements.png"
                width={16}
                height={16}
                alt="payment"
                className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                  pathname === '/dashboard/payment' && darkMode ? 'brightness-0 invert' : ''
                }`}
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
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto mb-4">
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={`transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 ${
            pathname === '/dashboard/settings'
              ? 'bg-navBlue text-white'
              : `${darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'}`
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/setting.png"
              width={16}
              height={16}
              alt="settings"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out ${
                pathname === '/dashboard/settings' && darkMode ? 'brightness-0 invert' : ''
              }`}
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
        <button
          onClick={handleLogout}
          className={`w-full transition-all duration-1000 ease-in-out flex items-center px-3 sm:px-4 py-2 rounded-lg mx-2 mt-1 ${
            darkMode ? 'text-[#EDF3F8] hover:bg-[#101E27]' : 'text-[#6B7280] hover:bg-gray-300'
          } ${isExpanded ? '' : 'justify-center'}`}
        >
          <div className="min-w-[20px] sm:min-w-[24px] flex justify-center items-center">
            <Image
              src="/logout.png"
              width={16}
              height={16}
              alt="logout"
              className={`sm:w-5 sm:h-5 ${isExpanded ? '' : 'ml-0'} transition-all duration-700 ease-in-out`}
            />
          </div>
          <div
            className={`ml-2 sm:ml-3 overflow-hidden text-sm sm:text-base transition-all duration-700 ease-in-out ${
              isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
            }`}
          >
            Log Out
          </div>
        </button>
      </div>
    </div>
  );
}