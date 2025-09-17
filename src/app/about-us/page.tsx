'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import Carousel from "../component/carousel";
import Image from 'next/image';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { DotIcon } from "lucide-react";

export default function AboutUs() {
    const { darkMode } = useDarkMode();

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
    return (
        <div className={darkMode ? 'bg-[#070E12]' : 'bg-greyText'}>
            <div className="relative bg-cover bg-center bg-no-repeat h-[375px] bg-[image:var(--bg-about)] ">
                    <div className="absolute inset-0 bg-[#101E2799]"></div>
                    <Header />
                    {/* Hero Section */}
                    <section className="bg-no-repeat bg-cover flex flex-col ">
                      <div className="px-[4.27%] md:px-[7.78%] h-[12.6rem] md:h-[23.438rem] w-full items-center text-white  z-20 translate-y-3/4 md:translate-y-1/3 text-center">
                        <h1 className="text-3xl md:text-5xl">About Us</h1>
                        <p className=" font-extralight mt-4">Our department is dedicated to training the next generation of engineers, equipping them with the skills and knowledge to solve real-world challenges in power systems, telecommunications, automation, and emerging technologies.</p>
                      </div>
                    </section>
            </div>
                
            <section className={`flex flex-col lg:flex-row w-full gap-5 mt-5 ${
                darkMode ? 'bg-[#070E12]' : 'bg-greyText'
            }`}>
                    <div className=" lg:mt-[13%] mx-[4.27%] lg:ml-[7.47%] lg:mx-0 ">
                      <h1 className={`font-bold text-center lg:text-left text-3xl md:text-3xl ${
                        darkMode ? 'text-[#FFFFFF]' : 'text-black'
                      }`}>Our story</h1>
                      <p className={`mt-4 text-base md:text-lg leading-relaxed ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                      }`}>
                      Founded with a vision to lead in engineering education and research, our department has grown into a center of excellence known for its cutting-edge curriculum, hands-on learning approach, and impactful research. We are committed to bridging the gap between theory and practice, ensuring our students are prepared for both academia and industry.
                      </p>
                    </div>
                    <Image src="/students.jpeg" alt="welcomeImage" width={592} height={404} className="mx-[4.27%] lg:mx-0 my-[4.5%] md:w-[97%] w-[91%] md:mx-auto lg:mr-[7.78%] rounded-lg"  layout="intrinsic"/>
            </section>
            <section className={`py-8 px-4 md:py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:mx-[6.47%] ${
                darkMode ? 'bg-[#070E12]' : 'bg-greyText'
            }`}>
                <h2 className={`text-2xl md:text-4xl lg:text-4xl font-bold text-center lg:ml-auto mb-8 md:mb-14 lg:mb-16 ${
                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                }`}>Our Philosophy and Objectives</h2>
                
                <div className="space-y-12 md:space-y-16 lg:space-y-20">
                    {/* Philosophy Section */}
                   <div className="relative">
                        <h1 className={`absolute font-bold text-xl left-4/12  sm:text-2xl  md:text-3xl lg:text-7xl xl:text-8xl opacity-70 md:opacity-70 lg:opacity-20 -top-8 sm:-top-12 md:-top-12  md:left-1/2 md:-translate-x-1/2 lg:-left-4 lg:translate-x-0 z-0 ${ 
                            darkMode ? 'text-[#EDF3F8]' : 'text-[#000]'
                        }`}>
                            PHILOSOPHY
                        </h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
                            <div className="relative z-10 order-2 lg:order-1">
                                <Image 
                                    src="/vision1.jpeg" 
                                    alt="Study area with covered furniture" 
                                    width={592} 
                                    height={279} 
                                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                                />
                            </div>
                            <div className="relative z-10 order-1 lg:order-2">
                                <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${
                                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                                }`}>
                                    To impart Electrical and Electronic Engineering knowledge and skills at all levels to men and women of intellectual, moral, and spiritual grounds and background of all political beliefs in order to serve the needs of the nation and mankind in general.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Objectives Section */}
                    <div className="relative">
                        <h1 className={`absolute font-bold text-xl left-4/12  sm:text-2xl md:text-3xl lg:text-7xl xl:text-8xl opacity-70 md:opacity-70 lg:opacity-20 -top-6 sm:top-6 md:-top-8 lg:-top-16 md:-right-2 md:left-7/12 md:-translate-x-1/2 lg:-right-4 lg:translate-x-0 z-0 ${
                            darkMode ? 'text-[#EDF3F8]' : 'text-[#000]'
                        }`}>
                            OBJECTIVES
                        </h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-start">
                            <div className={`relative z-10 text-sm md:text-base lg:text-lg leading-relaxed ${
                                darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                            }`}>
                                <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                                    <DotIcon size={16} className="flex-shrink-0 mt-1 md:hidden" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <DotIcon size={20} className="hidden md:flex flex-shrink-0 mt-1" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <span>To design and develop suitable undergraduate programs and courses in all the fields of Electrical and Electronic Engineering of standard comparable to those of best Departments of Universities of similar status elsewhere.</span>
                                </div>
                                <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                                    <DotIcon size={16} className="flex-shrink-0 mt-1 md:hidden" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <DotIcon size={20} className="hidden md:flex flex-shrink-0 mt-1" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <span>To instruct and equip students with the technical knowledge and skills to understand and appreciate the development and to develop and produce components/systems/engineering products and services for better performance.</span>
                                </div>
                                <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                                    <DotIcon size={16} className="flex-shrink-0 mt-1 md:hidden" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <DotIcon size={20} className="hidden md:flex flex-shrink-0 mt-1" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <span>To benefit society in the advancement of all fields of Electrical and Electronic Engineering.</span>
                                </div>
                                <div className="flex items-start gap-2 md:gap-3">
                                    <DotIcon size={16} className="flex-shrink-0 mt-1 md:hidden" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <DotIcon size={20} className="hidden md:flex flex-shrink-0 mt-1" color={darkMode ? "#EDF3F8" : "black"}/>
                                    <span>To secure the fulfillment of Electrical and Electronic Engineering throughout Nigeria and the world at large.</span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <Image 
                                    src="/vision2.jpeg" 
                                    alt="Library shelves" 
                                    width={592} 
                                    height={279} 
                                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Carousel/>
            {/* Academic Programs */}
            <section className={`p-6 md:p-12 ${
                darkMode ? 'bg-[#070E12]' : 'bg-greyText'
            }`}>
            <h2 className={`text-center text-3xl md:text-4xl font-bold mx-[7.78%] ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
            }`}>Academic Programs</h2>
            <h2 className={`text-center text-md font-light m-auto -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%] mt-3 ${
                darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}>
                Our department offers a comprehensive curriculum designed to equip students with cutting-edge knowledge, hands-on experience, and industry-ready skills in electrical and electronics engineering. Whether you&apos;re starting your journey or advancing your expertise, we have the right program for you.
            </h2>
            <div className="mt-6 grid grid-row-1  lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%]">
                {Programs.map(({ title, description, points }) => (
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
                            <Image src="/check (1).png" alt="" width={16} height={16} className="h-full w-full object-contain block"  layout="intrinsic"/>
                        </div>
                        {point}
                        </li>
                    ))}
                    </ul>
                    <div className="mt-auto ml-auto">
                    <button className={`w-[7.75rem] h-[2.5rem] bg-transparent rounded-4xl border flex items-center justify-center gap-2 ${
                        darkMode 
                            ? 'border-[#101E27] text-[#EDF3F8]' 
                            : 'border-[#9CA3AF] text-black'
                    }`}>
                        Enroll now
                        <Image src="/arrow.png" alt="arrow" width={16} height={16}   />
                    </button>
                    </div>
                </div>
                ))}
            </div>
            </section>
            <Footer/>

        </div>
    );
    
}