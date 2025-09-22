'use client';
import Header from "./component/navbar";
import Footer from "./component/footer";
import Image from 'next/image';
import { useDarkMode } from '@/contexts/DarkModeContext';
import ScrollAnimationSection from "./component/ScrollAnimationSection"
import Link from "next/link";
import GallerySlideshow from "./component/gallery";

import { ArrowRight, DotIcon } from "lucide-react";

export default function Home() {
  const { darkMode } = useDarkMode();

  const values = [
    {
      image: "/setting-2.png",
      title: "Technological Advancement",
      description: "To drive innovation through cutting-edge research and practical applications in electrical and electronics engineering, keeping the industry at the forefront of technology."
    },
    {
      image: "/book.png",
      title: "Industry-Ready Education",
      description: "To equip students with the technical skills, problem-solving mindset, and hands-on experience needed to excel in engineering and technology roles."
    },
    {
      image: "/radioactive-alert.png",
      title: "Sustainable Engineering",
      description: "To develop eco-friendly and energy-efficient technologies that address real-world challenges in power systems, telecommunications, automation, and beyond."
    }
  ];

  const Programs = [
    {
      title: "Undergraduate Programs",
      description: "B.Eng. Electrical & Electronics Engineering",
      points: [
        "Foundation in circuit design, power systems, and telecommunications",
        "Hands-on laboratory sessions and real-world project experience",
        "Internship opportunities with top engineering firms"
      ],
    },
    {
      title: "Postgraduate Programs",
      description: "M.Eng. Electrical & Electronics Engineering",
      points: [
        "Advanced research in embedded systems, power electronics, and automation",
        "Industry collaborations for cutting-edge innovation"
      ],
    },
    {
      title: "Ph.D. Electrical & Electronics Engineering",
      description: "B.Eng. Electrical & Electronics Engineering",
      points: [
        "Pioneering research in artificial intelligence, smart grids, and sustainable energy",
        "Supervision from world-class faculty and researchers"
      ],
    }
  ];

  const news = [
    { images: "/research.jpeg", 
      title: "New Research Initiative Launched", 
      description: "Our department is excited to announce a new research initiative.",
      Author: "Dr. Olurotimi O. Awodiiji",
      DatePosted: "June 25, 2025",
      TimeRead: "5mins Read" },
    { images: "/AI_.jpeg",  
      title: "Upcoming Workshop on AI", 
      description: "Join us for an engaging workshop on artificial intelligence applications.",
      Author: "Dr. Olurotimi O. Awodiiji",
      DatePosted: "June 25, 2025",
      TimeRead: "5mins Read" },
    { images: "/AI_.jpeg",  
      title: "innovation", 
      description: "Join us for an engaging workshop on artificial intelligence applications.",
      Author: "Dr. Olurotimi O. Awodiiji",
      DatePosted: "June 25, 2025",
      TimeRead: "5mins Read" }
  ];

  return (
    <div className={darkMode ? 'bg-[#070E12]' : 'bg-greyText'}>
      <div className="relative bg-cover bg-center bg-no-repeat h-screen bg-[image:var(--bg-Faculty)]">
        <div className="absolute inset-0 bg-[#101E2799]"></div>
        <Header />
        {/* Hero Section */}
        <ScrollAnimationSection>
        <section className="bg-no-repeat bg-cover flex flex-col">
          <div className="px-[4.27%] md:px-[7.78%] h-screen w-full items-center text-white z-20 translate-y-3/12 md:translate-y-1/3">
            <h1 className="max-w-[35rem] text-3xl md:text-5xl">Welcome to the Department of Electrical and Electronics Engineering</h1>
            <p className="max-w-[29rem] font-extralight mt-4">At our department, we are committed to excellence in education and research. Join us in shaping the future through knowledge and innovation.</p>
            
          </div>
        </section>
        </ScrollAnimationSection>
      </div>

      {/* Welcome Message */}
      <ScrollAnimationSection>
   <section className={`flex flex-col lg:flex-row gap-5 w-full ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className="w-[92%] md:w-[85%] mx-auto flex flex-col lg:flex-row gap-5 py-6 md:py-8">
          <Image 
            src="/HOD.jpeg" 
            alt="welcomeImage" 
            width={592} 
            height={562} 
            className="w-full md:w-[98%] lg:w-[50%] rounded-xl mx-auto lg:mx-0"  
            layout="intrinsic"
          />
          <ScrollAnimationSection>
            <div className="lg:mt-[13%] w-full">
              <h1 className={`font-bold text-lg md:text-3xl ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Welcome Message from the HOD</h1>
              <p className={`mt-4 text-sm md:text-lg leading-relaxed text-justify ${
                darkMode ? 'text-[#EDF3F8]' : 'text-black'
              }`}>
              &quot;At our department, we are committed to pushing the boundaries of knowledge, preparing students to be industry-ready, and fostering a culture of innovation. Whether you are a prospective student, a researcher, or an industry partner, we invite you to explore our programs and collaborate with us in shaping the future of technology.&quot;
              </p>
                <div className="flex flex-col mt-4 mb-5">
                  <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>HOD</p>
                  <p className={`font-bold ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>Dr. Olurotimi O. Awodiji</p>
                </div>
            </div>
          </ScrollAnimationSection>
        </div>
      </section>
      </ScrollAnimationSection>

      {/* Values Section */}
      <ScrollAnimationSection>
      <section className="bg-navBlue p-6 md:p-12">
        <ScrollAnimationSection><h2 className="text-center text-md md:text-2xl font-light text-white">Our Mission and Vision</h2></ScrollAnimationSection>
        <ScrollAnimationSection><h2 className="text-center font-bold text-2xl md:text-4xl max-w-2xl m-auto mt-3 text-white">
          Our Guiding Principles: Innovation, Excellence, and Impact
        </h2> </ScrollAnimationSection>
        <div className="mt-6 grid grid-row-1 lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.6%] lg:mx-[4.6%]">
          {values.map(({ image, title, description }) => (
            <div key={title} className={`p-6 rounded-lg text-center ${
              darkMode ? 'bg-[#101E27]' : 'bg-gray-800'
            }`}>
              <ScrollAnimationSection>
                <Image 
              src={image} 
              alt={title} 
              width={48} 
              height={48} 
              className="m-auto" 
              layout="intrinsic" /> </ScrollAnimationSection>
              <ScrollAnimationSection><h3 className="text-xl font-semibold text-white mt-5">{title}</h3>
              <p className="mt-2 text-[#D1D5DB] text-sm">{description}</p>
              </ScrollAnimationSection>
            </div>
          ))}
        </div>
      </section>
      </ScrollAnimationSection>

       <ScrollAnimationSection>
       <section className={`flex flex-col lg:flex-row gap-5 w-full ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className="w-[92%] md:w-[85%] mx-auto flex flex-col lg:flex-row gap-5 py-6 md:py-8">
          <Image 
            src="/DEAN.PNG" 
            alt="welcomeImage" 
            width={592} 
            height={562} 
            className="w-full md:w-[98%] lg:w-[50%] rounded-xl mx-auto lg:mx-0"  
            layout="intrinsic"
          />
          <ScrollAnimationSection>
            <div className="lg:mt-[13%] w-full">
              <h1 className={`font-bold text-lg md:text-3xl ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Welcome Message from the DEAN</h1>
              <p className={`mt-4 text-sm md:text-lg leading-relaxed text-justify ${
                darkMode ? 'text-[#EDF3F8]' : 'text-black'
              }`}>
              &quot;Welcome to the Faculty of Engineering, University of Jos. Our mission is to cultivate excellence in engineering education, research, and innovation across all disciplines. We take pride in producing graduates who are not only academically grounded but also equipped with the practical skills and leadership qualities needed to drive progress in society. As you explore our programs and initiatives, we invite you to join us in building a future where engineering solutions transform lives and power sustainable development.&quot;
              </p>
                <div className="flex flex-col mt-4 mb-5">
                  <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>DEAN</p>
                  <p className={`font-bold ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>PROF. ROSE DAFFI</p>
                </div>
            </div>
          </ScrollAnimationSection>
        </div>
      </section>
      </ScrollAnimationSection>

      {/* Academic Programs */}
      <ScrollAnimationSection>
      <section className={`p-6 md:p-12 ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <ScrollAnimationSection><h2 className={`text-center text-2xl md:text-4xl font-bold mx-[7.78%] ${
          darkMode ? 'text-[#FFFFFF]' : 'text-black'
        }`}>Academic Programs</h2> </ScrollAnimationSection>
        <ScrollAnimationSection>
          <h2 className={`text-center text-md font-light m-auto -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%] mt-3 ${
          darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
        }`}>
          Our department offers a comprehensive curriculum designed to equip students with cutting-edge knowledge, hands-on experience, and industry-ready skills in electrical and electronics engineering. Whether you&apos;re starting your journey or advancing your expertise, we have the right program for you.
        </h2></ScrollAnimationSection>
        <div className="mt-6 grid grid-row-1 lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%]">
          {Programs.map(({ title, description, points }) => (
            // eslint-disable-next-line react/jsx-key
            <ScrollAnimationSection>
            <div key={title} className={`p-6 rounded-lg border h-full flex flex-col mb-8 ${
              darkMode 
                ? 'bg-[#070E12] border-[#101E27]' 
                : 'bg-greyText border-[#9CA3AF]'
            } border-1`}>
              <h3 className={`text-xl font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>{title}</h3>
              <p className={`mt-2 text-sm ${
                darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
              }`}>{description}</p>
              <ul className={`mt-4 text-left ${
                darkMode ? 'text-[#EDF3F8]' : 'text-[#4B5563]'
              }`}>
                {points.map((point, index) => (
                  <li key={index} className="flex items-center mt-2 text-sm gap-3">
                    <div className="flex items-center justify-center h-[1rem] w-[1rem] bg-navBlue shrink-0">
                      <Image 
                      src="/check (1).png" 
                      alt="" 
                      width={16} 
                      height={16} 
                      className="h-full w-full object-contain block"  
                      layout="intrinsic"/>
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
              {/* <div className="mt-auto ml-auto">
                <button className={`w-[7.75rem] h-[2.5rem] bg-transparent rounded-4xl border flex items-center justify-center gap-2 ${
                  darkMode 
                    ? 'border-[#101E27] text-[#EDF3F8]' 
                    : 'border-[#9CA3AF] text-black'
                }`}>
                  Enroll now
                  <Image src="/arrow.png" 
                  alt="arrow" 
                  width={16}
                  height={16}  
                  layout="intrinsic" />
                </button>
              </div> */}
            </div>
            </ScrollAnimationSection>
          ))}
        </div>
      </section>
      </ScrollAnimationSection>

             <ScrollAnimationSection>
       <section className={`flex flex-col lg:flex-row gap-5 w-full ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className="w-[92%] md:w-[85%] mx-auto flex flex-col lg:flex-row gap-5 py-6 md:py-8">
          <Image 
            src="/Dave.jpg" 
            alt="welcomeImage" 
            width={592} 
            height={562} 
            className="w-full md:w-[98%] lg:w-[50%] rounded-xl mx-auto lg:mx-0"  
            layout="intrinsic"
          />
          <ScrollAnimationSection>
            <div className="lg:mt-[13%] w-full">
              <h1 className={`font-bold text-lg md:text-3xl ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Welcome Message from the NIEEES PRESIDENT</h1>
              <p className={`mt-4 text-sm md:text-lg leading-relaxed text-justify ${
                darkMode ? 'text-[#EDF3F8]' : 'text-black'
              }`}>
              &quot;On behalf of the Nigerian Institution of Electrical and Electronics Engineers Students (NIEEES), University of Jos Chapter, I warmly welcome you to our department's platform. As student engineers, we are passionate about creativity, teamwork, and innovation that solve real-world challenges. Our community is dedicated to fostering collaboration among students, staff, and industry partners, while also ensuring that every member grows academically, professionally, and socially. We invite you to engage with us as we shape the future of engineering together.&quot;
              </p>
                <div className="flex flex-col mt-4 mb-5">
                  <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>NIEEES UNIJOS PRESIDENT</p>
                  <p className={`font-bold ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                  }`}>HOITITOU DAVID GODWIN</p>
                </div>
            </div>
          </ScrollAnimationSection>
        </div>
      </section>
      </ScrollAnimationSection>

       <ScrollAnimationSection>
        <GallerySlideshow darkMode={darkMode} />
      </ScrollAnimationSection>


    {/* News Section */}
      <ScrollAnimationSection>
      <section className={`mt-9 ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className="mx-[4.27%] md:mx-[7.78%]">
          <h2 className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>Updates</h2>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mt-4">
              <h1 className={`font-medium text-3xl md:text-4xl ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Latest Department News</h1>
              <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>Stay informed with our latest updates and events.</p>
            </div>
            <Link href='/blog'><button className={`w-[6.313rem] h-[3rem] bg-transparent border rounded-lg mt-2 ${
              darkMode 
                ? 'border-[#101E27] text-[#EDF3F8]' 
                : 'border-[#9CA3AF] text-black'
            }`}>View All</button></Link>
          </div>
          <div className="mt-6 grid grid-row-1 lg:grid-cols-3 lg:-mx-[1.78%]">
            {news.map(({ images, title, description, Author, DatePosted, TimeRead }) => (
              <div key={title} className="lg:p-4 rounded-lg text-left">
                <div className="relative w-full h-[314px] rounded-lg overflow-hidden">
                  <Image 
                    src={images} 
                    alt={title} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <p className={`mt-3 ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-black'
                }`}>News</p>
                <h3 className={`text-xl font-semibold mt-5 ${
                  darkMode ? 'text-[#FFFFFF]' : 'text-black'
                }`}>{title}</h3>
                <p className={`mt-2 text-sm ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-black'
                }`}>{description}</p>
                <div className="flex items-center mt-4 mb-5">
                  <Image src="/HOD.jpeg" 
                  alt="HOD" 
                  width={40} 
                  height={40} 
                  className="rounded-full" />
                  <div className="ml-1 flex flex-col">
                    <p className={`font-bold ${
                      darkMode ? 'text-[#FFFFFF]' : 'text-black'
                    }`}>{Author}</p>
                    <div className="flex gap-[1px] text-sm">
                      <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>{DatePosted}</p>
                      <DotIcon/>
                      <p className={darkMode ? 'text-[#EDF3F8]' : 'text-black'}>{TimeRead}</p>
                    </div>
                  </div>
                  
                </div>
                 <div className="flex text-md">
                      <p className={`${darkMode? 'text-white':'text-black'}`}>Read More</p>
                      <ArrowRight/>
                    </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollAnimationSection>

      <Footer />
    </div>
  );
}