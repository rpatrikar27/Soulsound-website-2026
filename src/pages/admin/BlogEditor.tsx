import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, X, Loader2, Info, 
  ImageIcon, Search, Eye, Globe, Plus 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImageUploader from '../../components/admin/ImageUploader';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { cn } from '../../lib/utils';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'audio',
    tags: [],
    thumbnail: '',
    author: 'SoulSound Admin',
    is_published: false,
    published_at: null,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchBlog();
    }
  }, [id]);

  async function fetchBlog() {
    setLoading(true);
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setFormData(data);
    }
    setLoading(false);
  }

  const handleSave = async (publish = false) => {
    setSaving(true);
    const now = new Date().toISOString();
    const payload = {
      ...formData,
      id: id === 'new' ? undefined : id,
      is_published: publish ? true : formData.is_published,
      published_at: publish ? now : formData.published_at,
      updated_at: now
    };

    const { error } = await supabase
      .from('blogs')
      .upsert(payload);

    if (!error) {
      navigate('/admin/blogs');
    }
    setSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      if (field === 'title' && !id) {
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
            {id === 'new' ? 'NEW BLOG POST' : 'EDIT BLOG POST'}
          </h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-500">
            {id === 'new' ? 'CREATE FRESH CONTENT' : `EDITING: ${formData.title}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="px-8 py-3 rounded-full font-bebas tracking-widest text-lg text-gray-400 hover:text-white transition-all"
          >
            CANCEL
          </button>
          <button 
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-[#1A1A1A] text-white border border-[#2A2A2A] px-8 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-[#252525] transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : 'SAVE DRAFT'}
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[#FF3B30] text-white px-12 py-3 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <><Globe size={24} /> PUBLISH</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-[#2A2A2A] space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">POST TITLE*</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="ENTER CATCHY TITLE..."
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-8 py-6 text-3xl font-bebas tracking-wider text-white focus:outline-none focus:border-[#FF3B30] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">CATEGORY*</label>
                <select 
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all appearance-none"
                >
                  <option value="audio">AUDIO</option>
                  <option value="lifestyle">LIFESTYLE</option>
                  <option value="tech">TECH</option>
                  <option value="news">NEWS</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">EXCERPT (MAX 200 CHARS)</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                maxLength={200}
                className="w-full h-24 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">CONTENT</label>
              <RichTextEditor 
                value={formData.content}
                onChange={(v) => updateField('content', v)}
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-[#2A2A2A] space-y-8">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">SEO & METADATA</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">META TITLE</label>
                <input 
                  type="text" 
                  value={formData.meta_title}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  maxLength={60}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">META DESCRIPTION</label>
                <textarea 
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  maxLength={160}
                  className="w-full h-24 bg-[#0D0D0D] border border-[#2A2A2A] rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Publish Card */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-xl font-bebas tracking-wider text-white uppercase">PUBLISH</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">STATUS</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                  formData.is_published ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                )}>
                  {formData.is_published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">AUTHOR</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{formData.author}</span>
              </div>
              {formData.published_at && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">DATE</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {new Date(formData.published_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Card */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-xl font-bebas tracking-wider text-white uppercase">THUMBNAIL IMAGE</h3>
            <ImageUploader 
              value={formData.thumbnail ? [formData.thumbnail] : []}
              onChange={(urls) => updateField('thumbnail', urls[0])}
              bucket="blogs"
            />
          </div>

          {/* Tags Card */}
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-6">
            <h3 className="text-xl font-bebas tracking-wider text-white uppercase">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-4 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                  <button onClick={() => updateField('tags', formData.tags.filter((_: any, idx: number) => idx !== i))} className="text-gray-500 hover:text-red-500">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  const t = window.prompt('Enter tag');
                  if (t) updateField('tags', [...formData.tags, t]);
                }}
                className="flex items-center gap-2 bg-white/5 border border-dashed border-[#2A2A2A] rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-[#FF3B30] transition-all"
              >
                <Plus size={12} /> ADD TAG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
