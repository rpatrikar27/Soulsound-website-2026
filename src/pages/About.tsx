import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Shield, Zap, Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FOUNDERS = [
  {
    name: "Rohit Ravindra Patrikar",
    role: "Co-founder",
    bio: "eCommerce operator who has scaled multiple national and D2C brands across India's marketplaces. SoulSound is built on real operational intelligence — consumer insights, data-driven decisions, and disciplined execution.",
    img: "https://picsum.photos/seed/rohit/400/400"
  },
  {
    name: "Chintan Anjaria",
    role: "Co-founder",
    bio: "Entrepreneur and investor. Founder of Paddle Point BPO Services Pvt. Ltd. Deep expertise in operations, finance, and long-term value creation. Approach rooted in transparency, quality, and discipline.",
    img: "https://picsum.photos/seed/chintan/400/400"
  }
];

export default function About() {
  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/10 to-transparent" />
        <div className="relative z-10 space-y-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-bebas tracking-wider leading-tight"
          >
            BUILT BY MUSIC LOVERS,<br />FOR MUSIC LOVERS
          </motion.h1>
          <p className="text-xl text-gray-400 font-dm tracking-widest uppercase">ESTABLISHED 2026 | NAGPUR, INDIA</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-6xl font-bebas tracking-wider text-white">TECHNOLOGY AT THE CORE</h2>
              <p className="text-xl text-gray-400 font-dm leading-relaxed">
                At SoulSound, technology is at the core of our vision. From precision-tuned audio engineering and rigorous quality control to smart supply chains and scalable digital ecosystems, we are creating audio products designed for performance, reliability, and future-ready innovation.
              </p>
              <p className="text-xl text-gray-400 font-dm leading-relaxed">
                Our journey began with a simple question: Why should premium audio be a luxury? We set out to bridge the gap between high-end performance and accessible value, ensuring every beat is felt, and every note is heard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Headphones size={32} />, title: "TECHNOLOGY", desc: "Precision audio engineering" },
                { icon: <Shield size={32} />, title: "QUALITY", desc: "Rigorous testing standards" },
                { icon: <Zap size={32} />, title: "VALUE", desc: "Premium sound, accessible price" },
                { icon: <Droplets size={32} />, title: "INNOVATION", desc: "Future-ready audio tech" },
              ].map((v, i) => (
                <div key={i} className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] hover:border-[#FF3B30] transition-colors group">
                  <div className="text-[#FF3B30] mb-4 group-hover:scale-110 transition-transform">{v.icon}</div>
                  <h4 className="text-white font-bebas tracking-widest text-xl mb-2">{v.title}</h4>
                  <p className="text-gray-500 text-sm font-dm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-6xl font-bebas tracking-wider text-white mb-16 text-center">MEET OUR FOUNDERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {FOUNDERS.map((f, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-[3rem] overflow-hidden border border-[#2A2A2A] flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 aspect-square">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="w-full md:w-1/2 p-10 space-y-4">
                  <h3 className="text-3xl font-bebas tracking-wider text-white">{f.name}</h3>
                  <p className="text-[#FF3B30] font-bebas tracking-widest text-lg">{f.role.toUpperCase()}</p>
                  <p className="text-gray-400 font-dm text-sm leading-relaxed">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FF3B30] blur-[200px] opacity-10 rounded-full -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <h2 className="text-7xl md:text-8xl font-bebas tracking-wider text-white leading-tight">READY TO EXPERIENCE SOULSOUND?</h2>
          <Link to="/collections/all" className="bg-[#FF3B30] text-white px-16 py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all inline-flex items-center gap-3 group">
            SHOP NOW <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
