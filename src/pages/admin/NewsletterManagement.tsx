import React, { useEffect, useState } from 'react';
import { 
  Mail, Search, Download, Trash2, 
  CheckCircle2, XCircle, Filter, Send 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function NewsletterManagement() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchSubscribers();
  }, [search, pagination.currentPage]);

  async function fetchSubscribers() {
    setLoading(true);
    let query = supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('email', `%${search}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      setSubscribers(data);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this subscriber?')) {
      await supabase.from('newsletter_subscribers').delete().eq('id', id);
      fetchSubscribers();
    }
  };

  const columns = [
    { 
      key: 'email', 
      label: 'EMAIL ADDRESS',
      render: (v: string) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FF3B30]/10 rounded-full flex items-center justify-center text-[#FF3B30]">
            <Mail size={18} />
          </div>
          <span className="font-bold text-white uppercase tracking-widest">{v}</span>
        </div>
      )
    },
    { 
      key: 'is_active', 
      label: 'STATUS',
      render: (v: boolean) => (
        <div className="flex items-center gap-2">
          {v ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {v ? 'SUBSCRIBED' : 'UNSUBSCRIBED'}
          </span>
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'JOINED DATE',
      render: (v: string) => new Date(v).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleDelete(row.id)} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const exportSubscribers = () => {
    const headers = ['Email', 'Status', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(s => [
        `"${s.email}"`,
        s.is_active ? 'Subscribed' : 'Unsubscribed',
        new Date(s.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">NEWSLETTER</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE YOUR SUBSCRIBERS</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={exportSubscribers}
            className="bg-[#1A1A1A] text-white border border-[#2A2A2A] px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-[#252525] transition-all flex items-center gap-3"
          >
            <Download size={20} /> EXPORT CSV
          </button>
          <button 
            className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
          >
            <Send size={20} /> SEND CAMPAIGN
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'TOTAL SUBSCRIBERS', value: subscribers.length, color: 'text-white' },
          { label: 'ACTIVE THIS MONTH', value: Math.floor(subscribers.length * 0.4), color: 'text-green-500' },
          { label: 'UNSUBSCRIBE RATE', value: '2.4%', color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">{stat.label}</p>
            <p className={cn("text-4xl font-bebas tracking-wider", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A]">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH BY EMAIL ADDRESS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <DataTable 
        columns={columns} 
        data={subscribers} 
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
