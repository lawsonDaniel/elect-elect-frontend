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
      className={`relative flex items-center justify-between w-full mb-5 py-3 px-4 transition-colors duration-300 ${poppins.className} ${
        darkMode ? 'bg-[#0A1218] text-[#E2E8F0]' : 'bg-white text-gray-900'
      }`}
      role="banner"
    >
      {/* Left side: Mobile menu button (only visible on mobile) */}
      <div className="flex items-center flex-shrink-0">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden z-40 flex-shrink-0 p-2 rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'bg-[#1E2A38] text-[#E2E8F0] hover:bg-[#2A3744]'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isMobileOpen ? 'hidden' : ''}`}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Center: Staff navigation links (hidden on mobile) */}
      {profile?.userType === 'staff' && (
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/dashboard/announcements/create"
            className={`text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-opacity-10 ${
              darkMode
                ? 'text-[#E2E8F0] hover:text-[#4B91F1] hover:bg-[#4B91F1]'
                : 'text-gray-700 hover:text-[#2563EB] hover:bg-[#2563EB]'
            }`}
          >
            Create Announcement
          </Link>
          <Link
            href="/dashboard/calendar/create"
            className={`text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 hover:bg-opacity-10 ${
              darkMode
                ? 'text-[#E2E8F0] hover:text-[#4B91F1] hover:bg-[#4B91F1]'
                : 'text-gray-700 hover:text-[#2563EB] hover:bg-[#2563EB]'
            }`}
          >
            Create Event
          </Link>
        </div>
      )}

      {/* Right side: Theme toggle + notifications + profile */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Theme Toggle */}
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
            <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />
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
            <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Section */}
        <div className="flex items-center gap-2 ml-1">
          <Image
            src="/placeholderIMG.jpg"
            width={32}
            height={32}
            alt="Profile Picture"
            className="rounded-full border-2 border-[#2563EB] sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px]"
          />
          
          {/* Profile text - responsive visibility */}
          <div className="hidden sm:flex flex-col min-w-0">
            <p
              className={`font-semibold text-sm truncate max-w-[120px] lg:max-w-[160px] ${
                darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'
              }`}
              title={`${profile?.firstName || 'John'} ${profile?.surname || 'Doe'}`}
            >
              {profile?.firstName || 'John'} {profile?.surname || 'Doe'}
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

        {/* Mobile Staff Navigation - Dropdown menu for smaller screens */}
        {profile?.userType === 'staff' && (
          <div className="lg:hidden relative group">
            <button
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#1E2A38] text-[#E2E8F0] hover:bg-[#2A3744]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Staff actions menu"
            >
              <Menu size={18} />
            </button>
            
            {/* Dropdown menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                darkMode
                  ? 'bg-[#1E2A38] border-[#2A3744]'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="py-2">
                <Link
                  href="/dashboard/announcements/create"
                  className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                    darkMode
                      ? 'text-[#E2E8F0] hover:bg-[#2A3744] hover:text-[#4B91F1]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#2563EB]'
                  }`}
                >
                  Create Announcement
                </Link>
                <Link
                  href="/dashboard/calendar/create"
                  className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                    darkMode
                      ? 'text-[#E2E8F0] hover:bg-[#2A3744] hover:text-[#4B91F1]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#2563EB]'
                  }`}
                >
                  Create Calendar Event
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
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