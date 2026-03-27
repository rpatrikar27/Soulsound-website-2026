import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, Download, Eye, Calendar, 
  CheckCircle2, Truck, XCircle, AlertCircle, Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function OrdersList() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchOrders();
  }, [search, paymentStatus, fulfillmentStatus, dateFrom, dateTo, pagination.currentPage]);

  async function fetchOrders() {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    if (paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus);
    }

    if (fulfillmentStatus !== 'all') {
      query = query.eq('status', fulfillmentStatus);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      setOrders(data);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const exportCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Phone', 'Amount', 'Payment', 'Fulfillment', 'Date'];
    const rows = orders.map(o => [
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.customer_phone,
      o.total_amount,
      o.payment_status,
      o.status,
      new Date(o.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { key: 'order_number', label: 'ORDER #' },
    { 
      key: 'customer_name', 
      label: 'CUSTOMER',
      render: (v: string, row: any) => (
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider">{v}</p>
          <p className="text-[10px] text-gray-500 truncate">{row.customer_email}</p>
        </div>
      )
    },
    { key: 'customer_phone', label: 'PHONE' },
    { 
      key: 'total_amount', 
      label: 'AMOUNT',
      render: (v: number) => `₹${v.toLocaleString()}`
    },
    { 
      key: 'payment_status', 
      label: 'PAYMENT',
      render: (v: string) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
          v === 'paid' ? "bg-green-500/10 text-green-500" :
          v === 'failed' ? "bg-red-500/10 text-red-500" :
          "bg-yellow-500/10 text-yellow-500"
        )}>
          {v}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'FULFILLMENT',
      render: (v: string) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
          v === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
          v === 'processing' ? "bg-blue-500/10 text-blue-500" :
          v === 'shipped' ? "bg-purple-500/10 text-purple-500" :
          v === 'delivered' ? "bg-green-500/10 text-green-500" :
          v === 'cancelled' ? "bg-red-500/10 text-red-500" :
          "bg-gray-500/10 text-gray-500"
        )}>
          {v}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'DATE',
      render: (v: string) => new Date(v).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <Link to={`/admin/orders/${row.order_number}`} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all flex items-center justify-center">
          <Eye size={18} />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ORDER # OR CUSTOMER..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <select 
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
            >
              <option value="all">ALL PAYMENT STATUS</option>
              <option value="pending">PENDING</option>
              <option value="paid">PAID</option>
              <option value="failed">FAILED</option>
              <option value="refunded">REFUNDED</option>
            </select>
          </div>

          <div className="relative group">
            <Truck className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <select 
              value={fulfillmentStatus}
              onChange={(e) => setFulfillmentStatus(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
            >
              <option value="all">ALL FULFILLMENT STATUS</option>
              <option value="pending">PENDING</option>
              <option value="processing">PROCESSING</option>
              <option value="shipped">SHIPPED</option>
              <option value="delivered">DELIVERED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>

          <button 
            onClick={exportCSV}
            className="w-full bg-white text-black py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
          >
            <Download size={20} /> EXPORT CSV
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">FROM:</span>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={14} />
              <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-10 py-2 text-[10px] font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">TO:</span>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={14} />
              <input 
                type="date" 
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-10 py-2 text-[10px] font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable 
        columns={columns} 
        data={orders} 
        loading={loading} 
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          onPageChange: (page) => setPagination(prev => ({ ...prev, currentPage: page }))
        }}
      />
    </div>
  );
}
