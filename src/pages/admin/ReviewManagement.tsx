import React, { useEffect, useState } from 'react';
import { 
  Star, Search, Trash2, CheckCircle2, 
  XCircle, Filter, MessageSquare, User,
  Eye, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function ReviewManagement() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchReviews();
  }, [search, status, pagination.currentPage]);

  async function fetchReviews() {
    setLoading(true);
    let query = supabase
      .from('reviews')
      .select('*, products(name)', { count: 'exact' });

    if (search) {
      query = query.ilike('comment', `%${search}%`);
    }

    if (status !== 'all') {
      query = query.eq('is_approved', status === 'approved');
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      setReviews(data);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from('reviews').update({ is_approved: !current }).eq('id', id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review?')) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchReviews();
    }
  };

  const columns = [
    { 
      key: 'user_name', 
      label: 'CUSTOMER',
      render: (v: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF3B30]/10 rounded-full flex items-center justify-center text-[#FF3B30]">
            <User size={14} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">{v || 'ANONYMOUS'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{row.products?.name}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'RATING',
      render: (v: number) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              className={cn(i < v ? "text-[#D4A853] fill-[#D4A853]" : "text-gray-700")} 
            />
          ))}
        </div>
      )
    },
    { 
      key: 'comment', 
      label: 'COMMENT',
      render: (v: string) => (
        <p className="text-[10px] text-gray-400 font-dm uppercase tracking-widest truncate max-w-[250px]">{v}</p>
      )
    },
    { 
      key: 'is_approved', 
      label: 'STATUS',
      render: (v: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", v ? "bg-green-500" : "bg-yellow-500")} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {v ? 'APPROVED' : 'PENDING'}
          </span>
        </div>
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
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleApproval(row.id, row.is_approved)}
            className={cn(
              "p-3 border rounded-xl transition-all",
              row.is_approved 
                ? "bg-[#1A1A1A] border-[#2A2A2A] text-gray-500 hover:text-yellow-500 hover:border-yellow-500" 
                : "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white"
            )}
          >
            {row.is_approved ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">REVIEWS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MODERATE PRODUCT FEEDBACK</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH REVIEWS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
            >
              <option value="all">ALL REVIEWS</option>
              <option value="approved">APPROVED</option>
              <option value="pending">PENDING APPROVAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <DataTable 
        columns={columns} 
        data={reviews} 
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
