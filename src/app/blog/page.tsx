'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

export default function Blog() {
    const { darkMode } = useDarkMode();
    const [activeCategory, setActiveCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All Articles', 'News', 'Department', 'Student Life', 'Research'];

    const blogPosts = [
        {
            id: 1,
            title: "How Our Final-Year Students Built a Campus-wide Inverter System",
            description: "A behind-the-scenes look at how EEE 500-level students solved real energy problems with hands-on solutions.",
            category: "News",
            author: "Dr. Smith",
            date: "July 1, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        },
        {
            id: 2,
            title: "Departmental Week Returns — Bigger and Better!",
            description: "From tech talks to robotics showdowns, here's what to expect from this year's highly anticipated Departmental Week.",
            category: "Announcements",
            author: "Dr. Smith",
            date: "June 25, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        },
        {
            id: 3,
            title: "How Our Final-Year Students Built a Campus-wide Inverter System",
            description: "A behind-the-scenes look at how EEE 500-level students solved real energy problems with hands-on solutions.",
            category: "Learning Resources",
            author: "Dr. Smith",
            date: "June 18, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        },
        {
            id: 4,
            title: "My Internship at Schneider Electric - What I Learned",
            description: "From theory to real-world design systems, an EE student shares how industrial experience changed everything.",
            category: "Student Life",
            author: "Dr. Smith",
            date: "May 29, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        },
        {
            id: 5,
            title: "How Our Final-Year Students Built a Campus-wide Inverter System",
            description: "A behind-the-scenes look at how EEE 500-level students solved real energy problems with hands-on solutions.",
            category: "Learning Resources",
            author: "Dr. Smith",
            date: "April 26, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        },
        {
            id: 6,
            title: "How Our Final-Year Students Built a Campus-wide Inverter System",
            description: "A behind-the-scenes look at how EEE 500-level students solved real energy problems with hands-on solutions.",
            category: "Learning Resources",
            author: "Dr. Smith",
            date: "March 15, 2025",
            readTime: "5mins Read",
            image: "/engineering-lab.jpg"
        }
    ];

    type CategoryType = 'News' | 'Announcements' | 'Learning Resources' | 'Student Life' | 'Research';

    const getCategoryColor = (category: string) => {
        const colors: Record<CategoryType, string> = {
            'News': darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
            'Announcements': darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            'Learning Resources': darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
            'Student Life': darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
            'Research': darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
        };
        return colors[category as CategoryType] || (darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-600');
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === 'All Articles' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={darkMode ? 'bg-[#070E12]' : 'bg-greyText'}>
            {/* Hero Section */}
            <div className="relative bg-cover bg-center bg-no-repeat h-[375px] bg-[image:var(--bg-gate)]">
                <div className="absolute inset-0 bg-[#101E2799]"></div>
                <Header />
                <section className="bg-no-repeat bg-cover flex flex-col">
                    <div className="px-[4.27%] md:px-[7.78%] h-[12.6rem] md:h-[23.438rem] w-full items-center text-white z-20 translate-y-3/4 md:translate-y-1/3 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold">Department Blog</h1>
                        <p className="font-extralight mt-4 max-w-3xl mx-auto">
                            News, projects, and stories from our students, staff, and alumni.
                        </p>
                    </div>
                </section>
            </div>

            {/* Articles Section */}
            <section className={`px-[4.27%] md:px-[7.78%] py-12 ${
                darkMode ? 'bg-[#070E12]' : 'bg-greyText'
            }`}>
                {/* Articles Header */}
                <div className="mb-8">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        darkMode ? 'text-[#FFFFFF]' : 'text-black'
                    }`}>Articles</h2>
                    <p className={`text-base md:text-lg leading-relaxed max-w-4xl ${
                        darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                    }`}>
                        Insights, updates, and real experiences from the Electrical & Electronics Engineering department — written by our students, staff, and alumni.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full lg:w-96">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                        }`} />
                        <input
                            type="text"
                            placeholder="search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navBlue focus:border-transparent ${
                                darkMode 
                                    ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' 
                                    : 'bg-white border-[#9CA3AF] text-black placeholder-gray-500'
                            }`}
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === category
                                        ? 'bg-navBlue text-white'
                                        : darkMode
                                            ? 'bg-[#101E27] text-[#EDF3F8] border border-[#101E27] hover:bg-[#1A2832]'
                                            : 'bg-white text-[#6B7280] border border-[#9CA3AF] hover:bg-gray-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className={`rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow ${
                            darkMode 
                                ? 'bg-[#101E27] border-[#101E27]' 
                                : 'bg-white border-[#E5E7EB]'
                        }`}>
                            {/* Article Image */}
                            <div className="relative h-48 bg-gray-200">
                                <Image
                                    src="/engineering-lab.jpg"
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-6">
                                <h3 className={`text-lg font-semibold mb-3 line-clamp-2 leading-tight ${
                                    darkMode ? 'text-[#FFFFFF]' : 'text-black'
                                }`}>
                                    {post.title}
                                </h3>
                                <p className={`text-sm mb-4 line-clamp-3 ${
                                    darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                                }`}>
                                    {post.description}
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">DS</span>
                                    </div>
                                    <div>
                                        <p className={`font-medium text-sm ${
                                            darkMode ? 'text-[#FFFFFF]' : 'text-black'
                                        }`}>{post.author}</p>
                                        <p className={`text-xs ${
                                            darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'
                                        }`}>{post.date} • {post.readTime}</p>
                                    </div>
                                </div>

                                {/* Read More Link */}
                                <button className={`font-medium text-sm hover:text-navBlue transition-colors flex items-center gap-1 ${
                                    darkMode ? 'text-[#EDF3F8]' : 'text-black'
                                }`}>
                                    Read More
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}