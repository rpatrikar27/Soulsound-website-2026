import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Check if user is admin
      const adminEmail = process.env.ADMIN_EMAIL;
      if (data.user?.email !== adminEmail) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: You do not have admin access.');
      }

      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 font-dm">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl font-bebas tracking-widest text-white">SOULSOUND</span>
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-[#FF3B30]">ADMIN PANEL</span>
          </div>
          <h2 className="text-2xl font-bebas tracking-wider text-white">WELCOME BACK</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest">SIGN IN TO YOUR ACCOUNT</p>
        </div>

        <div className="bg-[#111111] p-10 rounded-[2.5rem] border border-[#2A2A2A] shadow-2xl space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {searchParams.get('error') === 'unauthorized' && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={20} />
              <p>Unauthorized: You do not have admin access.</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@soulsound.in"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 px-4">PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-full px-14 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3B30] text-white py-5 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold tracking-widest uppercase text-gray-600">
          © 2026 SOULSOUND INDIA. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
