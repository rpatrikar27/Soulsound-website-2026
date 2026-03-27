import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Headphones, ArrowRight, Home, Search, ShoppingBag, Music, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NotFound() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#FF3B30]/5 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4A853]/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative z-10 text-center space-y-12 max-w-2xl">
        {/* Animated Icon */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-32 h-32 bg-[#1A1A1A] rounded-[2rem] border border-[#2A2A2A] flex items-center justify-center mx-auto shadow-2xl"
        >
          <VolumeX size={64} className="text-[#FF3B30]" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-[12rem] md:text-[16rem] font-bebas leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 opacity-20 select-none">
            404
          </h1>
          <div className="space-y-2 -mt-12 md:-mt-20">
            <h2 className="text-5xl md:text-7xl font-bebas tracking-wider">SILENCE IS GOLDEN, BUT...</h2>
            <p className="text-xl text-gray-400 font-dm">The page you're looking for has gone off the charts.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
          <Link 
            to="/" 
            className="bg-[#FF3B30] text-white px-12 py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#FF3B30]/20"
          >
            BACK TO HOME <Home size={24} />
          </Link>
          <Link 
            to="/collections/earbuds" 
            className="bg-[#1A1A1A] text-white px-12 py-5 rounded-full font-bebas tracking-widest text-2xl border border-[#2A2A2A] hover:border-white transition-all flex items-center justify-center gap-3"
          >
            SHOP EARBUDS <ShoppingBag size={24} />
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-12 flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest uppercase text-gray-500">
          <Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-2">
            <Search size={14} /> TRACK ORDER
          </Link>
          <Link to="/support" className="hover:text-white transition-colors flex items-center gap-2">
            <Headphones size={14} /> SUPPORT
          </Link>
          <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-2">
            <Music size={14} /> BLOG
          </Link>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-24 -left-24 opacity-5 pointer-events-none"
      >
        <Headphones size={400} />
      </motion.div>
    </div>
  );
}
