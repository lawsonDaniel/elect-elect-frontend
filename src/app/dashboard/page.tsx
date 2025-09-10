'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Library, Calculator, CreditCard, RefreshCw, Printer } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useDarkMode } from '@/contexts/DarkModeContext';
import endPoints from '@/utils/endpoints.class';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function Dashboard() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(0);
  const { darkMode } = useDarkMode();
  const [announcements, setAnnouncements] = useState<any>([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [profile, setProfile] = useState<any>(null);
  const [cards, setCards] = useState([]);

  const quickActions = [
    { icon: MessageCircle, label: 'Open Chat Space', href: 'dashboard/chat' },
    { icon: Library, label: 'Go to Mini Library', href: 'dashboard/mini-library' },
    { icon: Calculator, label: 'Use CGP Calculator', href: 'dashboard/gpaCalculator' },
    { icon: CreditCard, label: 'Make a Payment', href: 'dashboard/payment' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ann = await endPoints.getAnnouncements();
        setAnnouncements(ann);
        const cal = await endPoints.getCalendarEvents();
        setCalendarEvents(cal);
        const prof = await endPoints.getUserProfile();
        setProfile(prof);
        const stats = await endPoints.getDashboardStats();
        setCards(stats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev:any) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev:any) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
<<<<<<< HEAD
    <div className={`p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-[#0A1218]' : 'bg-gray-100'} transition-colors duration-200 ${poppins.className}`}>
      <h1
        className={`text-xl sm:text-2xl font-semibold mb-2 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'}`}
        role="heading"
        aria-level={1}
      >
        Welcome Back, {profile?.firstName || 'John'}
=======
    <div className="p-4 sm:p-6 lg:p-4">
      <h1 className={`text-xl sm:text-2xl font-semibold  font-grotesk mb-2 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
        Welcome Back, John
>>>>>>> 1f0ed8c93bcb39bbeb4e995be7bf3f875e3f345e
      </h1>

      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <p className={`lg:w-1/2 flex-shrink-0 text-sm sm:text-base ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
          Here&apos;s your current academic and departmental summary.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 lg:w-1/2 lg:justify-end">
          <button
            className={`flex px-3 py-2 text-sm gap-2 items-center justify-center rounded-lg border transition-colors duration-200 ${
              darkMode
                ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] hover:bg-[#2A3744]'
                : 'bg-white border-[#2563EB] text-[#2563EB] hover:bg-gray-50'
            }`}
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={16} />
            <span className="truncate">Refresh Dashboard</span>
          </button>

          <button
            className={`flex px-3 py-2 text-sm text-white items-center justify-center rounded-lg gap-2 transition-colors duration-200 ${
              darkMode ? 'bg-[#4B91F1] hover:bg-[#3B82F6]' : 'bg-[#2563EB] hover:bg-[#1E40AF]'
            }`}
            aria-label="Print receipt"
          >
            <Printer size={16} />
            <span className="truncate">Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 mb-8">
        {/* Profile Card */}
        <div
          className={`p-6 w-full lg:w-[31.4rem] sm:h-80 md:h-[20.75rem] rounded-lg flex-shrink-0 order-1 transition-colors duration-200 ${
            darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-[#2563EB] border-[#1E40AF]'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`} role="heading" aria-level={2}>
              Your Profile
            </h2>
            <button
              className={`text-sm transition-colors duration-200 ${
                darkMode ? 'text-[#A0B3C6] hover:text-[#E2E8F0]' : 'text-gray-200 hover:text-white'
              }`}
              aria-label="View full profile"
            >
              See More
            </button></Link>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/DrTijani.png"
              width={48}
              height={48}
              alt="Profile Picture"
              className="rounded-full border-2 border-[#E2E8F0]"
            />
            <div>
              <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`}>
                {profile?.firstName} {profile?.surname}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-200'}`}>
                {profile?.userType || 'Student'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-200'}`}>
                  {profile?.userType === 'staff' ? 'Staff ID' : 'Matric Number'}:
                </span>
                <span className={`text-sm ml-1 ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`}>
                  {profile?.mattNumber || profile?.staffId || 'UJ/2018/EL/0001'}
                </span>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-200'}`}>
                  Email:
                </span>
                <span className={`text-sm ml-1 ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`}>
                  {profile?.schoolEmail || 'enoch@gmail.com'}
                </span>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-200'}`}>
                  Faculty:
                </span>
                <span className={`text-sm ml-1 ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`}>
                  {profile?.faculty || 'Engineering'}
                </span>
              </div>
              <div>
                <span className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-200'}`}>
                  Level:
                </span>
                <span className={`text-sm ml-1 ${darkMode ? 'text-[#E2E8F0]' : 'text-white'}`}>
                  {profile?.level || '500'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 order-1 xl:order-2">
          {cards.map((card:any, idx) => (
            <div
              key={idx}
              className={`border-2 ${card.border || 'border-[#2563EB]'} rounded-lg p-3 sm:p-4 shadow-sm min-h-[120px] sm:min-h-[140px] flex flex-col justify-between transition-colors duration-200 ${
                darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} mb-1`}>
                {card.title}
              </div>
              <div
                className={`text-base sm:text-lg lg:text-xl ${card.isBold ? 'font-bold' : 'font-semibold'} mb-1 flex-1 flex items-center ${
                  darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'
                }`}
              >
                {card.value}
              </div>
              <div className={`text-xs ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-500'}`}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Dashboard Components Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions and Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div
            className={`rounded-lg shadow-sm border p-6 transition-colors duration-200 ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-white border-gray-200'
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'}`}
              role="heading"
              aria-level={2}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-200 text-left ${
                    darkMode
                      ? 'border-[#2A3744] text-[#E2E8F0] hover:bg-[#2A3744] hover:border-[#4B91F1]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#2563EB]'
                  }`}
                  role="menuitem"
                >
                  <action.icon
                    className={`w-5 h-5 ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div
            className={`rounded-lg shadow-sm border p-6 transition-colors duration-200 ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-white border-gray-200'
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'}`}
              role="heading"
              aria-level={2}
            >
              Announcements
            </h2>
            <div className="relative">
              {announcements.length > 0 ? (
                <div className="mb-4">
                  <h3
                    className={`font-medium mb-2 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'}`}
                  >
                    {announcements[currentAnnouncement]?.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}
                  >
                    {announcements[currentAnnouncement]?.content}
                  </p>
                </div>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                  No announcements available.
                </p>
              )}

              <div className="flex items-center justify-between">
                <div
                  className={`flex-1 h-0.5 ${darkMode ? 'bg-[#2A3744]' : 'bg-gray-200'}`}
                ></div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevAnnouncement}
                    className={`p-1.5 rounded-full transition-colors duration-200 ${
                      darkMode ? 'text-[#E2E8F0] hover:bg-[#2A3744]' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Previous announcement"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextAnnouncement}
                    className={`p-1.5 rounded-full transition-colors duration-200 ${
                      darkMode ? 'text-[#E2E8F0] hover:bg-[#2A3744]' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label="Next announcement"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - School Calendar */}
        <div className="lg:col-span-1">
          <div
            className={`rounded-lg shadow-sm border p-6 sticky top-6 transition-colors duration-200 ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-white border-gray-200'
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-6 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'}`}
              role="heading"
              aria-level={2}
            >
              School Calendar
            </h2>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-[#A0B3C6] scrollbar-track-[#1E2A38] dark:scrollbar-track-[#0A1218]">
              {calendarEvents.length > 0 ? (
                calendarEvents.map((monthData:any, monthIndex:number) => (
                  <div key={monthIndex}>
                    <h3
                      className={`text-sm font-bold mb-3 sticky top-0 pb-1 ${
                        darkMode
                          ? 'text-[#E2E8F0] bg-[#1E2A38]'
                          : 'text-gray-900 bg-white'
                      }`}
                    >
                      {monthData.month}
                    </h3>
                    <div className="space-y-3">
                      {monthData.events.map((event:any, eventIndex:number) => (
                        <div key={eventIndex} className="flex items-start gap-4">
                          <div className="flex-shrink-0 text-right">
                            <span
                              className={`font-medium text-sm ${
                                darkMode ? 'text-[#E2E8F0]' : 'text-gray-900'
                              }`}
                            >
                              {event.date}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-tight ${
                                darkMode ? 'text-[#A0B3C6]' : 'text-gray-700'
                              }`}
                            >
                              {event.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                  No events scheduled.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}