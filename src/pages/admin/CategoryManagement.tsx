import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, 
  Folder, ChevronRight, X, Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import ImageUploader from '../../components/admin/ImageUploader';
import { cn } from '../../lib/utils';

export default function CategoryManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    setCategories(data || []);
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...formData,
      id: editingCategory?.id || undefined
    };

    const { error } = await supabase
      .from('categories')
      .upsert(payload);

    if (!error) {
      setShowAddModal(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true
      });
      fetchCategories();
    }
    setSaving(false);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category? This may affect products linked to it.')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  const columns = [
    { 
      key: 'image_url', 
      label: 'IMAGE',
      render: (v: string) => (
        <div className="w-12 h-12 bg-[#0D0D0D] rounded-xl overflow-hidden border border-[#2A2A2A]">
          {v ? <img src={v} alt="Category" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700"><Folder size={20} /></div>}
        </div>
      )
    },
    { 
      key: 'name', 
      label: 'CATEGORY NAME',
      render: (v: string) => (
        <span className="font-bold text-white uppercase tracking-widest">{v}</span>
      )
    },
    { 
      key: 'slug', 
      label: 'SLUG',
      render: (v: string) => (
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{v}</span>
      )
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
          <button onClick={() => handleEdit(row)} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-gray-400 hover:text-white hover:border-[#FF3B30] transition-all">
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
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">CATEGORIES</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">ORGANIZE YOUR PRODUCTS</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true });
            setShowAddModal(true);
          }}
          className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
        >
          <Plus size={20} /> ADD CATEGORY
        </button>
      </div>

      {/* Categories Table */}
      <DataTable 
        columns={columns} 
        data={categories} 
        loading={loading} 
      />

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] w-full max-w-2xl rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[#2A2A2A] flex justify-between items-center">
              <h3 className="text-3xl font-bebas tracking-wider text-white uppercase">
                {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">CATEGORY NAME*</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name: val,
                        slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                      });
                    }}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SLUG*</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">DESCRIPTION</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-24 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">CATEGORY IMAGE</label>
                <ImageUploader 
                  value={formData.image_url ? [formData.image_url] : []}
                  onChange={(urls) => setFormData({ ...formData, image_url: urls[0] })}
                  bucket="categories"
                />
              </div>
              <div className="flex items-center gap-4 px-4">
                <button 
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    formData.is_active ? "bg-green-500" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    formData.is_active ? "left-7" : "left-1"
                  )} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">CATEGORY IS ACTIVE</span>
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
                onClick={handleSave}
                disabled={saving || !formData.name}
                className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : 'SAVE CATEGORY'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
