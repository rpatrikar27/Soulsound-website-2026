import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MessageSquare, Clock, ChevronDown, ChevronUp, Send, CheckCircle2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const FAQS = [
  { q: "What is the warranty period?", a: "All SoulSound products come with a 12-month (1 year) limited warranty from the date of purchase." },
  { q: "How do I claim warranty?", a: "To claim warranty, please email us at support@soulsound.in with your order ID and a short video of the issue. Our team will guide you through the process." },
  { q: "What is your return policy?", a: "We offer a 7-day replacement policy for manufacturing defects. Items must be in original packaging with all accessories." },
  { q: "How long does shipping take?", a: "Orders are typically delivered within 3-5 business days across India." },
  { q: "Do you ship across India?", a: "Yes, we provide free shipping to all serviceable pincodes across India." },
  { q: "How do I track my order?", a: "Once shipped, you will receive a tracking link via email and SMS. You can also track it on our 'Track Order' page." },
  { q: "What payment methods do you accept?", a: "We accept all major UPI apps, Debit/Credit cards, and Net Banking via Razorpay." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement or before they are shipped, whichever is earlier." },
  { q: "Are earbuds compatible with all phones?", a: "Yes, SoulSound earbuds use universal Bluetooth v5.3 and are compatible with all Android, iOS, and Windows devices." },
  { q: "How do I pair my earbuds?", a: "Simply take the earbuds out of the case, turn on Bluetooth on your device, and select 'SoulSound [Model Name]' from the list." },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="bg-[#0A0A0A] text-white pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-[#0D0D0D] text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent" />
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bebas tracking-wider leading-tight">WE'RE HERE TO HELP</h1>
          <p className="text-xl text-gray-400 font-dm tracking-widest uppercase">Customer Support & FAQs</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Form */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-bebas tracking-wider">GET IN TOUCH</h2>
              <p className="text-gray-400 font-dm leading-relaxed">Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1A1A1A] p-12 rounded-[3rem] border border-[#4ADE80] text-center space-y-6"
              >
                <CheckCircle2 size={64} className="text-[#4ADE80] mx-auto" />
                <h3 className="text-3xl font-bebas tracking-wider text-white">MESSAGE SENT!</h3>
                <p className="text-gray-400 font-dm">Thank you for reaching out. We'll be in touch shortly.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="bg-[#FF3B30] text-white px-10 py-3 rounded-full font-bebas tracking-widest hover:bg-red-700 transition-all"
                >
                  SEND ANOTHER
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-500">NAME</label>
                    <input required type="text" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL</label>
                    <input required type="email" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">ORDER ID (OPTIONAL)</label>
                  <input type="text" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">MESSAGE</label>
                  <textarea required rows={5} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors resize-none" />
                </div>
                <button 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-[#FF3B30] text-white py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? "SENDING..." : "SEND MESSAGE"} <Send size={20} />
                </button>
              </form>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-[#1A1A1A]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FF3B30]"><Mail size={24} /></div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL</p>
                  <p className="text-white font-dm">support@soulsound.in</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FF3B30]"><Phone size={24} /></div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500">PHONE</p>
                  <p className="text-white font-dm">+91 82080 49909</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FF3B30]"><Clock size={24} /></div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500">HOURS</p>
                  <p className="text-white font-dm">Mon - Sat | 10AM - 7PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FF3B30]"><MessageSquare size={24} /></div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-500">WHATSAPP</p>
                  <a href="https://wa.me/918208049909" className="text-[#FF3B30] font-dm hover:underline">Chat with us</a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-12">
            <h2 className="text-5xl font-bebas tracking-wider">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className={cn("text-xl font-bebas tracking-widest transition-colors", openFaq === i ? "text-[#FF3B30]" : "text-white group-hover:text-[#FF3B30]")}>
                      {faq.q.toUpperCase()}
                    </span>
                    {openFaq === i ? <ChevronUp className="text-[#FF3B30]" /> : <ChevronDown className="text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 text-gray-400 font-dm leading-relaxed border-t border-[#2A2A2A] pt-6">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
