'use client';
import Header from "./component/navbar";
import Footer from "./component/footer";
import { useDarkMode } from '@/contexts/DarkModeContext';
import Link from "next/link";
import GallerySlideshow from "./component/gallery";
import { ArrowRight, DotIcon, CheckCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content?: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Home() {
  const { darkMode } = useDarkMode();
  const [news, setNews] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const values = [
    {
      image: "/setting-2.png",
      title: "Technological Advancement",
      description: "Drive innovation through cutting-edge research and practical applications in electrical and electronics engineering, keeping the industry at the forefront of technology.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      image: "/book.png",
      title: "Industry-Ready Education",
      description: "Equip students with technical skills, problem-solving mindset, and hands-on experience needed to excel in engineering and technology roles.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      image: "/radioactive-alert.png",
      title: "Sustainable Engineering",
      description: "Develop eco-friendly and energy-efficient technologies that address real-world challenges in power systems, telecommunications, and automation.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const Programs = [
    {
      title: "Undergraduate Programs",
      description: "B.Eng. Electrical & Electronics Engineering",
      icon: "🎓",
      points: [
        "Foundation in circuit design, power systems, and telecommunications",
        "Hands-on laboratory sessions and real-world project experience",
        "Internship opportunities with top engineering firms"
      ],
    },
    {
      title: "Postgraduate Programs",
      description: "M.Eng. Electrical & Electronics Engineering",
      icon: "📚",
      points: [
        "Advanced research in embedded systems, power electronics, and automation",
        "Industry collaborations for cutting-edge innovation"
      ],
    },
    {
      title: "Ph.D. Programs",
      description: "Ph.D. Electrical & Electronics Engineering",
      icon: "🔬",
      points: [
        "Pioneering research in artificial intelligence, smart grids, and sustainable energy",
        "Supervision from world-class faculty and researchers"
      ],
    }
  ];

  // Fetch news from blogs.json
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/blogs.json');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data: BlogPost[] = await response.json();
        const sortedNews = data
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setNews(sortedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className={darkMode ? 'bg-[#070E12] min-h-screen' : 'bg-white min-h-screen'}>
      {/* Hero Section */}
      <div className="relative bg-cover bg-center bg-no-repeat h-screen bg-[image:var(--bg-Faculty)] overflow-hidden">
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#101E2799] via-[#101E27CC] to-[#070E12DD]"></div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
        </motion.div>

        <Header />
        
        <motion.section 
          className="relative z-10 flex flex-col justify-center items-start px-[4.27%] md:px-[7.78%] h-screen text-white"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="max-w-4xl" >
            <motion.h1 
              className="max-w-[35rem] text-3xl md:text-5xl"
              
            >
              Welcome to the Department of{' '}
              <span className="max-w-[29rem] font-extralight mt-4">
                Electrical & Electronics Engineering
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl font-light mb-8 text-blue-100 max-w-2xl leading-relaxed"
              
            >
              Committed to excellence in education and research. Join us in shaping the future through knowledge and innovation.
            </motion.p>
            
           
          </motion.div>
        </motion.section>
      </div>

      {/* Welcome Message from the HOD */}
      <motion.section 
        className={`py-20 ${darkMode ? 'bg-[#070E12]' : 'bg-white'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative group"
              
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                src="/HOD.jpeg" 
                alt="Head of Department Dr. Olurotimi O. Awodiji" 
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              
            >
              <div>
                <motion.h2 
                  className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  
                >
                  Welcome Message from the{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    HOD
                  </span>
                </motion.h2>
              </div>
              
              <motion.blockquote 
                className={`text-lg leading-relaxed italic border-l-4 border-blue-500 pl-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                
              >
                "At our department, we are committed to pushing the boundaries of knowledge, preparing students to be industry-ready, and fostering a culture of innovation. Whether you are a prospective student, a researcher, or an industry partner, we invite you to explore our programs and collaborate with us in shaping the future of technology."
              </motion.blockquote>
              
              <motion.div 
                className="flex items-center space-x-4 pt-4"
                
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  OA
                </div>
                <div>
                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dr. Olurotimi O. Awodiji
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Head of Department
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-[#0F1419] via-[#101E27] to-[#1a2332] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            
          >
            <h3 className="text-blue-400 font-semibold text-lg mb-4 tracking-wide uppercase">
              Our Mission and Vision
            </h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Our Guiding Principles:{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Innovation, Excellence, and Impact
              </span>
            </h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div 
                key={value.title}
                className="group relative"
                
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative bg-gradient-to-br from-[#1a2332] to-[#101E27] p-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm group-hover:border-blue-500/40 transition-all duration-500 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-xl p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <img 
                      src={value.image} 
                      alt={value.title} 
                      className="w-full h-full object-contain filter brightness-0 invert" 
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Welcome Message from the Dean */}
      <motion.section 
        className={`py-20 ${darkMode ? 'bg-[#070E12]' : 'bg-gray-50'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6 order-2 lg:order-1"
              
            >
              <div>
                <motion.h2 
                  className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  
                >
                  Welcome Message from the{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dean
                  </span>
                </motion.h2>
              </div>
              
              <motion.blockquote 
                className={`text-lg leading-relaxed italic border-l-4 border-purple-500 pl-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                
              >
                "Welcome to the Faculty of Engineering, University of Jos. Our mission is to cultivate excellence in engineering education, research, and innovation across all disciplines. We take pride in producing graduates who are not only academically grounded but also equipped with the practical skills and leadership qualities needed to drive progress in society."
              </motion.blockquote>
              
              <motion.div 
                className="flex items-center space-x-4 pt-4"
                
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  RD
                </div>
                <div>
                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Prof. Rose Daffi
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    Dean, Faculty of Engineering
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative group order-1 lg:order-2"
              
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                src="/DEAN.png" 
                alt="Dean Prof. Rose Daffi" 
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Academic Programs */}
      <motion.section 
        className={`py-20 ${darkMode ? 'bg-gradient-to-br from-[#070E12] to-[#0F1419]' : 'bg-white'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Academic{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Programs
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our department offers a comprehensive curriculum designed to equip students with cutting-edge knowledge, hands-on experience, and industry-ready skills.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {Programs.map((program, index) => (
              <motion.div 
                key={program.title}
                className="group relative"
                
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`h-full p-8 rounded-2xl border transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-[#1a2332] to-[#101E27] border-gray-700 group-hover:border-emerald-500/50' 
                    : 'bg-white border-gray-200 group-hover:border-emerald-500/50 shadow-lg group-hover:shadow-xl'
                }`}>
                  <div className="text-4xl mb-6">{program.icon}</div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-emerald-500 transition-colors`}>
                    {program.title}
                  </h3>
                  
                  <p className={`text-sm mb-6 font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {program.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {program.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Welcome Message from NIEEES President */}
      <motion.section 
        className={`py-20 ${darkMode ? 'bg-[#070E12]' : 'bg-gray-50'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative group"
              
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img 
                src="/logo.png" 
                alt="NIEEES " 
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              
            >
              <div>
                <motion.h2 
                  className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  
                >
                  Welcome Message from the{' '}
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    NIEEES
                  </span>
                </motion.h2>
              </div>
              
              <motion.blockquote 
                className={`text-lg leading-relaxed italic border-l-4 border-orange-500 pl-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                
              >
                "On behalf of the Nigerian Institution of Electrical and Electronics Engineers Students (NIEEES), University of Jos Chapter, I warmly welcome you to our department's platform. As student engineers, we are passionate about creativity, teamwork, and innovation that solve real-world challenges."
              </motion.blockquote>
              
              <motion.div 
                className="flex items-center space-x-4 pt-4"
                
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  NU
                </div>
                <div>
                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    NIEEES UNIJOS
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Gallery Slideshow */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        
      >
        <GallerySlideshow darkMode={darkMode} />
      </motion.section>

      {/* News Section */}
      <motion.section 
        className={`py-20 ${darkMode ? 'bg-gradient-to-br from-[#070E12] to-[#0F1419]' : 'bg-white'}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12"
            
          >
            <div>
              <p className={`text-sm font-semibold tracking-wide uppercase mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Updates
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Latest Department{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  News
                </span>
              </h2>
              <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Stay informed with our latest updates and events.
              </p>
            </div>
            
            <Link href='/blog'>
              <motion.button 
                className={`mt-6 lg:mt-0 px-6 py-3 border-2 rounded-full font-semibold transition-all duration-300 ${
                  darkMode 
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All News
              </motion.button>
            </Link>
          </motion.div>

          {/* Loading/Error States */}
          {isLoading && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading news...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {!isLoading && !error && news.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>No news available.</p>
            </motion.div>
          )}

          {/* News Grid */}
          {!isLoading && !error && news.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {news.map((article, index) => (
                <motion.article 
                  key={article.id}
                  className="group cursor-pointer"
                  
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-[#1a2332] to-[#101E27] border border-gray-700 group-hover:border-blue-500/50' 
                      : 'bg-white border border-gray-200 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-xl'
                  }`}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          News
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {article.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {article.description}
                      </p>
                      
                      <Link 
                        href={`/blog/${article.id}`} 
                        className={`inline-flex items-center gap-2 mt-4 font-semibold text-sm group-hover:gap-3 transition-all ${
                          darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}