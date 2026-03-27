import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/cart-context';

export default function CartDrawer({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { items, removeItem, updateQty, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-[#1A1A1A] z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
              <h2 className="text-2xl font-bebas tracking-wider text-white">YOUR CART</h2>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#FF3B30] transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={64} className="text-[#1A1A1A]" />
                  <p className="text-gray-400 font-dm">Your cart is empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest hover:bg-red-700 transition-colors"
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product_id}-${item.color}`} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-[#1A1A1A] rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="text-white font-dm font-medium">{item.name}</h3>
                        <button onClick={() => removeItem(item.product_id, item.color)} className="text-gray-500 hover:text-[#FF3B30]">
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.color}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#1A1A1A] rounded-full px-2 py-1">
                          <button onClick={() => updateQty(item.product_id, item.quantity - 1, item.color)} className="p-1 text-gray-400 hover:text-white">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product_id, item.quantity + 1, item.color)} className="p-1 text-gray-400 hover:text-white">
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-white font-dm">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[#1A1A1A] bg-[#0D0D0D] space-y-4">
                <div className="bg-[#FF3B30]/10 text-[#FF3B30] text-center py-2 rounded-lg text-sm font-medium">
                  FREE SHIPPING 🎉
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-dm">Subtotal</span>
                  <span className="text-2xl text-white font-bebas tracking-wider">₹{subtotal.toLocaleString()}</span>
                </div>
                <Link 
                  to="/cart" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-[#FF3B30] text-white text-center py-4 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-colors"
                >
                  VIEW CART →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
