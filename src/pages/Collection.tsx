import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/store/ProductCard';
import { cn } from '../lib/utils';

export default function Collection() {
  const { cat } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(2000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (cat && cat !== 'all') {
        query = query.eq('category', cat);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [cat]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.sale_price - b.sale_price;
    if (sortBy === 'price-high') return b.sale_price - a.sale_price;
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  }).filter(p => p.sale_price <= priceRange);

  const categoryTitle = cat === 'all' ? 'ALL PRODUCTS' : cat?.toUpperCase();

  return (
    <div className="bg-[#0A0A0A] min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[40vh] bg-[#111] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-bebas tracking-wider text-white relative z-10"
        >
          {categoryTitle}
        </motion.h1>
        <p className="text-gray-400 font-dm tracking-[0.3em] uppercase mt-4 relative z-10">
          Premium Audio Experience
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 space-y-12">
            <div className="space-y-6">
              <h3 className="text-white font-bebas tracking-widest text-xl flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-[#FF3B30]" /> FILTERS
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price Range</span>
                  <span className="text-white font-bold">Up to ₹{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-[#FF3B30]"
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1A1A1A]">
                <h4 className="text-white font-bebas tracking-widest">FEATURES</h4>
                {['ANC', 'Touch Controls', 'Fast Charging', 'Water Resistant'].map(f => (
                  <label key={f} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-5 h-5 border-2 border-[#1A1A1A] group-hover:border-[#FF3B30] rounded flex items-center justify-center transition-colors">
                      <div className="w-2 h-2 bg-[#FF3B30] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-gray-400 group-hover:text-white transition-colors font-dm text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
              <p className="text-gray-400 font-dm text-sm">Showing {sortedProducts.length} products</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-white font-bebas tracking-widest border border-[#1A1A1A] px-4 py-2 rounded-full"
                >
                  <Filter size={16} /> FILTERS
                </button>

                <div className="relative group">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#1A1A1A] text-white font-bebas tracking-widest px-6 py-2 pr-10 rounded-full border border-[#2A2A2A] focus:outline-none focus:border-[#FF3B30] cursor-pointer"
                  >
                    <option value="featured">FEATURED</option>
                    <option value="price-low">PRICE: LOW TO HIGH</option>
                    <option value="price-high">PRICE: HIGH TO LOW</option>
                    <option value="newest">NEWEST</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#1A1A1A] rounded-2xl h-[450px] animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6">
                <h3 className="text-3xl font-bebas tracking-wider text-white">NO PRODUCTS FOUND</h3>
                <p className="text-gray-400 font-dm">Try adjusting your filters or check back later.</p>
                <Link to="/collections/all" className="inline-block bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest hover:bg-red-700 transition-colors">
                  VIEW ALL PRODUCTS
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] rounded-t-[2rem] p-8 z-[101] max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bebas tracking-wider text-white">FILTERS</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-white"><X size={24} /></button>
              </div>
              {/* Mobile Filter Content (same as desktop sidebar) */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-dm">Price Range</span>
                    <span className="text-white font-bold">Up to ₹{priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-[#FF3B30]"
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-bebas tracking-widest text-xl">FEATURES</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['ANC', 'Touch Controls', 'Fast Charging', 'Water Resistant'].map(f => (
                      <label key={f} className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                        <input type="checkbox" className="accent-[#FF3B30] w-5 h-5" />
                        <span className="text-gray-300 font-dm text-sm">{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-[#FF3B30] text-white py-4 rounded-full font-bebas tracking-widest text-xl"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
