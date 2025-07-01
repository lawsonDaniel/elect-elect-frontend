'use client';
import Header from "./component/navbar";
import Footer from "./component/footer";
import Image from 'next/image';

export default function Home() {

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
    { images: "/research.png", title: "New Research Initiative Launched", description: "Our department is excited to announce a new research initiative." },
    { images: "/research.png",  title: "Upcoming Workshop on AI", description: "Join us for an engaging workshop on artificial intelligence applications." }
  ];

  return (
    <div className="bg-greyText">
      <div className="relative bg-cover bg-center bg-no-repeat h-screen bg-[image:var(--bg-Faculty)]">
        <div className="absolute inset-0 bg-[#101E2799]"></div>
        <Header />
        {/* Hero Section */}
        <section className="bg-no-repeat bg-cover flex flex-col">
          <div className="px-[4.27%] md:px-[7.78%] h-screen w-full items-center text-white z-20 translate-y-3/12 md:translate-y-1/3">
            <h1 className="max-w-[35rem] text-5xl">Welcome to Our Innovative Department</h1>
            <p className="max-w-[29rem] font-extralight mt-4">At our department, we are committed to excellence in education and research. Join us in shaping the future through knowledge and innovation.</p>
            <button className="bg-transparent backdrop-blur-lg border border-white/20 text-white px-4 py-2 rounded-lg cursor-pointer mt-5">Explore Our Programs</button>
          </div>
        </section>
      </div>

      {/* Welcome Message */}
      <section className="bg-greyText flex flex-col lg:flex-row w-full gap-5">
        <Image src="/welcome-img.png" alt="welcomeImage" width={592} height={562} className="mx-[4.27%] md:mx-[7.78%] lg:ml-[7.78%] my-[4.5%] md:w-[80%] w-[91%] "  layout="intrinsic"/>
        <div className="lg:mr-[7.78%] lg:mt-[13%] mx-[4.27%] md:mx-[7.78%]">
          <h1 className="font-bold text-lg md:text-3xl">Welcome Message from the HOD</h1>
          <p className="mt-4 text-sm md:text-lg leading-relaxed ">
          &quot;At our department, we are committed to pushing the boundaries of knowledge, preparing students to be industry-ready, and fostering a culture of innovation. Whether you are a prospective student, a researcher, or an industry partner, we invite you to explore our programs and collaborate with us in shaping the future of technology.&quot;
          </p>
          <div className="flex items-center mt-4 mb-5">
            <Image src="/Ellipse 1.png" alt="HOD" width={48} height={48} className="rounded-full"  layout="intrinsic"/>
            <div className="ml-3 flex flex-col">
              <p>HOD</p>
              <p className="font-bold">Dr. O. Awodiji</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-navBlue p-6 md:p-12">
        <h2 className="text-center text-md md:text-2xl font-light text-white">Our Mission and Vision</h2>
        <h2 className="text-center font-bold text-2xl md:text-4xl max-w-2xl m-auto mt-3 text-white">
          Our Guiding Principles: Innovation, Excellence, and Impact
        </h2>
        <div className="mt-6 grid grid-row-1 lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.6%] lg:mx-[4.6%]">
          {values.map(({ image, title, description }) => (
            <div key={title} className="bg-gray-800 p-6 rounded-lg text-center">
              <Image 
              src={image} 
              alt={title} 
              width={48} 
              height={48} 
              className="m-auto" 
              layout="intrinsic" />
              <h3 className="text-xl font-semibold text-white mt-5">{title}</h3>
              <p className="mt-2 text-[#D1D5DB] text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Programs */}
      <section className="bg-greyText p-6 md:p-12">
        <h2 className="text-center text-2xl md:text-4xl font-bold text-black  mx-[7.78%]">Academic Programs</h2>
        <h2 className="text-center text-md font-light m-auto text-[#6B7280] -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%] mt-3">
          Our department offers a comprehensive curriculum designed to equip students with cutting-edge knowledge, hands-on experience, and industry-ready skills in electrical and electronics engineering. Whether you&apos;re starting your journey or advancing your expertise, we have the right program for you.
        </h2>
        <div className="mt-6 grid grid-row-1 lg:grid-cols-3 gap-10 -mx-[1%] md:mx-[2.2%] lg:mx-[4.6%]">
          {Programs.map(({ title, description, points }) => (
            <div key={title} className="bg-greyText p-6 rounded-lg border-[#9CA3AF] border-1 h-full flex flex-col mb-8">
              <h3 className="text-xl font-semibold text-black">{title}</h3>
              <p className="mt-2 text-[#6B7280] text-sm">{description}</p>
              <ul className="mt-4 text-[#4B5563] text-left">
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
              <div className="mt-auto ml-auto">
                <button className="w-[7.75rem] h-[2.5rem] bg-transparent rounded-4xl border border-[#9CA3AF] flex items-center justify-center gap-2">
                  Enroll now
                  <Image src="/arrow.png" 
                  alt="arrow" 
                  width={16}
                  height={16}  
                  layout="intrinsic" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="bg-greyText mt-9">
        <div className="mx-[4.27%] md:mx-[7.78%]">
          <h2>Updates</h2>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mt-4">
              <h1 className="font-medium text-3xl md:text-4xl">Latest Department News</h1>
              <p>Stay informed with our latest updates and events.</p>
            </div>
            <button className="w-[6.313rem] h-[3rem] bg-transparent border border-[#9CA3AF] rounded-lg mt-2">View All</button>
          </div>
          <div className="mt-6 grid grid-row-1 lg:grid-cols-2 lg:-mx-[1.78%]">
            {news.map(({ images, title, description }) => (
              <div key={title} className="lg:p-4 rounded-lg text-left">
                <Image 
                src={images} 
                alt={title} 
                width={589} 
                height={314} 
                className="m-auto  md:w-full md:h-full rounded-lg" layout="intrinsic" />
                <p className="mt-3">News</p>
                <h3 className="text-xl font-semibold text-black mt-5">{title}</h3>
                <p className="mt-2 text-black text-sm">{description}</p>
                <div className="flex items-center mt-4 mb-5">
                  <Image src="/Ellipse 1.png" 
                  alt="HOD" 
                  width={48} 
                  height={48} 

                  className="rounded-full" />
                  <div className="ml-1 flex flex-col">
                    <p>HOD</p>
                    <p className="font-bold">Dr. O. Awodiji</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
