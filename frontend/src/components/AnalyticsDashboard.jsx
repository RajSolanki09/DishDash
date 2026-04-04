import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, DollarSign, Package, Star } from 'lucide-react';

const AnalyticsDashboard = ({ data }) => {
  const { totalRevenue, totalOrders, chartData, topItems } = data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="premium-card p-4 shadow-xl">
          <p className="text-caption text-text-muted mb-1">{label}</p>
          <p className="text-sm font-black text-brand">₹{payload[0].value}</p>
          <p className="text-caption text-text-secondary">{payload[1]?.value} Orders</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand/10 blur-3xl rounded-full group-hover:bg-brand/20 transition-all" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <DollarSign size={20} />
            </div>
            <span className="text-caption text-text-muted">Total Revenue</span>
          </div>
          <p className="text-4xl font-black text-text-primary tracking-tighter">₹{totalRevenue}</p>
          <div className="flex items-center gap-2 mt-2 text-emerald-500">
            <TrendingUp size={12} />
            <span className="text-caption">+12.5% this week</span>
          </div>
        </div>

        <div className="premium-card p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Package size={20} />
            </div>
            <span className="text-caption text-text-muted">Total Orders</span>
          </div>
          <p className="text-4xl font-black text-text-primary tracking-tighter">{totalOrders}</p>
          <p className="text-caption text-text-muted mt-2">Lifetime Performance</p>
        </div>

        <div className="premium-card p-8 rounded-[2rem] relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all" />
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                 <Star size={20} />
              </div>
              <span className="text-caption text-text-muted">Top Rated</span>
           </div>
           <p className="text-2xl font-black text-text-primary tracking-tight line-clamp-1">
              {topItems[0]?.name || "N/A"}
           </p>
           <p className="text-caption text-text-muted mt-2">Best Seller</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 premium-card p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-text-primary tracking-tight">Revenue Insights</h3>
              <p className="text-caption text-text-muted mt-1">Last 7 Days performance</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E23744" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E23744" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 900}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#E23744" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--color-border)" 
                  strokeWidth={1}
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 premium-card p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-black text-text-primary tracking-tight mb-8">Top Selling</h3>
          <div className="space-y-6">
            {topItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[13px] font-black text-text-primary truncate">{item.name}</p>
                   <p className="text-caption text-text-muted mt-0.5">
                     {item.sales} Orders
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-[12px] font-black text-brand">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;