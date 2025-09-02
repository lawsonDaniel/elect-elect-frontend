'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Library, Calculator, CreditCard } from 'lucide-react';
import { Poppins, Space_Grotesk } from "next/font/google"
import Image from 'next/image';
import { useDarkMode } from '@/contexts/DarkModeContext';

const cards = [
  {
    title: 'Courses Enrolled',
    value: 20,
    sub: 'This Session',
    border: 'border-blue-400',
  },
  {
    title: 'Downloads',
    value: 30,
    sub: 'This Session',
    border: 'border-orange-300',
  },
  {
    title: 'Upcoming Classes',
    value: 5,
    sub: 'This Week',
    border: 'border-red-300',
  },
  {
    title: 'Payment Status',
    value: 'Dues Payment',
    sub: 'Pending',
    border: 'border-yellow-400',
    isBold: true,
  },
];

const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
})

export default function Dashboard() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const { darkMode } = useDarkMode();
  
  const announcements = [
    {
      title: "Class Resumption Notice",
      content: "The Department of Electrical and Electronics Engineering wishes to inform all students that the second semester will officially commence on Monday, May 6, 2025..."
    },
    {
      title: "Academic Calendar Update",
      content: "Please note the updated academic calendar for the 2025/2026 session. All students are advised to take note of important dates..."
    },
    {
      title: "Registration Reminder",
      content: "All returning students are reminded to complete their course registration before the deadline..."
    }
  ];

  const quickActions = [
    { icon: MessageCircle, label: "Open Chat Space" },
    { icon: Library, label: "Go to Mini Library" },
    { icon: Calculator, label: "Use CGP Calculator" },
    { icon: CreditCard, label: "Make a Payment" }
  ];

  const calendarEvents = [
    {
      month: "August, 2025",
      events: [
        { date: "12th", title: "Resumption of 2025/2026 Academic Session" },
        { date: "13th", title: "Academic Staff Meeting" }
      ]
    },
    {
      month: "September, 2025", 
      events: [
        { date: "12th", title: "Resumption of 2025/2026 Academic Session" },
        { date: "13th", title: "Academic Staff Meeting" }
      ]
    },
    {
      month: "October, 2025",
      events: [
        { date: "5th", title: "Mid-Semester Break Begins" },
        { date: "15th", title: "Classes Resume" },
        { date: "20th", title: "Department Open Day" },
        { date: "28th", title: "Research Symposium" }
      ]
    },
    {
      month: "November, 2025",
      events: [
        { date: "2nd", title: "Course Registration Deadline" },
        { date: "10th", title: "First Semester Examinations Begin" },
        { date: "25th", title: "Engineering Project Presentations" }
      ]
    },
    {
      month: "December, 2025",
      events: [
        { date: "1st", title: "End of First Semester" },
        { date: "5th", title: "Graduation Ceremony" },
        { date: "15th", title: "Christmas Break Begins" }
      ]
    },
    {
      month: "January, 2026",
      events: [
        { date: "8th", title: "Second Semester Begins" },
        { date: "15th", title: "Late Registration Deadline" },
        { date: "20th", title: "Orientation for New Students" }
      ]
    },
    {
      month: "February, 2026",
      events: [
        { date: "3rd", title: "Department Workshop" },
        { date: "14th", title: "Valentine's Day Break" },
        { date: "28th", title: "Mid-Semester Assessment" }
      ]
    },
    {
      month: "March, 2026",
      events: [
        { date: "10th", title: "Industrial Training Begins" },
        { date: "15th", title: "Career Fair" },
        { date: "25th", title: "Spring Break" }
      ]
    }
  ];

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className={`text-xl sm:text-2xl font-semibold ${spaceGrotesk.className} mb-2 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>
        Welcome Back, John
      </h1>
      
      <div className='w-full flex flex-col lg:flex-row lg:justify-between gap-4 mb-6'>
        <p className={`lg:w-1/2 flex-shrink-0 text-sm sm:text-base ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-700'}`}>
          Here&apos;s your current academic and departmental summary.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-2 lg:w-1/2 lg:justify-end'>
          <button className={`flex px-2 sm:px-3 border text-xs sm:text-sm gap-1 sm:gap-2 h-10 items-center justify-center rounded-xl flex-shrink-0 cursor-pointer ${
            darkMode 
              ? 'bg-[#070E12] border-[#EDF3F8] text-[#EDF3F8]' 
              : 'bg-white border-navBlue text-navBlue'
          }`}>
            <Image 
              src='/refresh.png'
              width={16}
              height={16}
              alt='refresh'
              className={`sm:w-5 sm:h-5 ${darkMode ? 'invert' : ''}`}
            /> 
            <span className='truncate'>Refresh Dashboard</span>
          </button>
          
          <button className='flex bg-navBlue border text-xs sm:text-sm text-white h-10 items-center justify-center rounded-xl gap-1 sm:gap-2 px-2 sm:px-3 flex-shrink-0 cursor-pointer'>
            <Image 
              src='/printer.png'
              width={16}
              height={16}
              alt='printer'
              className='sm:w-6 sm:h-6 invert'
            /> 
            <span className='truncate'>Print Receipt</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className='flex flex-col xl:flex-row gap-4 sm:gap-6 mb-8'>
        {/* Blue Chart/Content Box - Unchanged in dark mode */}
        <div className='bg-navBlue text-white p-6 w-full lg:w-[31.4rem] sm:h-80 md:h-[20.75rem] rounded-lg flex-shrink-0 order-1'>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <button className="text-gray-400 hover:text-gray-300 text-sm transition-colors cursor-pointer">
              See More
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            <Image 
              src='/DrTijani.png' 
              width={48} 
              height={48} 
              alt="Profile Picture" 
              className="rounded-full"
            />
            
            <div>
              <h3 className="text-lg font-semibold mb-1">John Doe</h3>
              <p className="text-gray-400 text-sm">Student</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-gray-400 text-sm">Matt Number:</span>
                <span className="text-white text-sm ml-1">UJ/2018/EL/0001</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Email:</span>
                <span className="text-white text-sm ml-1">enoch@gmail.com</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Faculty:</span>
                <span className="text-white text-sm ml-1">Engineering</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Level:</span>
                <span className="text-white text-sm ml-1">500</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cards Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 order-1 xl:order-2 ${spaceGrotesk.className}`}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`border-2 ${card.border} rounded-lg p-3 sm:p-4 shadow-sm min-h-[120px] sm:min-h-[140px] flex flex-col justify-between ${
                darkMode ? 'bg-[#070E12]' : 'bg-white'
              }`}
            >
              <div className={`text-xs sm:text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'} mb-1`}>
                {card.title}
              </div>
              <div className={`text-base sm:text-lg lg:text-xl ${card.isBold ? 'font-bold' : 'font-semibold'} mb-1 flex-1 flex items-center ${
                darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
              }`}>
                {card.value}
              </div>
              <div className={`text-xs ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`}>
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
          <div className={`rounded-lg shadow-sm border p-6 ${
            darkMode 
              ? 'bg-[#070E12] border-[#101E27]' 
              : 'bg-white border-gray-300'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
            }`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-200 text-left ${
                    darkMode
                      ? 'border-[#101E27] hover:border-[#EDF3F8] hover:bg-[#101E27] text-[#EDF3F8]'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <action.icon className={`w-5 h-5 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`} />
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className={`rounded-lg shadow-sm border p-6 ${
            darkMode 
              ? 'bg-[#070E12] border-[#101E27]' 
              : 'bg-white border-gray-300'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
            }`}>
              Announcements
            </h2>
            
            <div className="relative">
              <div className="mb-4">
                <h3 className={`font-medium mb-2 ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                }`}>
                  {announcements[currentAnnouncement].title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'
                }`}>
                  {announcements[currentAnnouncement].content}
                </p>
              </div>
              
              {/* Navigation - Simple line with arrows */}
              <div className="flex items-center justify-between">
                <div className={`flex-1 h-0.5 ${
                  darkMode ? 'bg-[#101E27]' : 'bg-gray-300'
                } mx-4`}></div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevAnnouncement}
                    className={`p-1 transition-colors duration-200 ${
                      darkMode ? 'hover:bg-[#101E27]' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={nextAnnouncement}
                    className={`p-1 transition-colors duration-200 ${
                      darkMode ? 'hover:bg-[#101E27]' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - School Calendar */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg shadow-sm border p-6 sticky top-6 ${
            darkMode 
              ? 'bg-[#070E12] border-[#101E27]' 
              : 'bg-white border-gray-300'
          }`}>
            <h2 className={`text-lg font-semibold mb-6 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
            }`}>
              School Calendar
            </h2>
            
            {/* Scrollable container with max height */}
            <div className="max-h-96 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {calendarEvents.map((monthData, monthIndex) => (
                <div key={monthIndex}>
                  <h3 className={`text-sm font-bold mb-3 sticky top-0 pb-1 ${
                    darkMode 
                      ? 'text-[#FFFFFF] bg-[#070E12]' 
                      : 'text-gray-900 bg-white'
                  }`}>
                    {monthData.month}
                  </h3>
                  
                  <div className="space-y-3">
                    {monthData.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-right">
                          <span className={`font-medium text-sm ${
                            darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'
                          }`}>
                            {event.date}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-tight ${
                            darkMode ? 'text-[#EDF3F8]' : 'text-gray-900'
                          }`}>
                            {event.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}