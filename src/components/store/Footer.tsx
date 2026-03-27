import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Headphones, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-16 border-b border-[#1A1A1A]">
          <div>
            <h3 className="text-3xl font-bebas tracking-wider text-white mb-2">STAY IN THE LOOP</h3>
            <p className="text-gray-400 font-dm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          </div>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-6 py-3 text-white focus:outline-none focus:border-[#FF3B30] transition-colors"
              required
            />
            <button className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest hover:bg-red-700 transition-colors flex items-center gap-2">
              SUBSCRIBE <Send size={16} />
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Headphones className="text-[#FF3B30]" size={32} />
              <span className="text-2xl font-bebas tracking-widest text-white">SOUL<span className="text-[#FF3B30]">SOUND</span></span>
            </Link>
            <p className="text-gray-400 font-dm leading-relaxed">
              Experience Sound, Experience Life. Premium audio gear designed for the bold and the restless.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#FF3B30] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#FF3B30] transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#FF3B30] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bebas tracking-widest text-xl mb-6">SHOP</h4>
            <ul className="space-y-4">
              <li><Link to="/collections/earbuds" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Earbuds</Link></li>
              <li><Link to="/collections/headphones" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Headphones</Link></li>
              <li><Link to="/collections/neckbands" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Neckbands</Link></li>
              <li><Link to="/collections/bestsellers" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-bebas tracking-widest text-xl mb-6">HELP</h4>
            <ul className="space-y-4">
              <li><Link to="/support" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Support</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Track Order</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-[#FF3B30] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bebas tracking-widest text-xl mb-6">CONTACT</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Email: support@soulsound.in</li>
              <li>Phone: +91 82080 49909</li>
              <li>Hours: Mon - Sat | 10AM - 7PM</li>
              <li className="pt-4">
                <a 
                  href="https://wa.me/918208049909" 
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Icons */}
        <div className="flex flex-wrap justify-center gap-6 py-8 border-t border-[#1A1A1A]">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
        </div>

        {/* Bottom Bar */}
        <div className="text-center pt-8 border-t border-[#1A1A1A]">
          <p className="text-gray-500 text-sm font-dm">
            © {currentYear} SoulSound. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
