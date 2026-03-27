import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Package, FolderTree, 
  Image as ImageIcon, Users, Star, PenTool, 
  Ticket, Mail, Settings, LogOut, ChevronRight, Menu, X 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: FolderTree },
  { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Reviews', path: '/admin/reviews', icon: Star },
  { label: 'Blogs', path: '/admin/blogs', icon: PenTool },
  { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Check if user is admin
      const adminEmail = process.env.ADMIN_EMAIL;
      if (session.user.email !== adminEmail) {
        await supabase.auth.signOut();
        navigate('/admin/login?error=unauthorized');
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentPage = navItems.find(item => item.path === location.pathname) || { label: 'Admin' };

  return (
    <div className="min-h-screen bg-[#111111] flex text-white font-dm">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0D0D0D] border-r border-[#2A2A2A] transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b border-[#2A2A2A]">
            <Link to="/admin" className="flex flex-col gap-1">
              <span className="text-2xl font-bebas tracking-widest text-white">SOULSOUND</span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FF3B30]">ADMIN PANEL</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  location.pathname === item.path 
                    ? "bg-[#FF3B30] text-white" 
                    : "text-gray-500 hover:bg-[#1A1A1A] hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-transform group-hover:scale-110",
                  location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-[#FF3B30]"
                )} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#2A2A2A] bg-[#0A0A0A]">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30] flex items-center justify-center text-xs font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-white uppercase tracking-wider">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        "lg:ml-[260px]"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#111111]/80 backdrop-blur-xl border-b border-[#2A2A2A] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                <Link to="/admin" className="hover:text-white transition-colors">ADMIN</Link>
                <ChevronRight size={10} />
                <span className="text-white">{currentPage.label.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl font-bebas tracking-wider text-white">{currentPage.label}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Add any top bar actions here */}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
