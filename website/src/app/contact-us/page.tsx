'use client';
import Header from "../component/navbar";

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
      
    </div>
  )
}
