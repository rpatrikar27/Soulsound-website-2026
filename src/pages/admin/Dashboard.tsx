import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, ShoppingBag, Users, 
  Package, AlertCircle, ChevronRight, Eye 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import { cn } from '../../lib/utils';

const COLORS = ['#FF3B30', '#007AFF', '#FFCC00', '#4CD964', '#5856D6', '#FF9500'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    pendingOrders: 0,
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 15.4
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      
      // Fetch stats
      const { data: orders } = await supabase.from('orders').select('total_amount, status, created_at');
      const { count: customerCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      const { data: lowStock } = await supabase.from('products').select('name, stock_quantity').lt('stock_quantity', 10).limit(5);

      if (orders) {
        const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
        const pending = orders.filter(o => o.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          revenue: totalRevenue,
          orders: orders.length,
          customers: customerCount || 0,
          pendingOrders: pending
        }));

        // Process revenue data for chart (last 30 days)
        const last30Days = Array.from({ length: 30 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return d.toISOString().split('T')[0];
        });

        const chartData = last30Days.map(date => {
          const dayOrders = orders.filter(o => o.created_at.startsWith(date));
          return {
            date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0)
          };
        });
        setRevenueData(chartData);

        // Process order status data for pie chart
        const statusCounts = orders.reduce((acc: any, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {});
        setOrderStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name: name.toUpperCase(), value })));
      }

      // Fetch recent orders
      const { data: recent } = await supabase
        .from('orders')
        .select('order_number, customer_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentOrders(recent || []);

      setLowStockProducts(lowStock || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const orderColumns = [
    { key: 'order_number', label: 'ORDER #' },
    { key: 'customer_name', label: 'CUSTOMER' },
    { 
      key: 'total_amount', 
      label: 'AMOUNT',
      render: (v: number) => `₹${v.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'STATUS',
      render: (v: string) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
          v === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
          v === 'paid' ? "bg-green-500/10 text-green-500" :
          v === 'shipped' ? "bg-purple-500/10 text-purple-500" :
          v === 'delivered' ? "bg-green-500/10 text-green-500" :
          "bg-blue-500/10 text-blue-500"
        )}>
          {v}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'DATE',
      render: (v: string) => new Date(v).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_: any, row: any) => (
        <Link to={`/admin/orders/${row.order_number}`} className="p-2 text-gray-400 hover:text-white transition-colors">
          <Eye size={18} />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-12">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="TOTAL REVENUE" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          change={stats.revenueChange}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard 
          title="TOTAL ORDERS" 
          value={stats.orders} 
          change={stats.ordersChange}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard 
          title="TOTAL CUSTOMERS" 
          value={stats.customers} 
          change={stats.customersChange}
          icon={Users}
          color="yellow"
        />
        <StatsCard 
          title="PENDING ORDERS" 
          value={stats.pendingOrders} 
          icon={AlertCircle}
          color={stats.pendingOrders > 5 ? 'red' : 'yellow'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">REVENUE LAST 30 DAYS</h3>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30]" /> REVENUE (INR)
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#555" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '12px' }}
                  itemStyle={{ color: '#FF3B30', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF3B30" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6, stroke: '#FF3B30', strokeWidth: 2, fill: '#0D0D0D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#2A2A2A] space-y-8">
          <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">ORDER STATUS</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {orderStatusData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-500">{entry.name}</span>
                </div>
                <span className="text-sm font-bebas tracking-widest text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">RECENT ORDERS</h3>
            <Link to="/admin/orders" className="text-xs font-bold tracking-widest uppercase text-[#FF3B30] hover:underline flex items-center gap-1">
              VIEW ALL <ChevronRight size={14} />
            </Link>
          </div>
          <DataTable 
            columns={orderColumns} 
            data={recentOrders} 
            loading={loading} 
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bebas tracking-wider text-white uppercase">LOW STOCK ALERT</h3>
            <Link to="/admin/products" className="text-xs font-bold tracking-widest uppercase text-[#FF3B30] hover:underline flex items-center gap-1">
              VIEW ALL <ChevronRight size={14} />
            </Link>
          </div>
          <div className="bg-[#1A1A1A] rounded-[2.5rem] border border-[#2A2A2A] overflow-hidden">
            {lowStockProducts.length > 0 ? (
              <div className="divide-y divide-[#2A2A2A]">
                {lowStockProducts.map((p, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-[#252525] transition-colors group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white uppercase tracking-wider">{p.name}</p>
                      <p className="text-xs text-gray-500 font-dm uppercase tracking-widest">STOCK: {p.stock_quantity}</p>
                    </div>
                    <Link 
                      to={`/admin/products/edit/${p.id}`} 
                      className="p-3 bg-[#FF3B30]/10 text-[#FF3B30] rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Package size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 font-dm uppercase tracking-widest text-xs">
                ALL PRODUCTS HAVE HEALTHY STOCK LEVELS.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
