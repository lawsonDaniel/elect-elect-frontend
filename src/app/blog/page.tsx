'use client';
import Header from "../component/navbar";
import Footer from "../component/footer";
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export default function Blog() {
  const { darkMode } = useDarkMode();
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All Articles', 'News', 'Announcements', 'Student Life', 'Research'];

  // Fetch blog posts from JSON file
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/blogs.json');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  type CategoryType = 'News' | 'Announcements' | 'Student Life' | 'Research';

  const getCategoryColor = (category: string) => {
    const colors: Record<CategoryType, string> = {
      News: darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
      Announcements: darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
      'Student Life': darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
      Research: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
    };
    return colors[category as CategoryType] || (darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-600');
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All Articles' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={darkMode ? 'bg-[#070E12] min-h-screen' : 'bg-gray-100 min-h-screen'}>
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
      <section className={`px-[4.27%] md:px-[7.78%] py-12 ${darkMode ? 'bg-[#070E12]' : 'bg-gray-100'}`}>
        {/* Articles Header */}
        <div className="mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-[#FFFFFF]' : 'text-black'}`}>
            Articles
          </h2>
          <p className={`text-base md:text-lg leading-relaxed max-w-4xl ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
            Insights, updates, and real experiences from the Electrical & Electronics Engineering department — written by our students, staff, and alumni.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navBlue focus:border-transparent ${
                darkMode ? 'bg-[#101E27] border-[#101E27] text-[#FFFFFF] placeholder-[#EDF3F8]' : 'bg-white border-[#9CA3AF] text-black placeholder-gray-500'
              }`}
            />
          </div>

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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <p className={`text-lg ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>Loading articles...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center">
            <p className={`text-lg ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
              No articles found matching your criteria.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow ${
                  darkMode ? 'bg-[#101E27] border-[#101E27]' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="relative w-full aspect-[16/9]">
                  <img
                    src={post.image}
                    alt={post.title}
                    
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-3 line-clamp-2 leading-tight ${darkMode ? 'text-[#FFFFFF]' : 'text-black'}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
                    {post.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">DS</span>
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-[#FFFFFF]' : 'text-black'}`}>
                        {post.author}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
                        {post.date} • {post.readTime}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className={`font-medium text-sm hover:text-navBlue transition-colors flex items-center gap-1 ${
                      darkMode ? 'text-[#EDF3F8]' : 'text-black'
                    }`}
                  >
                    Read More
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}