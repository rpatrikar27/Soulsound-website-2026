import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import WhatsAppFloat from './WhatsAppFloat';
import { CartProvider } from '../../lib/cart-context';

export default function StoreLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-dm selection:bg-[#FF3B30] selection:text-white">
        <AnnouncementBar />
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WhatsAppFloat />
      
      {/* Global Brand Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        
        :root {
          --brand-red: #FF3B30;
          --brand-gold: #D4A853;
          --brand-black: #0A0A0A;
          --brand-card: #1A1A1A;
        }

        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.05em;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        ::-webkit-scrollbar-thumb {
          background: #1A1A1A;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2A2A2A;
        }
      `}</style>
    </CartProvider>
  );
}
