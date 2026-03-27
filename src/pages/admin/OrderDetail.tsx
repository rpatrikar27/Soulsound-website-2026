import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Printer, Mail, MapPin, Package, CreditCard, 
  Truck, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, Save, Loader2, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'paid', label: 'Payment Confirmed', icon: CreditCard },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const COURIERS = ['Bluedart', 'Delhivery', 'FedEx', 'DTDC', 'Ekart', 'Other'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', id)
      .single();

    if (data) {
      setOrder(data);
      setCourier(data.shipping_courier || '');
      setTrackingNumber(data.tracking_number || '');
      setTrackingUrl(data.tracking_url || '');
      setInternalNotes(data.internal_notes || '');
    } else {
      navigate('/admin/orders');
    }
    setLoading(false);
  }

  const handleUpdateShipping = async () => {
    setUpdating(true);
    const { error } = await supabase
      .from('orders')
      .update({
        shipping_courier: courier,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        status: 'shipped',
        shipped_at: new Date().toISOString()
      })
      .eq('order_number', id);

    if (!error) {
      await fetchOrder();
    }
    setUpdating(false);
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    await supabase
      .from('orders')
      .update({ internal_notes: internalNotes })
      .eq('order_number', id);
    setUpdating(false);
  };

  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice - ${order.order_number}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 60px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
            .invoice-title { font-size: 32px; font-weight: 300; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px; }
            .label { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 8px; }
            .value { font-size: 14px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; padding: 12px; border-bottom: 2px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .total-row { display: flex; justify-content: flex-end; gap: 40px; font-size: 18px; font-weight: 700; }
            .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SOULSOUND</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          <div class="grid">
            <div>
              <div class="label">BILL TO</div>
              <div class="value">
                ${order.customer_name}<br/>
                ${order.customer_email}<br/>
                ${order.customer_phone}
              </div>
            </div>
            <div>
              <div class="label">ORDER DETAILS</div>
              <div class="value">
                Order #: ${order.order_number}<br/>
                Date: ${new Date(order.created_at).toLocaleDateString()}<br/>
                Payment: ${order.payment_status.toUpperCase()}
              </div>
            </div>
            <div>
              <div class="label">SHIPPING ADDRESS</div>
              <div class="value">
                ${order.shipping_address.address}<br/>
                ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.name} (${item.color})</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-row">
            <div>TOTAL AMOUNT</div>
            <div>₹${order.total_amount.toLocaleString()}</div>
          </div>
          <div class="footer">
            Thank you for your purchase! For any queries, contact support@soulsound.in
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) return <div className="min-h-screen bg-[#111111] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" /></div>;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white">ORDER #{order.order_number}</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">PLACED ON {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <button 
          onClick={printInvoice}
          className="bg-white text-black px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-gray-200 transition-all flex items-center gap-3"
        >
          <Printer size={20} /> PRINT INVOICE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">CUSTOMER INFO</h3>
              <button className="text-xs font-bold tracking-widest uppercase text-[#FF3B30] hover:underline flex items-center gap-2">
                <Mail size={14} /> EMAIL CUSTOMER
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">NAME</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">{order.customer_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">EMAIL</p>
                <p className="text-sm font-bold text-white tracking-wider">{order.customer_email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">PHONE</p>
                <p className="text-sm font-bold text-white tracking-wider">{order.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">SHIPPING ADDRESS</h3>
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/5 rounded-2xl text-[#FF3B30]">
                <MapPin size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-wider leading-relaxed">
                  {order.shipping_address.address}
                </p>
                <p className="text-xs text-gray-500 font-dm uppercase tracking-widest">
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">ORDER ITEMS</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">PRODUCT</th>
                    <th className="py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">QTY</th>
                    <th className="py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">PRICE</th>
                    <th className="py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {order.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#0D0D0D] rounded-xl overflow-hidden border border-[#2A2A2A]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white uppercase tracking-wider">{item.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">COLOR: {item.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-sm font-bebas tracking-widest text-white">x{item.quantity}</td>
                      <td className="py-6 text-sm font-bebas tracking-widest text-white">₹{item.price.toLocaleString()}</td>
                      <td className="py-6 text-sm font-bebas tracking-widest text-white text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-6 border-t border-[#2A2A2A]">
              <div className="w-full max-w-xs space-y-4">
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
                  <span>SUBTOTAL</span>
                  <span className="text-white">₹{order.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
                  <span>SHIPPING</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="h-px bg-[#2A2A2A]" />
                <div className="flex justify-between text-xl font-bebas tracking-widest text-white">
                  <span>TOTAL</span>
                  <span className="text-[#FF3B30]">₹{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Payment Card */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">PAYMENT</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">STATUS</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                  order.payment_status === 'paid' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                )}>
                  {order.payment_status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">RAZORPAY ORDER ID</p>
                <p className="text-xs font-mono text-gray-300 truncate">{order.razorpay_order_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">RAZORPAY PAYMENT ID</p>
                <p className="text-xs font-mono text-gray-300 truncate">{order.razorpay_payment_id || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Fulfillment Card */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">FULFILLMENT</h3>
            
            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-[#2A2A2A]">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.id} className="flex items-center gap-6 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all",
                      isCompleted ? "bg-[#FF3B30] text-white" : "bg-[#2A2A2A] text-gray-500"
                    )}>
                      <step.icon size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <p className={cn(
                        "text-xs font-bold tracking-widest uppercase",
                        isCompleted ? "text-white" : "text-gray-500"
                      )}>
                        {step.label}
                      </p>
                      {isCompleted && (
                        <p className="text-[10px] text-gray-500 font-dm">
                          {i === 0 ? new Date(order.created_at).toLocaleString() : 'Completed'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-[#2A2A2A]" />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">COURIER</label>
                <select 
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-2 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                >
                  <option value="">SELECT COURIER</option>
                  {COURIERS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">TRACKING NUMBER</label>
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="ENTER TRACKING ID"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-2 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">TRACKING URL</label>
                <input 
                  type="text" 
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl px-4 py-2 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <button 
                onClick={handleUpdateShipping}
                disabled={updating || !courier || !trackingNumber}
                className="w-full bg-[#FF3B30] text-white py-4 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={20} /> : 'UPDATE SHIPPING'}
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">INTERNAL NOTES</h3>
              <button 
                onClick={handleSaveNotes}
                disabled={updating}
                className="text-xs font-bold tracking-widest uppercase text-[#FF3B30] hover:underline flex items-center gap-2"
              >
                <Save size={14} /> SAVE
              </button>
            </div>
            <textarea 
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="ADD INTERNAL NOTES HERE..."
              className="w-full h-32 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 text-xs font-dm text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
