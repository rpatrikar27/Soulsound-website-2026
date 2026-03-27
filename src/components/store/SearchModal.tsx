import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingBag, BookOpen, ArrowRight, TrendingUp, History, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface SearchResult {
  id: string;
  type: 'product' | 'blog';
  title: string;
  slug: string;
  image: string;
  price?: number;
  category?: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('soulsound_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : (document.querySelector('[data-search-trigger]') as HTMLElement)?.click();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      
      try {
        const [productsRes, blogsRes] = await Promise.all([
          supabase.from('products').select('*').ilike('name', `%${query}%`).limit(5),
          supabase.from('blogs').select('*').ilike('title', `%${query}%`).limit(3)
        ]);

        const formattedResults: SearchResult[] = [
          ...(productsRes.data || []).map(p => ({
            id: p.id,
            type: 'product' as const,
            title: p.name,
            slug: p.slug,
            image: p.images[0],
            price: p.sale_price,
            category: p.category
          })),
          ...(blogsRes.data || []).map(b => ({
            id: b.id,
            type: 'blog' as const,
            title: b.title,
            slug: b.slug,
            image: b.featured_image
          }))
        ];

        setResults(formattedResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const newRecent = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('soulsound_recent_searches', JSON.stringify(newRecent));
      onClose();
      navigate(`/collections/all?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Search className="text-[#FF3B30]" size={32} />
              <span className="text-white font-bebas tracking-widest text-3xl">SEARCH SOULSOUND</span>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-red-600 transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Search Input */}
          <div className="max-w-4xl mx-auto w-full px-4 py-12">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent border-b-2 border-[#1A1A1A] focus:border-[#FF3B30] py-8 text-4xl md:text-6xl font-bebas tracking-wider text-white focus:outline-none transition-colors placeholder:text-gray-800"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF3B30] transition-colors"
              >
                <ArrowRight size={48} />
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16">
              {/* Results */}
              <div className="md:col-span-8 space-y-8">
                {loading ? (
                  <div className="flex items-center gap-4 text-gray-500 font-bebas text-2xl tracking-widest">
                    <div className="w-8 h-8 border-2 border-[#FF3B30] border-t-transparent rounded-full animate-spin"></div>
                    SEARCHING...
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">TOP RESULTS</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {results.map((res) => (
                        <Link 
                          key={res.id} 
                          to={res.type === 'product' ? `/products/${res.slug}` : `/blog/${res.slug}`}
                          onClick={onClose}
                          className="flex gap-6 p-4 bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] hover:border-[#FF3B30] transition-all group"
                        >
                          <div className="w-24 h-24 bg-black rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={res.image} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center gap-1">
                            <div className="flex items-center gap-2">
                              {res.type === 'product' ? <ShoppingBag size={12} className="text-[#FF3B30]" /> : <BookOpen size={12} className="text-[#D4A853]" />}
                              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{res.type}</span>
                            </div>
                            <h5 className="text-xl font-bebas tracking-wider text-white group-hover:text-[#FF3B30] transition-colors">{res.title}</h5>
                            {res.price && <p className="text-sm text-gray-400 font-dm">₹{res.price.toLocaleString()}</p>}
                          </div>
                          <div className="flex items-center pr-4">
                            <ArrowRight size={20} className="text-gray-700 group-hover:text-[#FF3B30] transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : query.length >= 2 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-2xl font-bebas tracking-widest text-gray-500">NO RESULTS FOUND FOR "{query}"</p>
                    <p className="text-gray-600 font-dm">Try checking your spelling or use more general terms.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
                        <TrendingUp size={14} /> POPULAR SEARCHES
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {['SoulSound Pro', 'Active Noise Cancellation', 'Waterproof Earbuds', 'Gaming Mode', 'Bass Boost'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setQuery(s)}
                            className="bg-[#1A1A1A] border border-[#2A2A2A] px-6 py-2 rounded-full text-sm text-gray-400 hover:border-[#FF3B30] hover:text-white transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent & Trending */}
              <div className="md:col-span-4 space-y-12">
                {recentSearches.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
                        <History size={14} /> RECENT
                      </h4>
                      <button 
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('soulsound_recent_searches');
                        }}
                        className="text-[10px] font-bold tracking-widest uppercase text-gray-600 hover:text-red-500 transition-colors"
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentSearches.map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => setQuery(s)}
                          className="flex items-center justify-between w-full group"
                        >
                          <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                            <Clock size={14} />
                            <span className="text-sm font-dm">{s}</span>
                          </div>
                          <ArrowRight size={14} className="text-gray-800 group-hover:text-[#FF3B30] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#2A2A2A] space-y-6">
                  <h4 className="text-xl font-bebas tracking-wider text-white">FEATURED COLLECTION</h4>
                  <div className="aspect-square bg-black rounded-2xl overflow-hidden relative group cursor-pointer">
                    <img src="https://picsum.photos/seed/earbuds/400/400" alt="Featured" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <p className="text-xs font-bold tracking-widest uppercase text-[#FF3B30] mb-1">NEW ARRIVAL</p>
                      <h5 className="text-2xl font-bebas tracking-wider text-white">SOULSOUND ELITE</h5>
                      <Link to="/collections/earbuds" onClick={onClose} className="mt-4 text-xs font-bold tracking-widest uppercase text-white flex items-center gap-2 hover:gap-4 transition-all">
                        SHOP NOW <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
