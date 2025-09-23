'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySlideshow({ darkMode }: { darkMode: boolean }) {
  // Sample gallery images - replace with your actual image paths
  const galleryImages = [
    {
      src: "/gallery1.jpg",
      alt: "Laboratory Equipment",
      caption: "State-of-the-art laboratory facilities"
    },
    {
      src: "/gallery2.jpg", 
      alt: "Students Working",
      caption: "Students engaged in hands-on learning"
    },
    {
      src: "/gallery3.jpg",
      alt: "Research Project",
      caption: "Innovative research projects"
    },
    {
      src: "/gallery4.jpg",
      alt: "Department Building",
      caption: "Department of Electrical & Electronics Engineering"
    },
    {
      src: "/gallery5.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery6.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery7.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery8.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery9.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },{
      src: "/gallery10.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery11.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery12.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery13.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery914.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery15.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery16.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },
    {
      src: "/gallery917.jpg",
      alt: "Graduation Ceremony",
      caption: "Celebrating our graduates"
    },



  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className={`py-12 ${darkMode ? 'bg-[#070E12]' : 'bg-greyText'}`}>
      <div className="mx-[4.27%] md:mx-[7.78%]">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-4xl font-bold ${
            darkMode ? 'text-[#FFFFFF]' : 'text-black'
          }`}>
            Department Gallery
          </h2>
          <p className={`mt-3 text-md font-light ${
            darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
          }`}>
            Explore our facilities, students, and achievements through our photo gallery
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Image */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw"
              priority
            />
            
            {/* Overlay with caption
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white text-lg md:text-xl font-medium">
                {galleryImages[currentImageIndex].caption}
              </p>
            </div> */}

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === currentImageIndex
                    ? 'bg-navBlue scale-110'
                    : darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500' 
                      : 'bg-gray-400 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className={`text-center mt-4 text-sm ${
            darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
          }`}>
            {currentImageIndex + 1} of {galleryImages.length}
          </div>
        </div>
      </div>
    </section>
  );
}