import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, 
  Tag, Calendar, Percent, DollarSign,
  X, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

export default function CouponManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    usage_limit: 0,
    used_count: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    setCoupons(data || []);
    setLoading(false);
  }

  const handleAddCoupon = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('coupons')
      .insert([newCoupon]);

    if (!error) {
      setShowAddModal(false);
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: 0,
        max_discount_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        usage_limit: 0,
        used_count: 0,
        is_active: true
      });
      fetchCoupons();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this coupon?')) {
      await supabase.from('coupons').delete().eq('id', id);
      fetchCoupons();
    }
  };

  const columns = [
    { 
      key: 'code', 
      label: 'COUPON CODE',
      render: (v: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF3B30]/10 rounded-full flex items-center justify-center text-[#FF3B30]">
            <Tag size={18} />
          </div>
          <span className="font-bold text-white uppercase tracking-widest">{v}</span>
        </div>
      )
    },
    { 
      key: 'discount_value', 
      label: 'DISCOUNT',
      render: (v: number, row: any) => (
        <div className="flex items-center gap-2">
          {row.discount_type === 'percentage' ? <Percent size={14} className="text-gray-500" /> : <DollarSign size={14} className="text-gray-500" />}
          <span className="text-xs font-bold text-white">
            {v}{row.discount_type === 'percentage' ? '%' : ' OFF'}
          </span>
        </div>
      )
    },
    { 
      key: 'usage_limit', 
      label: 'USAGE',
      render: (v: number, row: any) => (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span>{row.used_count} USED</span>
            <span>{v === 0 ? '∞' : v} LIMIT</span>
          </div>
          <div className="w-24 h-1 bg-[#0D0D0D] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FF3B30]" 
              style={{ width: v === 0 ? '0%' : `${(row.used_count / v) * 100}%` }} 
            />
          </div>
        </div>
      )
    },
    { 
      key: 'end_date', 
      label: 'EXPIRY',
      render: (v: string) => v ? new Date(v).toLocaleDateString() : 'NEVER'
    },
    { 
      key: 'is_active', 
      label: 'STATUS',
      render: (v: boolean) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", v ? "bg-green-500" : "bg-gray-500")} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            {v ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
            <Edit size={18} />
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
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">COUPONS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE DISCOUNTS & OFFERS</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
        >
          <Plus size={20} /> CREATE COUPON
        </button>
      </div>

      {/* Coupons Table */}
      <DataTable 
        columns={columns} 
        data={coupons} 
        loading={loading} 
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] w-full max-w-2xl rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[#2A2A2A] flex justify-between items-center">
              <h3 className="text-3xl font-bebas tracking-wider text-white uppercase">CREATE NEW COUPON</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">COUPON CODE*</label>
                  <input 
                    type="text" 
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SOUL20"
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">DISCOUNT TYPE</label>
                  <select 
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
                  >
                    <option value="percentage">PERCENTAGE (%)</option>
                    <option value="fixed">FIXED AMOUNT (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">DISCOUNT VALUE*</label>
                  <input 
                    type="number" 
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">MIN ORDER AMOUNT</label>
                  <input 
                    type="number" 
                    value={newCoupon.min_order_amount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">START DATE</label>
                  <input 
                    type="date" 
                    value={newCoupon.start_date}
                    onChange={(e) => setNewCoupon({ ...newCoupon, start_date: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">END DATE (OPTIONAL)</label>
                  <input 
                    type="date" 
                    value={newCoupon.end_date}
                    onChange={(e) => setNewCoupon({ ...newCoupon, end_date: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">USAGE LIMIT (0 = UNLIMITED)</label>
                  <input 
                    type="number" 
                    value={newCoupon.usage_limit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 bg-[#0D0D0D] flex justify-end gap-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-8 py-3 rounded-full font-bebas tracking-widest text-lg text-gray-400 hover:text-white transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleAddCoupon}
                disabled={saving || !newCoupon.code || newCoupon.discount_value <= 0}
                className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : 'CREATE COUPON'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
