'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import FAQSection from "../component/faq";


export default function ContactUs() {
  return (
    <div className="bg-greyText">
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
      <section className="w-full px-4 md:px-[7.78%] mt-10 mb-10">
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-300">
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
      <FAQSection />
      <Footer/>
    </div>
  )
}
