'use client'

import Image from 'next/image'
import {useState, useEffect, useRef } from 'react'
import {ArrowRight, ArrowLeft} from "lucide-react";



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
    


    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const container = scrollRef.current
        const scrollAmount = container.clientWidth * 0.9 // scroll ~90% width
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        })
      }
    }

  return (
    <section className="bg-greyText text-[#6B7280] py-10 px-4 text-center ">
      {/* Intro Text */}
      <h1 className='text-center text-3xl text-black font-semibold'>Meet the Department</h1>
      <p className="max-w-4xl mx-auto mb-8 mt-4 text-[#6B7280] text-lg">
        Our department consists of renowned researchers, industry experts, and dedicated educators committed to shaping future engineers. With expertise in fields such as renewable energy, artificial intelligence, embedded systems, and robotics, they bring real-world experience into the classroom.
      </p>

      {/* Scroll Buttons */}
      <div className="relative">
      {!isAtStart && (
  <ArrowLeft 
    size={60} 
    color='black' 
    onClick={() => scroll('left')}
    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 text-[#4B5563] rounded-full p-4 shadow-md hover:bg-gray-400 bg-greyText opacity-[82%]"
  />
)}

{!isAtEnd && (
  <ArrowRight 
    size={60} 
    color='black' 
    onClick={() => scroll('right')}
    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-greyText text-[#4B5563] rounded-full p-4 shadow-md hover:bg-gray-400 opacity-[82%]"
  />
)}

        

        {/* Scrollable Faculty Cards */}
        <div
          ref={scrollRef}
          className="flex scrollbar-none overflow-x-auto gap-4  snap-x snap-mandatory  scroll-smooth px-1 md:px-10"
        >
          {DepartmentData.map((member, index) => (
          <div
            key={index}
            className="relative group flex-shrink-0 snap-center w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] 
             bg-greyText text-[#6B7280] rounded-xl overflow-hidden shadow-md 
             hover:scale-[1.02] transition-transform duration-400"
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
              <p className='text-black font-bold'>{member.name}</p>  
              <p className="text-center font-semibold">{member.role}</p>
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
