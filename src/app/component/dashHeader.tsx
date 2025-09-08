'use client';

import { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Search } from 'lucide-react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import endPoints from '@/utils/endpoints.class';
import { useDarkMode } from '@/contexts/DarkModeContext';
import NotificationDropdown from './NotificationDropdown';

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
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await endPoints.getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-center justify-between w-full mb-5 py-3 px-4 transition-colors duration-300 ${poppins.className} ${
        darkMode ? 'bg-[#0A1218] text-[#E2E8F0]' : 'bg-white text-gray-900'
      }`}
      role="banner"
    >
      {/* Left side: menu + search */}
      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 flex-1 min-w-0 w-full">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden z-40 flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'bg-[#1E2A38] text-[#E2E8F0] hover:bg-[#2A3744]'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isMobileOpen ? 'hidden' : ''}`}
          aria-label="Toggle mobile menu"
        >
          <Menu size={28} />
        </button>

        {/* Mobile: Show only search icon */}
        <div className="sm:hidden flex-shrink-0">
          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] hover:bg-[#2A3744]'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
            } border`}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Desktop: Show full search bar */}
        <div className="hidden sm:block relative w-full max-w-sm md:max-w-md lg:w-[32rem] lg:max-w-none">
          <Search
            size={20}
            className={`absolute top-1/2 -translate-y-1/2 left-3 ${
              darkMode ? 'text-[#A0B3C6]' : 'text-gray-500'
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search for anything..."
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] focus:ring-[#4B91F1] placeholder-[#A0B3C6]'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-[#2563EB] placeholder-gray-400'
            }`}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right side: theme toggle + notifications + profile + staff links */}
      <div className="flex items-center gap-3 sm:gap-5 mt-4 sm:mt-0">
        <div
          className={`flex items-center gap-1 p-1 rounded-full border transition-colors duration-200 ${
            darkMode ? 'border-[#2A3744] bg-[#1E2A38]' : 'border-gray-200 bg-gray-50'
          }`}
          role="group"
          aria-label="Theme toggle"
        >
          <button
            onClick={handleToggle}
            className={`p-1.5 rounded-full transition-colors duration-200 ${
              !darkMode
                ? 'bg-[#2563EB] text-white'
                : 'text-[#A0B3C6] hover:bg-[#2A3744]'
            }`}
            aria-label="Switch to light mode"
            aria-pressed={!darkMode}
          >
            <Sun size={18} />
          </button>
          <button
            onClick={handleToggle}
            className={`p-1.5 rounded-full transition-colors duration-200 ${
              darkMode
                ? 'bg-[#2563EB] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Switch to dark mode"
            aria-pressed={darkMode}
          >
            <Moon size={18} />
          </button>
        </div>

        <NotificationDropdown />

        <div className="flex flex-row items-center gap-2">
          <Image
            src="/DrTijani.png"
            width={40}
            height={40}
            alt="Profile Picture"
            className="rounded-full border-2 border-[#2563EB]"
          />
          <div className="hidden md:flex flex-col">
            <p
              className={`font-semibold text-sm ${
                darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'
              }`}
            >
              {profile?.firstName} {profile?.surname || 'John Doe'}
            </p>
            <p
              className={`text-xs capitalize ${
                darkMode ? 'text-[#A0B3C6]' : 'text-gray-500'
              }`}
            >
              {profile?.userType || 'student'}
            </p>
          </div>
        </div>

        {/* Staff-specific navigation links */}
        {profile?.userType === 'staff' && (
          <div className="flex gap-3 sm:gap-4">
            <Link
              href="/dashboard/announcements/create"
              className={`text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'text-[#E2E8F0] hover:text-[#4B91F1]'
                  : 'text-gray-700 hover:text-[#2563EB]'
              }`}
            >
              Create Announcement
            </Link>
            <Link
              href="/dashboard/calendar/create"
              className={`text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'text-[#E2E8F0] hover:text-[#4B91F1]'
                  : 'text-gray-700 hover:text-[#2563EB]'
              }`}
            >
              Create Calendar Event
            </Link>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
}