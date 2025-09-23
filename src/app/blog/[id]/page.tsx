'use client';
import Header from "../../component/navbar";
import Footer from "../../component/footer";
import Image from 'next/image';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  content: string;
}

export default function BlogPost() {
  const { darkMode } = useDarkMode();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/blogs.json');
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data: BlogPost[] = await response.json();
        const foundPost = data.find((p) => p.id === parseInt(id as string));
        setPost(foundPost || null);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      News: darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
      Announcements: darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
      'Student Life': darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
      Research: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
    };
    return colors[category] || (darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-100 text-gray-600');
  };

  if (isLoading) {
    return (
      <div className={darkMode ? 'bg-[#070E12] min-h-screen' : 'bg-gray-100 min-h-screen'}>
        <Header />
        <section className="px-[4.27%] md:px-[7.78%] py-12 text-center">
          <p className={`text-lg ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>Loading...</p>
        </section>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={darkMode ? 'bg-[#070E12] min-h-screen' : 'bg-gray-100 min-h-screen'}>
        <Header />
        <section className="px-[4.27%] md:px-[7.78%] py-12 text-center">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-[#FFFFFF]' : 'text-black'}`}>
            Blog Post Not Found
          </h2>
          <p className={`mt-4 ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
            The blog post you are looking for does not exist.
          </p>
          <Link
            href="/blog"
            className={`mt-4 inline-block text-sm font-medium hover:text-navBlue ${darkMode ? 'text-[#EDF3F8]' : 'text-black'}`}
          >
            Back to Blog
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'bg-[#070E12] min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <Header />
      <section className={`px-[4.27%] md:px-[7.78%] py-12 ${darkMode ? 'bg-[#070E12]' : 'bg-gray-100'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Blog Post Image */}
          <div className="relative w-full aspect-[16/9] mb-8">
            <img
              src={post.image}
              alt={post.title}
              
              className="object-cover rounded-lg"
             
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-sm font-medium rounded ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
          </div>

          {/* Blog Post Content */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-[#FFFFFF]' : 'text-black'}`}>
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">DS</span>
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
          <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
            {post.description}
          </p>
          <div className={`prose ${darkMode ? 'prose-invert text-[#EDF3F8]' : 'text-[#6B7280]'}`}>
            <p>{post.content}</p>
          </div>

          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className={`mt-8 inline-block text-sm font-medium hover:text-navBlue ${darkMode ? 'text-[#EDF3F8]' : 'text-black'}`}
          >
            ← Back to Blog
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}