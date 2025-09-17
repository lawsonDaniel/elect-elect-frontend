'use client'

import Image from 'next/image'
import {useState, useEffect, useRef } from 'react'
import {ArrowRight, ArrowLeft} from "lucide-react";
import { useDarkMode } from '@/contexts/DarkModeContext';

const DepartmentData = [
  {
    role: 'HOD',
    name:'Dr. Olurotimi O. Awodiji',
    image: '/HOD.jpeg',
  },
  {
    role: 'Deputy Dean',
    name:'Dr. Sunday Iliya',
    image: '/Driliya.jpg',
  },
  
  
  {
    role: 'Senior Lecturer',
    name:'Dr. Emmanuel Kasai Akut',
    image: '/Dr_Akut.jpg',
  },
  {
    role: 'Lecturer 1',
    name:'Engr. Patrick Nyabvou Julius',
    image: '/Engr_Patrick.jpg',
  },
  {
    role: 'Lecturer I',
    name:'Engr. Egbujo Felix Iheanacho',
    image: '/Engr_Felix.jpg',
  },
  {
    role: 'Lecturer I',
    name:'Engr. Kishak Zakka Cinfwat',
    image: '/Engr_Kishak.jpg',
  },
  {
    role: 'Lecturer I',
    name:'Engr. Isaiah A, Akintunde',
    image: '/Engr_Akintunde.jpg',
  },
  {
    role: 'Lecturer II',
    name:'Dr. Geraldine Rangmoen Rimven',
    image: '/DrGeraldine.jpeg',
  },
  {
    role: 'Chief Technologist',
    name:'Mari Yahaya Maimako',
    image: '/Mr_Mari.jpg',
  },
   {
    role: 'Principal Technologist',
    name:'Bala John Abiti',
    image: '/Mr_John.jpg',
  },
  {
    role: 'Technologist',
    name:'Nwoye Raphael Ugochukwu',
    image: '/Mr_Raphael.jpg',
  },
  {
    role: 'Technologist I',
    name:'Odaudu Paul James',
    image: '/Mr_Paul.jpg',
  },
  {
    role: 'Technologist I',
    name:'Unite Ali Dogo',
    image: '/Mr_Dogo.jpg',
  },
  {
    role: 'Technologist I',
    name:'Adegbenle Adeniyi S',
    image: '/Mr_Adeniyi.jpg',
  },
]

export default function DepartmentCarousel() {
  const { darkMode } = useDarkMode();
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setIsAtStart(scrollLeft === 0)
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
    }
  }
  
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return;

    checkScrollPosition() // Initial check

    container.addEventListener('scroll', checkScrollPosition)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])
    
  const getCardWidth = () => {
    if (!scrollRef.current) return 0;
    
    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const gap = 16; // 4 in Tailwind = 16px
    
    // Calculate card width based on viewport
    let cardWidth;
    if (window.innerWidth >= 1024) { // lg breakpoint
      cardWidth = containerWidth * 0.22; // 22vw equivalent
    } else if (window.innerWidth >= 768) { // md breakpoint  
      cardWidth = containerWidth * 0.30; // 30vw equivalent
    } else if (window.innerWidth >= 640) { // sm breakpoint
      cardWidth = containerWidth * 0.45; // 45vw equivalent
    } else {
      cardWidth = containerWidth * 0.80; // 80vw equivalent
    }
    
    return cardWidth + gap;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const scrollAmount = getCardWidth()
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className={`py-10 px-4 text-center ${
      darkMode ? 'bg-[#070E12]' : 'bg-greyText'
    }`}>
      {/* Intro Text */}
      <h1 className={`text-center text-3xl font-semibold ${
        darkMode ? 'text-[#FFFFFF]' : 'text-black'
      }`}>Meet the Department</h1>
      <p className={`max-w-4xl mx-auto mb-8 mt-4 text-lg ${
        darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
      }`}>
        Our department consists of renowned researchers, industry experts, and dedicated educators committed to shaping future engineers. With expertise in fields such as renewable energy, artificial intelligence, embedded systems, and robotics, they bring real-world experience into the classroom.
      </p>

      {/* Scroll Buttons */}
      <div className="relative mx-4">
      {!isAtStart && (
  <button
    onClick={() => scroll('left')}
    className={`hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg cursor-pointer transition-all duration-200 ${
      darkMode 
        ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1A2832] hover:shadow-xl' 
        : 'bg-white text-[#4B5563] hover:bg-gray-100 hover:shadow-xl'
    }`}
  >
    <ArrowLeft size={24} />
  </button>
)}

{!isAtEnd && (
  <button
    onClick={() => scroll('right')}
    className={`hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg cursor-pointer transition-all duration-200 ${
      darkMode 
        ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1A2832] hover:shadow-xl' 
        : 'bg-white text-[#4B5563] hover:bg-gray-100 hover:shadow-xl'
    }`}
  >
    <ArrowRight size={24} />
  </button>
)}

        {/* Scrollable Faculty Cards */}
        <div
          ref={scrollRef}
          className="flex scrollbar-none overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth px-12"
        >
          {DepartmentData.map((member, index) => (
          <div
            key={index}
            className={`relative group flex-shrink-0 snap-center w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] 
             rounded-xl overflow-hidden shadow-md 
             hover:scale-[1.02] transition-transform duration-400 ${
               darkMode ? 'bg-[#101E27]' : 'bg-greyText'
             }`}
          >
            {/* Image */}
            <Image
              src={member.image}
              alt={member.role}
              width={300}
              height={400}
              className="object-cover w-full h-[85%]  "
            />

            {/* Name & Role */}
            <div className="p-3 z-10 relative">
              <p className={`font-bold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>{member.name}</p>  
              <p className={`text-center font-semibold ${
                darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
              }`}>{member.role}</p>
            </div>

            {/* Overlay covers everything */}
            <div className="absolute inset-0 bg-black  opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20" />
          </div>
        ))}

        </div>
      </div>
    </section>
  )
}