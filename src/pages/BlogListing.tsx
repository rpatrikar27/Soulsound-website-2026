import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BlogListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setBlogs(data || []);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-[#0D0D0D] text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent" />
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bebas tracking-wider leading-tight">SOULSOUND BLOG</h1>
          <p className="text-xl text-gray-400 font-dm tracking-widest uppercase">Audio Insights, Tech, and Lifestyle</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-[2rem] h-[500px] animate-pulse" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blogs/${blog.slug}`}
                className="group bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-[#2A2A2A] hover:border-[#FF3B30] transition-all flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={blog.thumbnail_url} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-[#FF3B30]">
                    <span>{blog.category}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-gray-500">{new Date(blog.published_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-bebas tracking-wider text-white leading-tight group-hover:text-[#FF3B30] transition-colors">{blog.title}</h2>
                  <p className="text-gray-400 font-dm text-sm leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  <div className="pt-4 mt-auto flex items-center gap-2 text-white font-bebas tracking-widest text-lg group-hover:translate-x-2 transition-transform">
                    READ MORE <ArrowRight size={18} className="text-[#FF3B30]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-6">
            <h3 className="text-3xl font-bebas tracking-wider text-white">NO BLOGS FOUND</h3>
            <p className="text-gray-400 font-dm">Check back later for more updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
