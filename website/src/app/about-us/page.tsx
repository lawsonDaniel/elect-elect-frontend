'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import Carousel from "../carousel";
import Image from 'next/image';

export default function AboutUs() {
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
        <div className="bg-greyText">
            <div className="relative bg-cover bg-center bg-no-repeat h-[375px] bg-[image:var(--bg-about)] ">
                    {/* <div className="absolute inset-0 bg-[#101E2799]"></div> */}
                    <Header />
                    {/* Hero Section */}
                    <section className="bg-no-repeat bg-cover flex flex-col ">
                      <div className="px-[4.27%] md:px-[7.78%] h-[12.6rem] md:h-[23.438rem] w-full items-center text-white  z-20 translate-y-3/4 md:translate-y-1/3 text-center">
                        <h1 className="text-3xl md:text-5xl">About Us</h1>
                        <p className=" font-extralight mt-4">Our department is dedicated to training the next generation of engineers, equipping them with the skills and knowledge to solve real-world challenges in power systems, telecommunications, automation, and emerging technologies.</p>
                      </div>
                    </section>
            </div>
                
            <section className="bg-greyText flex flex-col lg:flex-row w-full gap-5 mt-5">
                    <div className=" lg:mt-[13%] mx-[4.27%] lg:ml-[7.47%] lg:mx-0 ">
                      <h1 className="font-bold text-3xl md:text-3xl">Our story</h1>
                      <p className="mt-4 text-base md:text-lg leading-relaxed text-[#6B7280] ">
                      Founded with a vision to lead in engineering education and research, our department has grown into a center of excellence known for its cutting-edge curriculum, hands-on learning approach, and impactful research. We are committed to bridging the gap between theory and practice, ensuring our students are prepared for both academia and industry.
                      </p>
                    </div>
                    <Image src="/students.jpeg" alt="welcomeImage" width={592} height={404} className="mx-[4.27%] lg:mx-0 my-[4.5%] md:w-[97%] w-[91%] md:mx-auto lg:mr-[7.78%] rounded-lg"  layout="intrinsic"/>
            </section>
            <section className="py-16 px-4 md:py-24 max-w-7xl mx-auto flex flex-col lg:mx-[6.47%]">
                <h2 className="text-3xl md:text-5xl font-bold text-center lg:ml-auto  mb-16">Our Mission & Vision</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                    {/* Mission Section */}
                    <div className="relative">
                    <div className="absolute -z-10 opacity-10 text-[#6B7280] font-bold text-7xl md:text-9xl top-0 left-0">
                        MISSION
                    </div>
                    <div className="mb-6">
                        <Image 
                        src="/vision1.jpeg" 
                        alt="Study area with covered furniture" 
                        width={592} 
                        height={279} 
                        className="rounded-lg shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
                        To foster technological advancements, industry-ready education, 
                        and sustainable engineering solutions through research, 
                        innovation, and collaboration.
                    </p>
                    </div>
                    
                    {/* Vision Section */}
                    <div className="relative">
                    <div className="absolute -z-10 opacity-10 text-gray-300 font-bold text-7xl md:text-9xl top-0 right-0">
                        VISION
                    </div>
                    <p className="text-[#6B7280] text-base md:text-lg  leading-relaxed mb-6">
                        To be a globally recognized leader in electrical and electronics 
                        engineering, driving progress through cutting-edge research and 
                        world-class education.
                    </p>
                    <div>
                        <Image 
                        src="/vision2.jpeg" 
                        alt="Library shelves" 
                        width={592} 
                        height={279} 
                        className="rounded-lg shadow-lg w-full h-auto object-cover "
                        />
                    </div>
                    </div>
                </div>
            </section>
            
            <Carousel/>
            {/* Academic Programs */}
            <section className="bg-greyText p-6 md:p-12">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-black  mx-[7.78%]">Academic Programs</h2>
            <h2 className="text-center text-md font-light m-auto text-[#6B7280] -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%] mt-3">
                Our department offers a comprehensive curriculum designed to equip students with cutting-edge knowledge, hands-on experience, and industry-ready skills in electrical and electronics engineering. Whether you&apos;re starting your journey or advancing your expertise, we have the right program for you.
            </h2>
            <div className="mt-6 grid grid-row-1  lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%]">
                {Programs.map(({ title, description, points }) => (
                <div key={title} className=" bg-greyText p-6 rounded-lg border-[#9CA3AF] border-1 h-full flex flex-col mb-8">
                    <h3 className="text-xl font-semibold text-black">{title}</h3>
                    <p className="mt-2 text-[#6B7280] text-sm">{description}</p>
                    <ul className="mt-4 text-[#4B5563] text-left">
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
                    <button className="w-[7.75rem] h-[2.5rem] bg-transparent rounded-4xl border border-[#9CA3AF] flex items-center justify-center gap-2">
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