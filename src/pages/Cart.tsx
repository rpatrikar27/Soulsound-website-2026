import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RotateCcw, Tag } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, discount, totalMrp } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid coupon code');
        return;
      }

      const now = new Date();
      if (data.expires_at && new Date(data.expires_at) < now) {
        setCouponError('Coupon has expired');
        return;
      }

      if (subtotal < data.min_order_amount) {
        setCouponError(`Minimum order of ₹${data.min_order_amount} required`);
        return;
      }

      setAppliedCoupon(data);
    } catch (err) {
      setCouponError('Something went wrong');
    }
  };

  const couponDiscount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? (subtotal * appliedCoupon.discount_value) / 100 
        : appliedCoupon.discount_value)
    : 0;

  const finalTotal = subtotal - couponDiscount;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-600" />
        </div>
        <h1 className="text-4xl font-bebas tracking-wider text-white mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-400 font-dm mb-8 max-w-md">
          Looks like you haven't added any SoulSound gear to your cart yet. 
          Experience the sound today.
        </p>
        <Link 
          to="/collections/earbuds" 
          className="bg-[#FF3B30] text-white px-12 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-2"
        >
          CONTINUE SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl md:text-7xl font-bebas tracking-wider mb-12">YOUR CART ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#1A1A1A] text-xs font-bold tracking-widest text-gray-500 uppercase">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            {items.map((item) => (
              <div key={`${item.product_id}-${item.color}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#1A1A1A] items-center group">
                <div className="md:col-span-6 flex gap-6">
                  <div className="w-24 h-24 bg-[#1A1A1A] rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <Link to={`/products/${item.slug}`} className="text-xl font-bebas tracking-wider hover:text-[#FF3B30] transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{item.color}</p>
                    <button 
                      onClick={() => removeItem(item.product_id, item.color)}
                      className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-xs font-bold tracking-widest uppercase pt-2 transition-colors"
                    >
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-center">
                  <span className="md:hidden text-gray-500 text-xs uppercase tracking-widest block mb-1">Price</span>
                  <p className="text-white font-dm">₹{item.price.toLocaleString()}</p>
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <span className="md:hidden text-gray-500 text-xs uppercase tracking-widest block mb-1 mr-4">Qty</span>
                  <div className="flex items-center border border-[#2A2A2A] rounded-full px-4 py-2">
                    <button 
                      onClick={() => updateQty(item.product_id, item.quantity - 1, item.color)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-white font-dm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.product_id, item.quantity + 1, item.color)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-right">
                  <span className="md:hidden text-gray-500 text-xs uppercase tracking-widest block mb-1">Total</span>
                  <p className="text-white font-dm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}

            <Link to="/collections/earbuds" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-dm text-sm">
              <ArrowRight size={16} className="rotate-180" /> CONTINUE SHOPPING
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#1A1A1A] p-8 rounded-[3rem] border border-[#2A2A2A] sticky top-32 space-y-8">
              <h3 className="text-3xl font-bebas tracking-wider text-white">ORDER SUMMARY</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 font-dm">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-[#4ADE80] font-dm">
                    <span>You Save</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-dm">Shipping</span>
                  <span className="bg-[#4ADE80]/10 text-[#4ADE80] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">FREE</span>
                </div>

                {/* Coupon */}
                <div className="pt-4 border-t border-[#2A2A2A]">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-black border border-[#2A2A2A] rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-[#FF3B30] transition-colors uppercase"
                    />
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bebas tracking-widest hover:bg-gray-200 transition-all">
                      APPLY
                    </button>
                  </form>
                  {couponError && <p className="text-red-500 text-xs mt-2 ml-4 font-dm">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-4 p-3 bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#4ADE80]">
                        <Tag size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">{appliedCoupon.code} APPLIED</span>
                      </div>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[#4ADE80] hover:text-white">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#4ADE80] font-dm">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-[#2A2A2A] flex justify-between items-center">
                  <span className="text-white font-bebas tracking-widest text-2xl">TOTAL</span>
                  <span className="text-[#FF3B30] font-bebas tracking-widest text-4xl">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                state={{ coupon: appliedCoupon }}
                className="block w-full bg-[#FF3B30] text-white text-center py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all shadow-lg shadow-[#FF3B30]/20"
              >
                PROCEED TO CHECKOUT →
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck size={20} className="text-gray-500" />
                  <span className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">SECURE CHECKOUT</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Truck size={20} className="text-gray-500" />
                  <span className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">FREE SHIPPING</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <RotateCcw size={20} className="text-gray-500" />
                  <span className="text-[8px] font-bold tracking-widest text-gray-500 uppercase">EASY RETURNS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
