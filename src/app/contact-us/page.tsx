'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import FAQSection from "../component/faq";
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function ContactUs() {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'bg-[#070E12]' : 'bg-greyText'}>
        <div className="relative bg-cover bg-center bg-no-repeat h-[375px] bg-[image:var(--bg-gate)]">
              <div className="absolute inset-0 bg-[#101E2799]"></div>
            <Header />
            {/* Hero Section */}
            <section className="bg-no-repeat bg-cover flex flex-col ">
                <div className="px-[4.27%] md:px-[7.78%] h-[12.6rem] md:h-[23.438rem] w-full items-center text-white  z-20 translate-y-3/4 md:translate-y-1/3 text-center">
                <h1 className="text-3xl md:text-5xl">Get in Touch with Us</h1>
                <p className=" font-extralight mt-4">Have questions? Need more information about our programs, research, or events? Our team is here to assist you! Reach out to us through any of the following channels.</p>
                </div>
            </section>
        </div>
         {/* 📍 Google Map Section */}
      <section className={`w-full px-4 md:px-[7.78%] mt-10 mb-10 ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className={`rounded-xl overflow-hidden shadow-lg border ${
          darkMode ? 'border-[#101E27]' : 'border-gray-300'
        }`}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.6249092312596!2d8.881982774077299!3d9.965132373635692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10536d4f475ba63b%3A0x57a5f389e07bc14a!2sFaculty%20of%20Engineering%2C%20University%20of%20Jos!5e0!3m2!1sen!2sng!4v1744476993351!5m2!1sen!2sng"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            style={{ border: 0 }}
          ></iframe>
        </div>
      </section>
      <section className={`px-[4.27%] md:px-[7.78%] py-2 ${
        darkMode ? 'bg-[#070E12]' : 'bg-greyText'
      }`}>
        <div className='grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
          <div className="">
            <MapPin size={28} className="bg-navBlue text-greyText p-1 rounded-md pt-2"/>
            <h2 className={`font-semibold text-lg pt-3 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-black'
            }`}>Our Location</h2>
            <p className={`text-sm font-semibold pt-3 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-black'
            }`}>Department of Electrical & Electronics Engineering</p>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}>Univerisity of Jos Permanent Site P.M.B 2084, Jos, Plateau State, Nigeria</p>
            <span className="flex flex-row gap-1 mt-2"> 
              <a
                href="https://www.google.com/maps/place/Faculty+of+Engineering,+University+of+Jos/@9.9651271,8.8845577,17z/data=!3m1!4b1!4m6!3m5!1s0x10536d4f475ba63b:0x57a5f389e07bc14a!8m2!3d9.9651271!4d8.8845577!16s%2Fg%2F11j3373hdg?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${
                  darkMode ? 'text-[#EDF3F8]' : 'text-black'
                }`}
              >
                 Find us on the map
              </a>
              <ArrowRight size={12} className={`translate-y-1/2 ${
                darkMode ? 'text-[#EDF3F8]' : 'text-black'
              }`}/>
            </span>
          </div>
          <div>
            <Phone size={28} className="bg-navBlue text-greyText p-1 rounded-md"/>
            <h2 className={`font-semibold text-lg pt-3 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-black'
            }`}>Contact Information</h2>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}> 
              <span className={`font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Email:</span> electrical.engineering@unijos.edu.ng
            </p>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}> 
              <span className={`font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Phone: </span>
              NIL
            </p>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}> 
              <span className={`font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Website: </span> 
              www.eeeunijos.com
            </p>
          </div>
          <div>
            <Clock size={28} className="bg-navBlue text-greyText p-1 rounded-md"/>
            <h2 className={`font-semibold text-lg pt-3 ${
              darkMode ? 'text-[#FFFFFF]' : 'text-black'
            }`}>Office Hours</h2>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}> 
              <span className={`font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Monday – Friday: </span>
              8:00 AM – 5:00 PM
            </p>
            <p className={`text-sm pt-3 ${
              darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
            }`}> 
              <span className={`font-semibold ${
                darkMode ? 'text-[#FFFFFF]' : 'text-black'
              }`}>Sartuday and Sunday: </span>
              Closed
            </p>
          </div>
        </div>
      </section>
      <FAQSection />
      <Footer/>
    </div>
  )
}