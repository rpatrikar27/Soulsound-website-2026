import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppFloat() {
  const location = useLocation();
  const isHidden = ['/checkout', '/admin'].some(path => location.pathname.startsWith(path));

  if (isHidden) return null;

  return (
    <motion.a
      href="https://wa.me/918208049909?text=Hi%20SoulSound%2C%20I%20have%20a%20query%20regarding%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-[#25D366]/40 flex items-center justify-center group"
    >
      <MessageCircle size={28} />
      
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></span>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        CHAT WITH US
      </span>
    </motion.a>
  );
}
