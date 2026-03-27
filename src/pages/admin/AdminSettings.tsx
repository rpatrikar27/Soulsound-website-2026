import React, { useEffect, useState } from 'react';
import { 
  Save, Loader2, Globe, Mail, 
  Phone, Share2, Shield, Settings,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>({
    site_name: 'SoulSound',
    site_description: 'Experience Sound, Experience Life',
    contact_email: 'support@soulsound.in',
    contact_phone: '+91 82080 49909',
    address: 'Mumbai, India',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    free_shipping_threshold: 0,
    tax_percentage: 18,
    is_maintenance_mode: false,
    enable_reviews: true,
    enable_newsletter: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ ...settings, id: settings.id || undefined });

    if (!error) {
      alert('Settings saved successfully!');
    }
    setSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="min-h-screen bg-[#111111] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-bebas tracking-wider text-white uppercase">SITE SETTINGS</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">CONFIGURE YOUR STOREFRONT</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> SAVE SETTINGS</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] overflow-x-auto no-scrollbar">
        {[
          { id: 'general', label: 'GENERAL', icon: Globe },
          { id: 'contact', label: 'CONTACT', icon: Mail },
          { id: 'social', label: 'SOCIAL', icon: Share2 },
          { id: 'store', label: 'STORE', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-8 py-4 font-bebas tracking-widest text-xl whitespace-nowrap transition-all relative flex items-center gap-3",
              activeTab === tab.id ? "text-[#FF3B30]" : "text-gray-500 hover:text-white"
            )}
          >
            <tab.icon size={20} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF3B30]" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-[#2A2A2A]">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SITE NAME</label>
                <input 
                  type="text" 
                  value={settings.site_name}
                  onChange={(e) => updateField('site_name', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SITE DESCRIPTION</label>
                <input 
                  type="text" 
                  value={settings.site_description}
                  onChange={(e) => updateField('site_description', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <button 
                onClick={() => updateField('is_maintenance_mode', !settings.is_maintenance_mode)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  settings.is_maintenance_mode ? "bg-red-500" : "bg-gray-600"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  settings.is_maintenance_mode ? "left-7" : "left-1"
                )} />
              </button>
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">MAINTENANCE MODE</span>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SUPPORT EMAIL</label>
                <input 
                  type="email" 
                  value={settings.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">SUPPORT PHONE</label>
                <input 
                  type="text" 
                  value={settings.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">OFFICE ADDRESS</label>
              <textarea 
                value={settings.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full h-24 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 'facebook_url', label: 'FACEBOOK URL' },
              { id: 'instagram_url', label: 'INSTAGRAM URL' },
              { id: 'twitter_url', label: 'TWITTER URL' },
              { id: 'youtube_url', label: 'YOUTUBE URL' },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">{field.label}</label>
                <input 
                  type="text" 
                  value={settings[field.id]}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">FREE SHIPPING THRESHOLD (₹)</label>
                <input 
                  type="number" 
                  value={settings.free_shipping_threshold}
                  onChange={(e) => updateField('free_shipping_threshold', parseFloat(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">TAX PERCENTAGE (%)</label>
                <input 
                  type="number" 
                  value={settings.tax_percentage}
                  onChange={(e) => updateField('tax_percentage', parseFloat(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 px-4">
                <button 
                  onClick={() => updateField('enable_reviews', !settings.enable_reviews)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.enable_reviews ? "bg-green-500" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.enable_reviews ? "left-7" : "left-1"
                  )} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">ENABLE PRODUCT REVIEWS</span>
              </div>
              <div className="flex items-center gap-4 px-4">
                <button 
                  onClick={() => updateField('enable_newsletter', !settings.enable_newsletter)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.enable_newsletter ? "bg-green-500" : "bg-gray-600"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.enable_newsletter ? "left-7" : "left-1"
                  )} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">ENABLE NEWSLETTER POPUP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
