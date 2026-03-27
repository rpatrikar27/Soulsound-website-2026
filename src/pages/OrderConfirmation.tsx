import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Truck, Home, Search, ShoppingBag, Share2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
      
      if (data) {
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">LOADING...</div>;
  if (!order) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">ORDER NOT FOUND</div>;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`I just bought ${order.items[0].name} from SoulSound! 🎧 Check it out at soulsound.in`)}`;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-12">
        {/* Success Header */}
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-24 h-24 bg-[#4ADE80] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#4ADE80]/20"
          >
            <CheckCircle2 size={48} className="text-black" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-bebas tracking-wider text-white">ORDER CONFIRMED! 🎉</h1>
            <p className="text-xl text-gray-400 font-dm">Order Number: <span className="text-white font-bold">{order.order_number}</span></p>
            <p className="text-sm text-gray-500 font-dm">A confirmation has been sent to {order.customer_email}</p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] text-left space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Items */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bebas tracking-wider text-white">ITEMS ORDERED</h3>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center">
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
              <div className="pt-6 border-t border-[#2A2A2A] flex justify-between items-center">
                <span className="text-gray-400 font-dm">Total Paid</span>
                <span className="text-[#FF3B30] font-bebas tracking-widest text-3xl">₹{order.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bebas tracking-wider text-white">SHIPPING ADDRESS</h3>
              <div className="space-y-2 text-gray-400 font-dm text-sm leading-relaxed">
                <p className="text-white font-bold">{order.customer_name}</p>
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                <p>Phone: {order.customer_phone}</p>
              </div>
              <div className="pt-6 border-t border-[#2A2A2A] space-y-2">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">ESTIMATED DELIVERY</p>
                <p className="text-white font-dm">3-5 Business Days</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-12 border-t border-[#2A2A2A] flex flex-col md:flex-row gap-6">
            <Link 
              to="/track-order" 
              className="flex-1 bg-white text-black text-center py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              TRACK YOUR ORDER <Search size={20} />
            </Link>
            <a 
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white text-center py-4 rounded-full font-bebas tracking-widest text-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              SHARE ON WHATSAPP <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <Link to="/collections/earbuds" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-dm text-sm">
          <ShoppingBag size={16} /> CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
