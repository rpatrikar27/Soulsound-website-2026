import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AnnouncementBar() {
  const [text, setText] = useState("🎧 1 Year Warranty | 🚚 Free Shipping Across India | ⚡ Fast Charging | 💧 Water Resistant | 🎵 40H Battery");

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'announcement_bar')
        .single();
      
      if (data && data.value) {
        setText(data.value.replace(/"/g, ''));
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white py-2 overflow-hidden border-b border-[#1A1A1A]">
      <div className="whitespace-nowrap animate-marquee inline-block">
        <span className="mx-4 text-xs font-medium tracking-widest uppercase">{text}</span>
        <span className="mx-4 text-xs font-medium tracking-widest uppercase">{text}</span>
        <span className="mx-4 text-xs font-medium tracking-widest uppercase">{text}</span>
        <span className="mx-4 text-xs font-medium tracking-widest uppercase">{text}</span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
