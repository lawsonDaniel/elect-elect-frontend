'use client'

import Image from 'next/image'
import {useState, useEffect, useRef } from 'react'
import {ArrowRight, ArrowLeft, X, Mail, ExternalLink, Award, BookOpen, Users} from "lucide-react";
import { useDarkMode } from '@/contexts/DarkModeContext';

const DepartmentData = [
  {
    rank: 'Senoir Lecturer', 
    role: 'HOD',
    name:'Dr. Olurotimi O. Awodiji',
    image: '/HOD.jpeg',
    email: 'awodijio@unijos.edu.ng',
    qualifications: ['Ph.D. Electrical Engineering', 'M.Eng. Electrical Engineering', 'B.Eng. Electrical Engineering'],
    specialization: 'Power Systems, Renewable Energy, Electrical Machines',
    researchInterests: [
      'Power systems network optimization and stability',
      'Integration of renewable energy into the grid',
      'Electric Vehicles, Energy Storage',
    ],

    profileLinks: {
      googleScholar: 'https://scholar.google.co.za/citations?user=mjn8MdAAAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/profile/Awodiji-Olurotimi',
      
    },
    bio: 'Dr. Olurotimi AWODIJI, holds a M.Eng and Ph.D. degrees in Electrical Engineering from Abubakar Tafawa Balewa University Bauchi, Nigeria and the University of Cape Town, South Africa. He is a registered Engineer with the Council for Regulation of Engineering in Nigeria and a member of the Nigerian Society of Engineers. He was a Senior Research Fellow at the Robert Schuman Centre, European University Institute Florence Italy. He is presently a Senior Lecturer with the Department of Electrical and Electronics Engineering, University of Jos, Nigeria. He has over 20 years of work experience that spans the industry and academia.'
  },
  {
    rank: 'Associate Professor', 
    role: 'Deputy Dean',
    name:'Dr. Sunday Iliya',
    image: '/Driliya.jpg',
    email: 'iliyasunday@unijos.edu.ng',
    qualifications: ['Ph.D. Computational Intelligence', 'M.Eng. Electrical and Electronics Engineering', 'B.Eng. Electrical and Electronics Engineering'],
    specialization: 'Computational Intelligence, Meta heuristics Optimization, Machine Learning, Embedded Systems Design and Applications for Remote Sensing and Automation via Internet of Things (IoT)',
    researchInterests: [
      'Computational Intelligence',
      'Meta heuristics Optimization',
      'Machine Learning',
      'IoT and Sensor Networks',
      'Embedded Systems'
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=Vj0r1vAAAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/profile/Sunday-Iliya',
    },
    bio: 'Dr. Sunday Iliya obtained B.Eng. in Electrical and Electronics Engineering and M. Eng. Electrical and Electronics Engineering both from Abubakar Tafawa Balewa University Bauchi, Nigeria, and a PhD in Computational Intelligence from De Montforth University, United Kingdom.'
  },
  {
    rank: 'Senior Lecturer', 
    role: null,
    name:'Dr. Emmanuel Kasai Akut',
    image: '/Dr_Akut.jpg',
    email: 'akute@unijos.edu.ng',
    qualifications: ['Ph.D. in Telecommunication Engineering, Ahmadu Bello University, Zaria, Nigeria in 2023', 'M.Eng degree in Electronics and Telecommunication Engineering. Nigerian Defense Academy, Kaduna, Nigeria in 2012', 'B.Eng. degree in Electrical and Computer Engineering. Federal University of Technology, Minna, Nigeria, in 2004'],
    specialization: 'System optimization, sensor networks, Communication systems',
    researchInterests: [
      'System optimization',
      'sensor networks',
      'Communication systems',
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?hl=en&user=E0FIBVcAAAAJ',
      researchGate: 'https://www.researchgate.net/profile/Engr-Emmanuel-Akut',
    },
    bio: 'Dr. Akut is a member of the Council for the Regulation of Engineering in Nigeria (COREN). He is currently a lecturer at the Department of Electrical and Electronics Engineering, University of Jos, Nigeria.'
  },
  {
    rank: 'Lecturer 1', // Mid-level academic position
    role: 'Time Table Officer',
    name:'Engr. Patrick Nyabvou Julius',
    image: '/Engr_Patrick.jpg',
    email: 'patrickju@unijos.edu.ng',
    qualifications: ['M.Eng. Computer Engineering', 'B.Eng. Electrical Engineering'],
    specialization: ' Computer Engineering',
    researchInterests: [
      'Artificial Intelligence Image and Video Processing',
      'Optimization',
      'Object-Oriented Programming',
      'Human Activities Recognition',
      'Computer Networking'
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=IM9k5M8AAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/profile/Julius-Patrick',
    },
    bio: 'Engr. Patrick Nyabvou Julius graduated from Ahmadu Bello University Zaria, Nigeria with Master degree in Computer Engineering and Bachelor degree in Electrical Engineering.'
  },
  {
    rank: 'Lecturer I', 
    role: 'Exam Officer',
    name:'Engr. Egbujo Felix Iheanacho',
    image: '/Engr_Felix.jpg',
    email: 'egbujof@unijos.edu.ng',
    qualifications: ['M.Eng. Communication Engineering', 'B.Eng. Electrical and Electronics Engineering'],
    specialization: 'Communication, Machine Learning , Power Electronics',
    researchInterests: [
      'Communication Engineering',
      'Power Electronics',
      'Control Engineering',
      'Machine Learning',
      'Embedded Systems',
      'Cyber-physical System'
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=example5',
      researchGate: 'https://www.researchgate.net/profile/Felix-Iheanacho',
    },
    bio: 'Engr. Egbujo Felix Iheanacho received a B.Eng. Degree in Electrical and Electronics Engineering from the University of Maiduguri, Borno State, Nigeria, in 2005 and an M.Eng. Degree in Communication Engineering from the Federal University of Technology, Owerri, Nigeria in 2012'
  },
  {
    rank: 'Lecturer I', // Same level as other Lecturer I positions
    role: null,
    name:'Engr. Kishak Zakka Cinfwat',
    image: '/Engr_Kishak.jpg',
    email: 'cinfwatk@unijos.edu.ng',
    qualifications: ['M.Eng Sensor System Engineering from Hanze University of Applied Sciences, Groningen, Netherland','M.Eng. Management Science and Engineering from Tsinghua University, Beijing, China', 'B.Eng. Electrical & Electronic Engineering' ],
    specialization: 'Instrumentation and Control, AI Applications System Modelling and Sensor Systems',
    researchInterests: [
      'Electronic materials and devices',
      'sensor systems',
      'instrumentation and control engineering',
      'UAV applications',
      'AI applications',
      'engineering asset management',
      'systems modelling and simulation',
      ' human factors and safety engineering'
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=AB0x0IkAAAAJ&hl=en&oi=ao',
      researchGate: 'https://www.researchgate.net/profile/Kishak-Cinfwat',
    },
    bio: 'Engr. Kishak Cinfwat, attended Abubakar Tafawa Balewa University, Bauchi - Nigeria, and obtained a B.Eng. in Electrical & Electronic Engineering Department. As a general scholar at the University of Science and Technology, Beijing, China, he studied Chinese (Mandarin). Thereafter, he obtained an M.Sc. in Management Science and Engineering from Tsinghua University, Beijing,  China and another M.Sc. in Sensor System Engineering from Hanze University of Applied Sciences, Groningen, Netherland. He has also worked in several organizations before joining the University of Jos as a Lecturer.'
  },
  {
    rank: 'Lecturer I', 
    role: null,
    name:'Engr. Isaiah A, Akintunde',
    image: '/Engr_Akintunde.jpg',
    email: 'akintundei@unijos.edu.ng',
    qualifications: [null],
    specialization: ' Electronics, Electronic Circuit Design, Embedded Systems.',
    researchInterests: [
      'Electronics, Electronic Circuit Design',
      'Communication Systems',
      ' Embedded Systems',
      'Active Networks',
      'Internet of Things',
      'Artificial intelligence and Robotics.'
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=KknOlh8AAAAJ&hl=en',
      researchGate: null,
    },
    bio: null
  },
  {
    rank: 'Lecturer II', // Junior academic position
    role: null,
    name:'Dr. Geraldine Rangmoen Rimven',
    image: '/DrGeraldine.jpeg',
    email: 'daloeng@unijos.edu.ng',
    qualifications: ['Ph.D. Engineering from the University of Hull, United Kingdom', 'M.Eng. Personal, Mobile and Satellite Communications from the University of Bradford, United Kingdom', 'B.Eng.Electrical and  Electronics Engineering'],
    specialization: ' Telecommunication',
    researchInterests: [
      'Radio propagation',
      'microwave links',
      'rain-induced attenuation',
      'spectrum planning',
    ],
    profileLinks: {
      googleScholar: 'https://scholar.google.com/citations?user=-d0slPIAAAAJ&hl=en',
      researchGate: 'https://www.researchgate.net/profile/Geraldine-Rimven-2',
    },
    bio: 'Dr. Rimven earned a Bachelor of Engineering (Electrical/Electronics) from the prestigious Abubakar Tafawa Balewa University, Bauchi in 2001. She obtained a Master of Science in Personal, Mobile and Satellite Communications from the University of Bradford, United Kingdom in 2011, whilst working in the ICT Directorate of the University of Jos where she served for 11 years. She joined the Electrical and Electronics Engineering Department in Faculty of Engineering, University of Jos in 2014. Dr. Rimven earned a doctorate degree in Engineering from the University of Hull, United Kingdom in 2019 as a Schlumberger Fellow.'
  },
  {
    rank: 'Chief Technologist', // Senior technical position
    role: null,
    name:'Mari Yahaya Maimako',
    image: '/Mr_Mari.jpg',
    email: null,
    qualifications: [null],
    specialization: 'Electronics/ Telecommunication',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null
    },
    bio: null
  },
  {
    rank: 'Principal Technologist', 
    role: null,
    name:'Bala John Abiti',
    image: '/Mr_John.jpg',
    email: 'abitib@unijos.edu.ng',
    qualifications: [null],
    specialization: 'Power and Machine',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null,
    },
    bio: null
  },
  {
    rank: 'Technologist', 
    role: null,
    name:'Nwoye Raphael Ugochukwu',
    image: '/Mr_Raphael.jpg',
    email: 'nwoyer@unijos.edu.ng',
    qualifications: [null],
    specialization: 'Power and Machines',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null,
    },
    bio: null
  },
  {
    rank: 'Technologist I', 
    role: null,
    name:'Odaudu Paul James',
    image: '/Mr_Paul.jpg',
    email: 'odaudup@unijos.edu.ng',
    qualifications: [null],
    specialization: 'Electronics and Telecommunication',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null,
    },
    bio: null
  },
  {
    rank: 'Technologist I', 
    role: null,
    name:'Unite Ali Dogo',
    image: '/Mr_Dogo.jpg',
    email: ' dogou@unijos.edu.ng',
    qualifications: [null],
    specialization: ' Power and Machine',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null,
    },
    bio: null
  },
  {
    rank: 'Technologist I', 
    role: null,
    name:'Adegbenle Adeniyi S',
    image: '/Mr_Adeniyi.jpg',
    email: 'adegbenlea@unijos.edu.ng',
    qualifications: [null],
    specialization: 'Telecommunication',
    researchInterests: [
      null
    ],
    profileLinks: {
      googleScholar: null,
      researchGate: null,
    },
    bio: null
  },
]

