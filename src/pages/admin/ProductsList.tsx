import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Package, 
  AlertCircle, ChevronRight, Eye, Filter 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function ProductsList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [search, category, status, pagination.currentPage]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((pagination.currentPage - 1) * 20, pagination.currentPage * 20 - 1);

    if (data) {
      setProducts(data);
      setPagination(prev => ({ ...prev, totalPages: Math.ceil((count || 0) / 20) }));
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        fetchProducts();
      }
    }
  };

  const columns = [
    { 
      key: 'images', 
      label: 'IMAGE',
      render: (v: string[]) => (
        <div className="w-12 h-12 bg-[#0D0D0D] rounded-xl overflow-hidden border border-[#2A2A2A]">
          <img src={v[0]} alt="Product" className="w-full h-full object-cover" />
        </div>
      )
    },
    { 
      key: 'name', 
      label: 'NAME',
      render: (v: string, row: any) => (
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider">{v}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">SKU: {row.sku || 'N/A'}</p>
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
      key: 'sale_price', 
      label: 'PRICE',
      render: (v: number) => `₹${v.toLocaleString()}`
    },
    { 
      key: 'stock_quantity', 
      label: 'STOCK',
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-bebas tracking-widest",
            v < 10 ? "text-red-500" : "text-white"
          )}>
            {v}
          </span>
          {v < 10 && <AlertCircle size={14} className="text-red-500" />}
        </div>
      )
    },
    { 
      key: 'is_active', 
      label: 'STATUS',
      render: (v: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", v ? "bg-green-500" : "bg-gray-500")} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {v ? 'ACTIVE' : 'DRAFT'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/products/edit/${row.id}`} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
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
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">PRODUCTS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE YOUR CATALOG</p>
        </div>
        <Link 
          to="/admin/products/new"
          className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
        >
          <Plus size={20} /> ADD NEW PRODUCT
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME OR SKU..." 
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
              <option value="earbuds">EARBUDS</option>
              <option value="headphones">HEADPHONES</option>
              <option value="neckbands">NECKBANDS</option>
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
              <option value="active">ACTIVE</option>
              <option value="draft">DRAFT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <DataTable 
        columns={columns} 
        data={products} 
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
