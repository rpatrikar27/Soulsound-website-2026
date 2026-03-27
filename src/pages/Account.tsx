import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, MapPin, LogOut, ChevronRight, Mail, Lock, Phone, UserCircle, ShieldCheck, ShoppingBag, CreditCard, Calendar, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone
            }
          }
        });
        if (error) throw error;
        setSuccess('Registration successful! Please check your email for verification.');
      } else if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
        if (error) throw error;
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`
      }
    });
    if (error) setError(error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">LOADING...</div>;

  if (!user) {
    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bebas tracking-wider">
              {authMode === 'login' ? 'WELCOME BACK' : authMode === 'register' ? 'JOIN THE CLUB' : 'RESET PASSWORD'}
            </h1>
            <p className="text-gray-400 font-dm">
              {authMode === 'login' ? 'Sign in to access your orders and profile.' : authMode === 'register' ? 'Create an account for a faster checkout experience.' : 'Enter your email to receive a reset link.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500">FULL NAME</label>
                <div className="relative">
                  <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PASSWORD</label>
                  {authMode === 'login' && (
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold tracking-widest uppercase text-[#FF3B30] hover:underline">FORGOT?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-14 pr-14 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PHONE NUMBER</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="10-digit mobile"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 font-dm text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-2xl flex items-center gap-3 text-green-500 font-dm text-sm">
                <ShieldCheck size={18} /> {success}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3B30] text-white py-5 rounded-full font-bebas tracking-widest text-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : authMode === 'login' ? 'SIGN IN' : authMode === 'register' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#2A2A2A]"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-[#0A0A0A] px-4 text-gray-500">OR CONTINUE WITH</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" /> GOOGLE
          </button>

          <div className="text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-gray-400 font-dm text-sm hover:text-white transition-colors"
            >
              {authMode === 'login' ? "Don't have an account? Join now" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bebas tracking-wider">MY ACCOUNT</h1>
            <p className="text-xl text-gray-400 font-dm">Welcome back, <span className="text-white font-bold">{user.user_metadata.full_name || user.email}</span></p>
          </div>
          <button 
            onClick={handleSignOut}
            className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-600 transition-all flex items-center gap-2"
          >
            SIGN OUT <LogOut size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-4">
            {[
              { id: 'orders', label: 'MY ORDERS', icon: Package },
              { id: 'addresses', label: 'MY ADDRESSES', icon: MapPin },
              { id: 'profile', label: 'PROFILE', icon: UserCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between p-6 rounded-3xl border transition-all group",
                  activeTab === tab.id 
                    ? "bg-[#FF3B30] border-[#FF3B30] text-white" 
                    : "bg-[#1A1A1A] border-[#2A2A2A] text-gray-400 hover:border-gray-600"
                )}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={24} />
                  <span className="font-bebas tracking-widest text-xl">{tab.label}</span>
                </div>
                <ChevronRight size={20} className={cn("transition-transform", activeTab === tab.id ? "translate-x-1" : "group-hover:translate-x-1")} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1A1A1A] p-8 md:p-12 rounded-[3rem] border border-[#2A2A2A] min-h-[500px]"
              >
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'addresses' && <AddressesTab />}
                {activeTab === 'profile' && <ProfileTab user={user} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-24 font-bebas text-2xl tracking-widest text-gray-500">LOADING ORDERS...</div>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 space-y-8">
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
          <ShoppingBag size={48} className="text-gray-700" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bebas tracking-wider text-white">NO ORDERS YET</h3>
          <p className="text-gray-400 font-dm max-w-xs">You haven't placed any orders with SoulSound yet.</p>
        </div>
        <Link to="/collections/earbuds" className="bg-[#FF3B30] text-white px-12 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center gap-2">
          START SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-bebas tracking-wider text-white">ORDER HISTORY</h3>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-black p-6 md:p-8 rounded-3xl border border-[#2A2A2A] space-y-6 group hover:border-[#FF3B30]/50 transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">ORDER NUMBER</p>
                <p className="text-xl font-bebas tracking-wider text-white">{order.order_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">DATE</p>
                <p className="text-white font-dm">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">STATUS</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                  order.status === 'delivered' ? "bg-green-500/10 text-green-500" : "bg-[#FF3B30]/10 text-[#FF3B30]"
                )}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">TOTAL</p>
                <p className="text-white font-dm font-bold">₹{order.total_amount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="w-16 h-16 bg-[#1A1A1A] rounded-xl overflow-hidden flex-shrink-0 border border-[#2A2A2A]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#2A2A2A] flex justify-end">
              <Link to={`/orders/${order.order_number}`} className="text-[#FF3B30] font-bebas tracking-widest text-lg flex items-center gap-2 hover:gap-4 transition-all">
                VIEW DETAILS <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressesTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddresses() {
      const { data } = await supabase
        .from('customer_addresses')
        .select('*');
      setAddresses(data || []);
      setLoading(false);
    }
    fetchAddresses();
  }, []);

  if (loading) return <div className="text-center py-24 font-bebas text-2xl tracking-widest text-gray-500">LOADING ADDRESSES...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bebas tracking-wider text-white">MY ADDRESSES</h3>
        <button className="bg-white text-black px-6 py-2 rounded-full font-bebas tracking-widest text-lg hover:bg-gray-200 transition-all">
          ADD NEW
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-black p-8 rounded-3xl border border-[#2A2A2A] space-y-4 relative group">
            {addr.is_default && (
              <span className="absolute top-6 right-6 bg-[#FF3B30]/10 text-[#FF3B30] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">DEFAULT</span>
            )}
            <div className="space-y-2 text-gray-400 font-dm text-sm leading-relaxed">
              <p className="text-white font-bold text-lg">{addr.full_name}</p>
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>Phone: {addr.phone}</p>
            </div>
            <div className="pt-4 flex gap-4">
              <button className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors">EDIT</button>
              <button className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-red-500 transition-colors">DELETE</button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-[#2A2A2A] rounded-3xl">
            <p className="text-gray-500 font-dm">No addresses saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.user_metadata.full_name || '',
    phone: user.user_metadata.phone || '',
    email: user.email || ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.fullName,
        phone: formData.phone
      }
    });
    setLoading(false);
    if (!error) alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-bebas tracking-wider text-white">PROFILE SETTINGS</h3>
      
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-500">FULL NAME</label>
          <input 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL ADDRESS</label>
          <input 
            disabled
            value={formData.email}
            className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-gray-500 cursor-not-allowed" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest uppercase text-gray-500">PHONE NUMBER</label>
          <input 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-black border border-[#2A2A2A] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#FF3B30] transition-colors" 
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#FF3B30] text-white px-12 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>

      <div className="pt-12 border-t border-[#2A2A2A] space-y-6">
        <h4 className="text-xl font-bebas tracking-wider text-white">ACCOUNT SECURITY</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black p-6 rounded-3xl border border-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-gray-500" />
              <div>
                <p className="text-sm font-bold tracking-widest uppercase text-white">PASSWORD</p>
                <p className="text-xs text-gray-500 font-dm">Last changed 2 months ago</p>
              </div>
            </div>
            <button className="text-[#FF3B30] font-bebas tracking-widest text-lg hover:underline">CHANGE</button>
          </div>
          <div className="bg-black p-6 rounded-3xl border border-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-gray-500" />
              <div>
                <p className="text-sm font-bold tracking-widest uppercase text-white">TWO-FACTOR</p>
                <p className="text-xs text-gray-500 font-dm">Not enabled</p>
              </div>
            </div>
            <button className="text-[#FF3B30] font-bebas tracking-widest text-lg hover:underline">ENABLE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
