import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Loader2, Image as ImageIcon, 
  Move, Save, X, CheckCircle2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import { cn } from '../../lib/utils';

const POSITIONS = [
  { id: 'hero', label: 'Hero Banners' },
  { id: 'mid', label: 'Mid-Page' },
  { id: 'promo', label: 'Promo' },
];

export default function BannerManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePosition, setActivePosition] = useState('hero');
  const [banners, setBanners] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    is_active: true,
    position: 'hero',
    sort_order: 0
  });

  useEffect(() => {
    fetchBanners();
  }, [activePosition]);

  async function fetchBanners() {
    setLoading(true);
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('position', activePosition)
      .order('sort_order', { ascending: true });
    
    setBanners(data || []);
    setLoading(false);
  }

  const handleAddBanner = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('banners')
      .insert([{ ...newBanner, position: activePosition, sort_order: banners.length }]);

    if (!error) {
      setShowAddModal(false);
      setNewBanner({
        title: '',
        image_url: '',
        mobile_image_url: '',
        link_url: '',
        is_active: true,
        position: activePosition,
        sort_order: 0
      });
      fetchBanners();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this banner?')) {
      await supabase.from('banners').delete().eq('id', id);
      fetchBanners();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('banners').update({ is_active: !current }).eq('id', id);
    fetchBanners();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">BANNERS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">MANAGE STOREFRONT VISUALS</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-bebas tracking-widest text-lg hover:bg-red-700 transition-all flex items-center gap-3"
        >
          <Plus size={20} /> ADD NEW BANNER
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] overflow-x-auto no-scrollbar">
        {POSITIONS.map((pos) => (
          <button
            key={pos.id}
            onClick={() => setActivePosition(pos.id)}
            className={cn(
              "px-8 py-4 font-bebas tracking-widest text-xl whitespace-nowrap transition-all relative",
              activePosition === pos.id ? "text-[#FF3B30]" : "text-gray-500 hover:text-white"
            )}
          >
            {pos.label.toUpperCase()}
            {activePosition === pos.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF3B30]" />
            )}
          </button>
        ))}
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => <div key={i} className="aspect-[21/9] bg-[#1A1A1A] rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banners.map((banner, i) => (
            <div key={banner.id} className="bg-[#1A1A1A] rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden group">
              <div className="aspect-[21/9] relative">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => toggleActive(banner.id, banner.is_active)}
                    className={cn(
                      "p-4 rounded-2xl transition-all",
                      banner.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    )}
                  >
                    <CheckCircle2 size={24} />
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
              <div className="p-8 flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-xl font-bebas tracking-wider text-white">{banner.title.toUpperCase()}</h4>
                  <p className="text-[10px] text-gray-500 font-dm uppercase tracking-widest truncate max-w-[200px]">{banner.link_url}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 text-gray-400 rounded-xl cursor-move">
                    <Move size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full py-24 text-center text-gray-500 font-dm uppercase tracking-widest text-xs">
              NO BANNERS FOUND IN THIS POSITION.
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] w-full max-w-2xl rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[#2A2A2A] flex justify-between items-center">
              <h3 className="text-3xl font-bebas tracking-wider text-white uppercase">ADD NEW BANNER</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">BANNER TITLE</label>
                <input 
                  type="text" 
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">DESKTOP IMAGE</label>
                <ImageUploader 
                  value={newBanner.image_url ? [newBanner.image_url] : []}
                  onChange={(urls) => setNewBanner({ ...newBanner, image_url: urls[0] })}
                  bucket="banners"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">LINK URL</label>
                <input 
                  type="text" 
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                  placeholder="/collections/earbuds"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
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
                onClick={handleAddBanner}
                disabled={saving || !newBanner.image_url}
                className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : 'SAVE BANNER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
