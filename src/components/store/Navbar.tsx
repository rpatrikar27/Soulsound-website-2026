import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Headphones } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { cn } from '../../lib/utils';

export default function Navbar({ onOpenCart, onOpenSearch }: { onOpenCart: () => void, onOpenSearch: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Earbuds', href: '/collections/earbuds' },
    { name: 'Headphones', href: '/collections/headphones' },
    { name: 'Neckbands', href: '/collections/neckbands' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Headphones className="text-[#FF3B30] group-hover:rotate-12 transition-transform" size={32} />
            <span className="text-2xl font-bebas tracking-widest text-white">SOUL<span className="text-[#FF3B30]">SOUND</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-dm font-medium tracking-wider transition-colors hover:text-[#FF3B30]",
                  isActive(link.href) ? "text-[#FF3B30]" : "text-gray-300"
                )}
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={onOpenSearch}
              data-search-trigger
              className="text-gray-300 hover:text-[#FF3B30] transition-colors"
            >
              <Search size={20} />
            </button>
            <Link to="/account" className="text-gray-300 hover:text-[#FF3B30] transition-colors">
              <User size={20} />
            </Link>
            <button 
              onClick={onOpenCart}
              className="text-gray-300 hover:text-[#FF3B30] transition-colors relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF3B30] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#1A1A1A] animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-3 py-4 text-lg font-bebas tracking-widest border-b border-[#1A1A1A]",
                  isActive(link.href) ? "text-[#FF3B30]" : "text-white"
                )}
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full text-left px-3 py-4 text-lg font-bebas tracking-widest text-white border-b border-[#1A1A1A] flex items-center gap-3"
            >
              <Search size={20} /> SEARCH
            </button>
            <Link
              to="/account"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-4 text-lg font-bebas tracking-widest text-white flex items-center gap-3"
            >
              <User size={20} /> MY ACCOUNT
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
