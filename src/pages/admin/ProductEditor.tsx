import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, X, Plus, Trash2, Loader2, 
  Info, DollarSign, Image as ImageIcon, 
  Settings, Search, Flag, ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { cn } from '../../lib/utils';

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'specs', label: 'Specifications', icon: Settings },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'flags', label: 'Flags', icon: Flag },
];

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    sku: '',
    category: 'earbuds',
    tags: [],
    short_description: '',
    long_description: '',
    mrp: 0,
    sale_price: 0,
    stock_quantity: 0,
    low_stock_threshold: 10,
    is_active: true,
    images: [],
    colors: [],
    battery_life: 0,
    bluetooth_version: '',
    driver_size: '',
    water_resistance: '',
    charging_type: 'USB-C',
    playtime_per_charge: 0,
    total_playtime: 0,
    weight_grams: 0,
    in_box_items: [],
    has_anc: false,
    has_touch_controls: true,
    has_voice_assistant: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_featured: false,
    is_bestseller: false,
    is_new: true,
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setFormData(data);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('products')
      .upsert({
        ...formData,
        id: id === 'new' ? undefined : id,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      navigate('/admin/products');
    } else {
      console.error(error);
      alert('Error saving product: ' + error.message);
    }
    setSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      if (field === 'name' && !id) {
        newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        newData.meta_title = value;
      }
      return newData;
    });
  };

  if (loading) return <div className="min-h-screen bg-[#111111] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">
            {id === 'new' ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT'}
          </h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">
            {id === 'new' ? 'CREATE A NEW CATALOG ITEM' : `EDITING: ${formData.name}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 rounded-full font-bebas tracking-widest text-lg text-gray-400 hover:text-white transition-all"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> SAVE PRODUCT</>}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-8 py-4 font-bebas tracking-widest text-xl whitespace-nowrap transition-all relative flex items-center gap-3",
              activeTab === tab.id ? "text-[#FF3B30]" : "text-gray-500 hover:text-white"
            )}
          >
            <tab.icon size={20} />
            {tab.label.toUpperCase()}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF3B30]" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-[#2A2A2A]">
        {activeTab === 'basic' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">PRODUCT NAME*</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SLUG*</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SKU</label>
                <input 
                  type="text" 
                  value={formData.sku}
                  onChange={(e) => updateField('sku', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">CATEGORY*</label>
                <select 
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
                >
                  <option value="earbuds">EARBUDS</option>
                  <option value="headphones">HEADPHONES</option>
                  <option value="neckbands">NECKBANDS</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SHORT DESCRIPTION</label>
              <textarea 
                value={formData.short_description}
                onChange={(e) => updateField('short_description', e.target.value)}
                maxLength={160}
                className="w-full h-24 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
              />
              <p className="text-[10px] text-right text-gray-500 px-4">{formData.short_description.length}/160</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">LONG DESCRIPTION</label>
              <RichTextEditor 
                value={formData.long_description}
                onChange={(v) => updateField('long_description', v)}
              />
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">MRP* (₹)</label>
                <input 
                  type="number" 
                  value={formData.mrp}
                  onChange={(e) => updateField('mrp', parseFloat(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SALE PRICE* (₹)</label>
                <input 
                  type="number" 
                  value={formData.sale_price}
                  onChange={(e) => updateField('sale_price', parseFloat(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
                {formData.mrp > 0 && (
                  <p className="text-[10px] font-bold text-green-500 px-4">
                    DISCOUNT: {Math.round(((formData.mrp - formData.sale_price) / formData.mrp) * 100)}% OFF
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">STOCK QUANTITY*</label>
                <input 
                  type="number" 
                  value={formData.stock_quantity}
                  onChange={(e) => updateField('stock_quantity', parseInt(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">LOW STOCK THRESHOLD</label>
                <input 
                  type="number" 
                  value={formData.low_stock_threshold}
                  onChange={(e) => updateField('low_stock_threshold', parseInt(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <button 
                onClick={() => updateField('is_active', !formData.is_active)}
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
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">PRODUCT IS ACTIVE</span>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">PRODUCT IMAGES (MAX 10)</label>
              <ImageUploader 
                value={formData.images}
                onChange={(urls) => updateField('images', urls)}
                multiple
                maxFiles={10}
              />
              <p className="text-[10px] text-gray-500 px-4 uppercase tracking-widest pt-4">
                DRAG IMAGES TO REORDER. FIRST IMAGE IS PRIMARY.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">COLORS</label>
                <div className="flex flex-wrap gap-2 px-4">
                  {formData.colors.map((c: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-4 py-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.toLowerCase() }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{c}</span>
                      <button onClick={() => updateField('colors', formData.colors.filter((_: any, idx: number) => idx !== i))} className="text-gray-500 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const c = window.prompt('Enter color name');
                      if (c) updateField('colors', [...formData.colors, c]);
                    }}
                    className="flex items-center gap-2 bg-white/5 border border-dashed border-[#2A2A2A] rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-[#FF3B30] transition-all"
                  >
                    <Plus size={12} /> ADD COLOR
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">BLUETOOTH VERSION</label>
                <input 
                  type="text" 
                  value={formData.bluetooth_version}
                  onChange={(e) => updateField('bluetooth_version', e.target.value)}
                  placeholder="e.g. 5.3"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">DRIVER SIZE</label>
                <input 
                  type="text" 
                  value={formData.driver_size}
                  onChange={(e) => updateField('driver_size', e.target.value)}
                  placeholder="e.g. 13mm"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">TOTAL PLAYTIME (HOURS)</label>
                <input 
                  type="number" 
                  value={formData.total_playtime}
                  onChange={(e) => updateField('total_playtime', parseInt(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">META TITLE</label>
              <input 
                type="text" 
                value={formData.meta_title}
                onChange={(e) => updateField('meta_title', e.target.value)}
                maxLength={60}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
              />
              <p className="text-[10px] text-right text-gray-500 px-4">{formData.meta_title.length}/60</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">META DESCRIPTION</label>
              <textarea 
                value={formData.meta_description}
                onChange={(e) => updateField('meta_description', e.target.value)}
                maxLength={160}
                className="w-full h-32 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
              />
              <p className="text-[10px] text-right text-gray-500 px-4">{formData.meta_description.length}/160</p>
            </div>
          </div>
        )}

        {activeTab === 'flags' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'is_featured', label: 'FEATURED PRODUCT' },
              { id: 'is_bestseller', label: 'BESTSELLER' },
              { id: 'is_new', label: 'NEW ARRIVAL' },
            ].map((flag) => (
              <div key={flag.id} className="bg-[#0D0D0D] p-8 rounded-3xl border border-[#2A2A2A] flex flex-col items-center gap-4 text-center">
                <button 
                  onClick={() => updateField(flag.id, !formData[flag.id])}
                  className={cn(
                    "w-16 h-8 rounded-full transition-all relative",
                    formData[flag.id] ? "bg-[#FF3B30]" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                    formData[flag.id] ? "left-9" : "left-1"
                  )} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{flag.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-[#0D0D0D]/80 backdrop-blur-xl border-t border-[#2A2A2A] p-6 flex justify-end z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 rounded-full font-bebas tracking-widest text-lg text-gray-400 hover:text-white transition-all"
          >
            DISCARD
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> SAVE PRODUCT</>}
          </button>
        </div>
      </div>
    </div>
  );
}
