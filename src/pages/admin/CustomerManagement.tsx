import React, { useEffect, useState } from 'react';
import { 
  Search, User, Mail, Phone, 
  ShoppingBag, Calendar, ChevronRight, 
  Download, Filter, MoreVertical, Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function CustomerManagement() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchCustomers();
  }, [search, pagination.currentPage]);

  async function fetchCustomers() {
    setLoading(true);
    // In a real app, we'd join with orders to get total spend and order count
    // For now, we'll fetch from profiles and mock some data or use a view if available
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      // Mocking some stats for demo purposes if not in DB
      const enhancedData = data.map(c => ({
        ...c,
        total_orders: Math.floor(Math.random() * 5),
        total_spend: Math.floor(Math.random() * 5000)
      }));
      setCustomers(enhancedData);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const columns = [
    { 
      key: 'full_name', 
      label: 'CUSTOMER',
      render: (v: string, row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FF3B30]/10 rounded-full flex items-center justify-center text-[#FF3B30]">
            <User size={20} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white uppercase tracking-wider">{v || 'UNNAMED USER'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'phone', 
      label: 'PHONE',
      render: (v: string) => (
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{v || 'N/A'}</span>
      )
    },
    { 
      key: 'total_orders', 
      label: 'ORDERS',
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-gray-500" />
          <span className="text-xs font-bold text-white">{v}</span>
        </div>
      )
    },
    { 
      key: 'total_spend', 
      label: 'TOTAL SPEND',
      render: (v: number) => (
        <span className="text-xs font-bold text-white">₹{v.toLocaleString()}</span>
      )
    },
    { 
      key: 'created_at', 
      label: 'JOINED',
      render: (v: string) => new Date(v).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
            <Eye size={18} />
          </button>
          <button className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
            <Mail size={18} />
          </button>
        </div>
      )
    }
  ];

  const exportCustomers = () => {
    const headers = ['Name', 'Email', 'Phone', 'Orders', 'Spend', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...customers.map(c => [
        `"${c.full_name || ''}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        c.total_orders,
        c.total_spend,
        new Date(c.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">CUSTOMERS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE YOUR USER BASE</p>
        </div>
        <button 
          onClick={exportCustomers}
          className="bg-[#1A1A1A] text-white border border-[#2A2A2A] px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-[#252525] transition-all flex items-center gap-3"
        >
          <Download size={20} /> EXPORT CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME OR EMAIL..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group flex-1">
              <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
              <select 
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
              >
                <option value="all">ALL CUSTOMERS</option>
                <option value="repeat">REPEAT CUSTOMERS</option>
                <option value="new">NEW THIS MONTH</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable 
        columns={columns} 
        data={customers} 
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
