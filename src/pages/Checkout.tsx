import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, ArrowLeft, ChevronDown, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function Checkout() {
  const { items, subtotal, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const appliedCoupon = location.state?.coupon || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: false
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const couponDiscount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? (subtotal * appliedCoupon.discount_value) / 100 
        : appliedCoupon.discount_value)
    : 0;

  const total = subtotal - couponDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address1 || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill all required fields');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return false;
    }
    if (!pincodeRegex.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create Razorpay order via our API
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items: items,
          customer: { 
            name: formData.fullName, 
            email: formData.email, 
            phone: formData.phone 
          },
          shipping_address: { 
            line1: formData.address1, 
            line2: formData.address2, 
            city: formData.city, 
            state: formData.state, 
            pincode: formData.pincode 
          },
          coupon_code: appliedCoupon?.code
        })
      });

      if (!res.ok) throw new Error('Failed to create order');
      
      const { razorpay_order_id, order_id } = await res.json();

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'SoulSound',
        description: `Order for ${items.length} item(s)`,
        image: 'https://ais-dev-wfvjzp5qkv74ylcp3pgtsx-359353633627.asia-southeast1.run.app/logo-white.png',
        order_id: razorpay_order_id,
        handler: async (response: any) => {
          // 3. Verify payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id
            })
          });
          
          const { success, order_number } = await verifyRes.json();
          if (success) {
            clearCart();
            navigate(`/orders/${order_number}`);
          } else {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: { 
          name: formData.fullName, 
          email: formData.email, 
          contact: formData.phone 
        },
        notes: { order_id },
        theme: { color: '#FF3B30' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setError('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/cart" className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-5xl md:text-7xl font-bebas tracking-wider">CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] space-y-8">
              <h3 className="text-3xl font-bebas tracking-wider text-white">SHIPPING INFORMATION</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">FULL NAME*</label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL ADDRESS*</label>
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PHONE NUMBER*</label>
                  <input 
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PINCODE*</label>
                  <input 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">ADDRESS LINE 1*</label>
                  <input 
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="House No, Building, Street"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">ADDRESS LINE 2 (OPTIONAL)</label>
                  <input 
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Landmark, Area"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">CITY*</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">STATE*</label>
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors appearance-none"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 bottom-5 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="saveAddress"
                  checked={formData.saveAddress}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-[#FF3B30] rounded" 
                />
                <span className="text-gray-400 font-dm text-sm group-hover:text-white transition-colors">Save this address for future orders</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] space-y-8">
              <h3 className="text-3xl font-bebas tracking-wider text-white">ORDER SUMMARY</h3>
              
              <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.color}`} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-black rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-dm font-medium text-sm">{item.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.color} × {item.quantity}</p>
                    </div>
                    <p className="text-white font-dm text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#2A2A2A] space-y-3">
                <div className="flex justify-between text-gray-400 font-dm text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#4ADE80] font-dm text-sm">
                    <span>Savings</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-[#4ADE80] font-dm text-sm">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 font-dm text-sm">
                  <span>Shipping</span>
                  <span className="text-[#4ADE80]">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#2A2A2A]">
                  <span className="text-white font-bebas tracking-widest text-2xl">TOTAL</span>
                  <span className="text-[#FF3B30] font-bebas tracking-widest text-4xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 font-dm text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="space-y-4">
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#FF3B30] text-white py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : `PAY ₹${total.toLocaleString()} SECURELY`} <Lock size={20} />
                </button>
                <div className="text-center space-y-4">
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-[#4ADE80]" /> 100% SECURE PAYMENT VIA RAZORPAY
                  </p>
                  <div className="flex justify-center gap-4 opacity-50 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
