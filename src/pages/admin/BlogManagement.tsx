import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, PenTool, 
  ChevronRight, Eye, Filter 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function BlogManagement() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [search, category, status, pagination.currentPage]);

  async function fetchBlogs() {
    setLoading(true);
    let query = supabase
      .from('blogs')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (status !== 'all') {
      query = query.eq('is_published', status === 'published');
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      setBlogs(data);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (!error) {
        fetchBlogs();
      }
    }
  };

  const columns = [
    { 
      key: 'thumbnail', 
      label: 'THUMBNAIL',
      render: (v: string) => (
        <div className="w-16 h-10 bg-[#0D0D0D] rounded-lg overflow-hidden border border-[#2A2A2A]">
          <img src={v} alt="Blog" className="w-full h-full object-cover" />
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'TITLE',
      render: (v: string, row: any) => (
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider truncate max-w-[300px]">{v}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">BY {row.author || 'ADMIN'}</p>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'CATEGORY',
      render: (v: string) => (
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{v}</span>
      )
    },
    { 
      key: 'is_published', 
      label: 'STATUS',
      render: (v: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", v ? "bg-green-500" : "bg-gray-500")} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {v ? 'PUBLISHED' : 'DRAFT'}
          </span>
        </div>
      )
    },
    { 
      key: 'published_at', 
      label: 'DATE',
      render: (v: string) => v ? new Date(v).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/blogs/edit/${row.id}`} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
            <Edit size={18} />
          </Link>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"
          >
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
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">BLOG POSTS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE YOUR CONTENT</p>
        </div>
        <Link 
          to="/admin/blogs/new"
          className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
        >
          <Plus size={20} /> NEW BLOG POST
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY TITLE..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="audio">AUDIO</option>
              <option value="lifestyle">LIFESTYLE</option>
              <option value="tech">TECH</option>
              <option value="news">NEWS</option>
            </select>
          </div>

          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-3 text-xs font-bold tracking-widest uppercase text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
            >
              <option value="all">ALL STATUS</option>
              <option value="published">PUBLISHED</option>
              <option value="draft">DRAFT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <DataTable 
        columns={columns} 
        data={blogs} 
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
