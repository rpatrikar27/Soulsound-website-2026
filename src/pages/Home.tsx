import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Truck, Zap, Droplets, ArrowRight, Star, Send, Headphones } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/store/ProductCard';

const TESTIMONIALS = [
  { name: "Kapil Pandya", rating: 5, text: "Love the sound quality! The bass is so rich and clear, feels like a live concert. Definitely recommend SoulSound!" },
  { name: "Manisha Sharma", rating: 5, text: "Best decision ever! Touch controls are smooth and battery life is insane. Perfect for long commutes." },
  { name: "Shanaya", rating: 5, text: "SoulSound's soundstage is on another level. Like having the band right in my ears." },
];

export default function Home() {
  const [banners, setBanners] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: bannerData } = await supabase.from('banners').select('*').eq('position', 'hero').eq('is_active', true).order('sort_order');
      setBanners(bannerData || []);

      const { data: products } = await supabase.from('products').select('*').eq('is_bestseller', true).eq('is_active', true).limit(4);
      setBestSellers(products || []);

      const { data: featured } = await supabase.from('products').select('*').eq('is_featured', true).single();
      setFeaturedProduct(featured);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  return (
    <div className="space-y-0">
      {/* Section 1 — Hero Slider */}
      <section className="relative h-[calc(100vh-80px)] overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {banners.length > 0 ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img 
                src={banners[currentSlide].image_url} 
                alt={banners[currentSlide].title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full flex items-end justify-center gap-1 px-10">
                  {[...Array(40)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [20, 100, 40, 120, 20] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                      className="w-2 bg-[#FF3B30] rounded-t-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-9xl font-bebas leading-[0.85] text-white">
              EXPERIENCE <span className="text-[#FF3B30]">SOUND</span><br />
              EXPERIENCE LIFE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-dm max-w-xl">
              Premium TWS Earbuds | Free Shipping | 1 Year Warranty
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/collections/earbuds" className="bg-[#FF3B30] text-white px-10 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-2 group">
                SHOP NOW <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/collections/all" className="border border-white text-white px-10 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-white hover:text-black transition-all">
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {banners.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-12 bg-[#FF3B30]' : 'w-4 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section 2 — Trust Strip */}
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Shield className="text-[#FF3B30]" size={32} />
              <span className="text-white font-bebas tracking-widest text-lg">1 YEAR WARRANTY</span>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Truck className="text-[#FF3B30]" size={32} />
              <span className="text-white font-bebas tracking-widest text-lg">FREE SHIPPING</span>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Zap className="text-[#FF3B30]" size={32} />
              <span className="text-white font-bebas tracking-widest text-lg">FAST CHARGING</span>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Droplets className="text-[#FF3B30]" size={32} />
              <span className="text-white font-bebas tracking-widest text-lg">WATER RESISTANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Explore by Category */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bebas tracking-wider text-white mb-12 text-center">EXPLORE BY CATEGORY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'EARBUDS', slug: 'earbuds', img: 'https://picsum.photos/seed/earbuds/800/1000' },
              { name: 'HEADPHONES', slug: 'headphones', img: 'https://picsum.photos/seed/headphones/800/1000' },
              { name: 'NECKBANDS', slug: 'neckbands', img: 'https://picsum.photos/seed/neckband/800/1000' },
            ].map((cat) => (
              <Link 
                key={cat.slug} 
                to={`/collections/${cat.slug}`}
                className="group relative h-[500px] rounded-3xl overflow-hidden border border-[#1A1A1A] hover:border-[#FF3B30] transition-colors"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-bebas tracking-widest text-white mb-2">{cat.name}</h3>
                  <span className="text-[#FF3B30] font-dm font-bold flex items-center gap-2">
                    SHOP NOW <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Best Sellers */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-bebas tracking-wider text-white">BEST SELLERS</h2>
            <Link to="/collections/all" className="text-[#FF3B30] font-bebas tracking-widest text-xl hover:underline">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.length > 0 ? (
              bestSellers.map(p => <ProductCard key={p.id} product={p} />)
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-2xl h-[400px] animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Section 5 — Tech Feature Section */}
      <section className="py-24 bg-[#111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-6xl font-bebas tracking-wider text-white leading-tight">TECHNOLOGY AT THE CORE</h2>
              <p className="text-xl text-gray-400 font-dm leading-relaxed">
                At SoulSound, technology is at the core of our vision. From precision-tuned audio engineering and rigorous quality control to smart supply chains and scalable digital ecosystems, we are creating audio products designed for performance, reliability, and future-ready innovation.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Headphones />, title: "PRECISION AUDIO" },
                  { icon: <Shield />, title: "QUALITY CONTROL" },
                  { icon: <Zap />, title: "SMART SUPPLY CHAIN" },
                  { icon: <Droplets />, title: "DIGITAL ECOSYSTEM" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] hover:border-[#FF3B30] transition-colors">
                    <div className="text-[#FF3B30] mb-4">{item.icon}</div>
                    <h4 className="text-white font-bebas tracking-widest text-lg">{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF3B30] blur-[150px] opacity-10 rounded-full" />
              <img 
                src="https://picsum.photos/seed/tech/800/800" 
                alt="Tech" 
                className="relative rounded-3xl border border-[#2A2A2A] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Featured Product Spotlight */}
      {featuredProduct && (
        <section className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-[#1A1A1A] rounded-[3rem] overflow-hidden border border-[#2A2A2A] flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 p-12">
                <img src={featuredProduct.images[0]} alt={featuredProduct.name} className="w-full h-auto object-contain" />
              </div>
              <div className="lg:w-1/2 p-12 lg:pr-24 space-y-6">
                <span className="bg-[#D4A853] text-black px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase">CEO SERIES</span>
                <h2 className="text-7xl font-bebas tracking-wider text-white leading-[0.9]">{featuredProduct.name}</h2>
                <div className="space-y-4">
                  {[
                    "Top-Notch Audio Engineering",
                    "Intuitive Touch Controls",
                    "Ergonomic Professional Fit",
                    "1 Year Hassle-Free Warranty"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-[#FF3B30] rounded-full" />
                      <span className="font-dm">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6">
                  <Link to={`/products/${featuredProduct.slug}`} className="bg-[#FF3B30] text-white px-12 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all inline-block">
                    BUY NOW →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 7 — Testimonials */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bebas tracking-wider text-white mb-16 text-center">WHAT OUR CUSTOMERS SAY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#1A1A1A] p-10 rounded-3xl border border-[#2A2A2A] space-y-6">
                <div className="flex gap-1 text-[#D4A853]">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 font-dm italic text-lg leading-relaxed">"{t.text}"</p>
                <div className="pt-4 border-t border-[#2A2A2A]">
                  <p className="text-white font-bebas tracking-widest text-xl">{t.name.toUpperCase()}</p>
                  <p className="text-[#FF3B30] text-xs font-bold tracking-widest">VERIFIED BUYER</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Newsletter CTA */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#FF3B30]/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-6xl font-bebas tracking-wider text-white">STAY IN THE LOOP</h2>
          <p className="text-xl text-gray-400 font-dm">Be the first to know about new drops, exclusive sales, and audio tips.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-8 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
              required
            />
            <button className="bg-[#FF3B30] text-white px-12 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
