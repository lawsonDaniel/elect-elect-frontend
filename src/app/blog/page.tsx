'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Blog() {
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
            'News': 'bg-orange-100 text-orange-600',
            'Announcements': 'bg-blue-100 text-blue-600',
            'Learning Resources': 'bg-green-100 text-green-600',
            'Student Life': 'bg-purple-100 text-purple-600',
            'Research': 'bg-red-100 text-red-600'
        };
        return colors[category as CategoryType] || 'bg-gray-100 text-gray-600';
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === 'All Articles' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-greyText">
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
            <section className="px-[4.27%] md:px-[7.78%] py-12">
                {/* Articles Header */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Articles</h2>
                    <p className="text-[#6B7280] text-base md:text-lg leading-relaxed max-w-4xl">
                        Insights, updates, and real experiences from the Electrical & Electronics Engineering department — written by our students, staff, and alumni.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-[#9CA3AF] rounded-lg focus:outline-none focus:ring-2 focus:ring-navBlue focus:border-transparent bg-white"
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
                        <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow">
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
                                <h3 className="text-lg font-semibold text-black mb-3 line-clamp-2 leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-[#6B7280] text-sm mb-4 line-clamp-3">
                                    {post.description}
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">DS</span>
                                    </div>
                                    <div>
                                        <p className="text-black font-medium text-sm">{post.author}</p>
                                        <p className="text-[#6B7280] text-xs">{post.date} • {post.readTime}</p>
                                    </div>
                                </div>

                                {/* Read More Link */}
                                <button className="text-black font-medium text-sm hover:text-navBlue transition-colors flex items-center gap-1">
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

            {/* Newsletter Subscription */}
            <section className="bg-[#1F2937] py-12">
                <div className="px-[4.27%] md:px-[7.78%]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-navBlue rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">EE</span>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <p className="text-white text-lg leading-relaxed max-w-2xl">
                            Subscribe to our newsletter for the latest updates on features and releases.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                        <input
                            type="email"
                            placeholder="Your email here"
                            className="flex-1 px-4 py-3 rounded-lg border border-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-navBlue"
                        />
                        <button className="px-8 py-3 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#B8941F] transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}