export default function DepartmentCarousel() {
  const { darkMode } = useDarkMode();
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<typeof DepartmentData[0] | null>(null)

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

    checkScrollPosition()
    container.addEventListener('scroll', checkScrollPosition)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStaff(null)
      }
    }

    if (selectedStaff) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedStaff])
    
  const getCardWidth = () => {
    if (!scrollRef.current) return 0;
    
    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const gap = 16;
    
    let cardWidth;
    if (window.innerWidth >= 1024) {
      cardWidth = containerWidth * 0.22;
    } else if (window.innerWidth >= 768) {  
      cardWidth = containerWidth * 0.30;
    } else if (window.innerWidth >= 640) {
      cardWidth = containerWidth * 0.45;
    } else {
      cardWidth = containerWidth * 0.80;
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

  const openModal = (staff: typeof DepartmentData[0]) => {
    setSelectedStaff(staff)
  }

  const closeModal = () => {
    setSelectedStaff(null)
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
              onClick={() => openModal(member)}
              className={`relative group flex-shrink-0 snap-center w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] 
               rounded-xl overflow-hidden shadow-md cursor-pointer
               hover:scale-[1.02] transition-transform duration-400 ${
                 darkMode ? 'bg-[#101E27]' : 'bg-greyText'
               }`}
            >
              {/* Image */}
              <Image
                src={member.image}
                alt={member.rank}
                width={300}
                height={400}
                className="object-cover w-full h-[85%]"
              />

              {/* Name & Role */}
              <div className="p-3 z-10 relative">
                <p className={`font-bold ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-black'
                }`}>{member.name}</p>  
                <p className={`text-center font-semibold ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                }`}>{member.rank}</p>
              </div>

              {/* Overlay covers everything */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      
      {selectedStaff && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
          <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
            darkMode ? 'bg-[#070E12]' : 'bg-white'
            
          }`}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 z-10 rounded-full p-2 transition-colors ${
                darkMode 
                  ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1A2832]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left Column - Image and Basic Info */}
              <div className="space-y-4">
                <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={selectedStaff.image}
                    alt={selectedStaff.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-center space-y-3">
                  <h2 className={`text-2xl font-bold ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>{selectedStaff.name}</h2>
                  <h2 className={`text-2xl font-semibold ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-[#6B7280]'
                  }`}>{selectedStaff.rank}</h2>
                  <p className={`text-lg font-semibold ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                  }`}>{selectedStaff.role}</p>
                  
                  {/* Contact Information */}
                  <div className={`pt-3 border-t ${
                    darkMode ? 'border-[#101E27]' : 'border-gray-200'
                  }`}>
                    <p className={`flex items-center justify-center gap-2 text-sm ${
                      darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                    }`}>
                      <Mail size={16} />
                      {selectedStaff.email}
                    </p>
                  </div>

                  {/* Profile Links */}
                  <div className="flex justify-center gap-3 pt-3 flex-wrap">
                    {selectedStaff.profileLinks.googleScholar && (
                      <a 
                        href={selectedStaff.profileLinks.googleScholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs transition-colors ${
                          darkMode 
                            ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1A2832]' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <ExternalLink size={14} />
                        Google Scholar
                      </a>
                    )}
                    {selectedStaff.profileLinks.researchGate && (
                      <a 
                        href={selectedStaff.profileLinks.researchGate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs transition-colors ${
                          darkMode 
                            ? 'bg-[#101E27] text-[#EDF3F8] hover:bg-[#1A2832]' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <ExternalLink size={14} />
                        ResearchGate
                      </a>
                    )}
                    
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Specialization */}
                <div>
                  <h3 className={`text-xl font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>
                    <Users size={20} />
                    Specialization
                  </h3>
                  <p className={`text-sm text-justify ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                  }`}>{selectedStaff.specialization}</p>
                </div>

                {/* Research Interests */}
                <div>
                  <h3 className={`text-xl font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>
                    <BookOpen size={20} />
                    Research Interests
                  </h3>
                  <ul className={`space-y-2 text-sm ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                  }`}>
                    {selectedStaff.researchInterests.map((interest, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {interest}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 className={`text-xl font-semibold  mb-3 flex items-center gap-2 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>
                    <Award size={20} />
                    Qualifications
                  </h3>
                  <ul className={`space-y-1 text-sm ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                  }`}>
                    {selectedStaff.qualifications.map((qual, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-justify">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>

                
                {/* Biography */}
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>Biography</h3>
                  <p className={`text-sm leading-relaxed text-justify ${
                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                  }`}>{selectedStaff.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </section>
  )
}