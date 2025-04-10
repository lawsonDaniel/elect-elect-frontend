'use client'

import Image from 'next/image'
import { useRef } from 'react'

const DepartmentData = [
  {
    role: 'Deputy Dean',
    name:'Dr. Sunday Iliya',
    image: '/image1.png',
  },
  {
    role: 'HOD',
    name:'Dr. Sunday Iliya',
    image: '/HOD.jpeg',
  },
  {
    role: 'Senior Lecturer',
    name:'Dr. Sunday Iliya',
    image: '/DrGeraldine.jpeg',
  },
  {
    role: 'Senior Lecturer',
    name:'Dr. Sunday Iliya',
    image: '/DrTijani.png',
  },
  {
    role: 'Senior Lecturer',
    name:'Dr. Sunday Iliya',
    image: '/DrGeraldine.jpeg',
  },
  {
    role: 'Senior Lecturer',
    name:'Dr. Sunday Iliya',
    image: '/DrTijani.png',
  },
]

export default function DepartmentCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

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
    <section className="bg-greyText text-[#6B7280] py-10 px-4 text-center">
      {/* Intro Text */}
      <p className="max-w-4xl mx-auto mb-8 text-[#6B7280] text-lg">
        Our department consists of renowned researchers, industry experts, and dedicated educators committed to shaping future engineers. With expertise in fields such as renewable energy, artificial intelligence, embedded systems, and robotics, they bring real-world experience into the classroom.
      </p>

      {/* Scroll Buttons */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#4B5563] rounded-full p-2 shadow-md hover:bg-gray-100 bg-greyText"
        >
          ←
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute  right-0 top-1/2 -translate-y-1/2 z-10 bg-greyText text-[#4B5563]rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          →
        </button>

        {/* Scrollable Faculty Cards */}
        <div
          ref={scrollRef}
          className="flex scrollbar-none overflow-x-auto gap-4 snap-x snap-mandatory  scroll-smooth px-1 md:px-10"
        >
          {DepartmentData.map((member, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] bg-greyText text-[#6B7280] rounded-xl overflow-hidden shadow-md "
            >
              <Image
                src={member.image}
                alt={member.role}
                width={300}
                height={400}
                
                className="object-cover w-full h-[85%] h-60"
              />
              <p> {member.name}</p>  
              <p className="p-1 text-center font-semibold">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
