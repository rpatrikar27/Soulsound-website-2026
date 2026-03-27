import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  bucket?: string;
}

export default function ImageUploader({ 
  value = [], 
  onChange, 
  multiple = false, 
  maxFiles = 10,
  bucket = 'products'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!multiple && files.length > 1) {
      setError('Only one file allowed');
      return;
    }

    if (multiple && value.length + files.length > maxFiles) {
      setError(`Max ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    const newUrls: string[] = [...value];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      onChange(newUrls);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] group">
            <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
            {i === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] font-bold tracking-widest uppercase text-white py-1 text-center">
                PRIMARY
              </div>
            )}
          </div>
        ))}

        {(multiple || value.length === 0) && value.length < maxFiles && (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-2xl border-2 border-dashed border-[#2A2A2A] hover:border-[#FF3B30] hover:bg-[#1A1A1A] transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white group disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[10px] font-bold tracking-widest uppercase">UPLOAD</span>
              </>
            )}
          </button>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 font-dm">{error}</p>
      )}
    </div>
  );
}
