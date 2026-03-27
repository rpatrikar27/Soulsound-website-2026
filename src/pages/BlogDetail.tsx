import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBlog() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (data) {
        setBlog(data);
        // Fetch related blogs
        const { data: related } = await supabase
          .from('blogs')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);
        setRelatedBlogs(related || []);
      }
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">LOADING...</div>;
  if (!blog) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">BLOG NOT FOUND</div>;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <img 
          src={blog.thumbnail_url} 
          alt={blog.title} 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-24 max-w-7xl mx-auto space-y-6">
          <Link to="/blogs" className="flex items-center gap-2 text-white font-bebas tracking-widest text-lg hover:text-[#FF3B30] transition-colors">
            <ArrowLeft size={18} /> BACK TO BLOGS
          </Link>
          <div className="space-y-4">
            <span className="bg-[#FF3B30] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{blog.category}</span>
            <h1 className="text-5xl md:text-8xl font-bebas tracking-wider leading-tight text-white">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 font-dm text-sm uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={16} className="text-[#FF3B30]" /> {blog.author_name}</div>
              <div className="flex items-center gap-2"><Calendar size={16} className="text-[#FF3B30]" /> {new Date(blog.published_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content */}
        <article className="lg:col-span-8 space-y-12">
          <div className="prose prose-invert prose-red max-w-none font-dm text-gray-300 leading-relaxed text-lg">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* Share */}
          <div className="pt-12 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-6">
            <h3 className="text-2xl font-bebas tracking-wider text-white">SHARE THIS ARTICLE</h3>
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition-all"><Facebook size={20} /></button>
              <button className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition-all"><Twitter size={20} /></button>
              <button className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition-all"><Linkedin size={20} /></button>
              <button onClick={handleCopyLink} className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition-all"><Copy size={20} /></button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Related Posts */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#2A2A2A] space-y-8">
            <h3 className="text-3xl font-bebas tracking-wider text-white">RELATED POSTS</h3>
            <div className="space-y-8">
              {relatedBlogs.map((post) => (
                <Link key={post.id} to={`/blogs/${post.slug}`} className="group flex gap-4">
                  <div className="w-24 h-24 bg-black rounded-xl overflow-hidden flex-shrink-0">
                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-widest uppercase text-[#FF3B30]">{post.category}</p>
                    <h4 className="text-lg font-bebas tracking-wider text-white leading-tight group-hover:text-[#FF3B30] transition-colors">{post.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-[#FF3B30] p-8 rounded-[2rem] space-y-6">
            <h3 className="text-3xl font-bebas tracking-wider text-white">STAY UPDATED</h3>
            <p className="text-white/80 font-dm text-sm">Subscribe to our newsletter for the latest audio tech insights and exclusive offers.</p>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="w-full bg-black/20 border border-white/30 rounded-full px-6 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
              />
              <button className="w-full bg-white text-black py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-gray-100 transition-all">SUBSCRIBE</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
