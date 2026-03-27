import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, CheckCircle2, Clock, Truck, Home, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .eq('customer_phone', phone.trim())
        .single();

      if (fetchError || !data) {
        setError("Order not found. Please check your details and try again.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['unfulfilled', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-[#0D0D0D] text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/5 to-transparent" />
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bebas tracking-wider leading-tight">TRACK YOUR ORDER</h1>
          <p className="text-xl text-gray-400 font-dm tracking-widest uppercase">Real-time Delivery Updates</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Track Form */}
        <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] shadow-2xl">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500">ORDER NUMBER</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. SS-2026-12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PHONE NUMBER</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                />
              </div>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#FF3B30] text-white py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "TRACKING..." : "TRACK ORDER"} <Search size={20} />
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 font-dm"
            >
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
        </div>

        {/* Order Details */}
        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              {/* Status Timeline */}
              <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] space-y-12">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bebas tracking-wider text-white">ORDER {order.order_number}</h3>
                    <p className="text-gray-400 font-dm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={cn(
                    "px-6 py-2 rounded-full font-bebas tracking-widest text-lg",
                    order.payment_status === 'paid' ? "bg-[#4ADE80]/10 text-[#4ADE80]" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>

                <div className="relative flex justify-between">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-[#2A2A2A] z-0">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(getStatusStep(order.fulfillment_status) / 3) * 100}%` }}
                      className="h-full bg-[#FF3B30]"
                    />
                  </div>

                  {[
                    { icon: <Package size={24} />, label: "PLACED", status: 'unfulfilled' },
                    { icon: <Clock size={24} />, label: "PROCESSING", status: 'processing' },
                    { icon: <Truck size={24} />, label: "SHIPPED", status: 'shipped' },
                    { icon: <Home size={24} />, label: "DELIVERED", status: 'delivered' },
                  ].map((step, i) => {
                    const isCompleted = getStatusStep(order.fulfillment_status) >= i;
                    const isCurrent = getStatusStep(order.fulfillment_status) === i;

                    return (
                      <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                          isCompleted ? "bg-[#FF3B30] text-white" : "bg-[#1A1A1A] text-gray-600 border border-[#2A2A2A]",
                          isCurrent && "ring-4 ring-[#FF3B30]/30 scale-110"
                        )}>
                          {isCompleted && !isCurrent ? <CheckCircle2 size={24} /> : step.icon}
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-widest uppercase",
                          isCompleted ? "text-white" : "text-gray-600"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking Info */}
                {order.tracking_number && (
                  <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-500">TRACKING NUMBER</p>
                      <p className="text-2xl font-bebas tracking-wider text-white">{order.tracking_number}</p>
                      <p className="text-sm text-gray-400 font-dm">{order.courier_name}</p>
                    </div>
                    <a 
                      href={order.tracking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-black px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      TRACK ON COURIER SITE <ExternalLink size={18} />
                    </a>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] space-y-8">
                <h3 className="text-3xl font-bebas tracking-wider text-white">ORDER SUMMARY</h3>
                <div className="space-y-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-[#2A2A2A] last:border-0">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-dm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">{item.color} × {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-dm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 space-y-2">
                  <div className="flex justify-between text-gray-400 font-dm">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-dm">
                    <span>Shipping</span>
                    <span className="text-[#4ADE80]">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#2A2A2A]">
                    <span className="text-white font-bebas tracking-widest text-2xl">TOTAL</span>
                    <span className="text-[#FF3B30] font-bebas tracking-widest text-3xl">₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
