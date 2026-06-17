'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Users, Home, Images, MessageSquare, Activity, Settings, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/panel/login');
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/panel/login');
  };

  const chartData = [
    { name: 'Jan', leads: 40, sales: 24 },
    { name: 'Feb', leads: 30, sales: 13 },
    { name: 'Mar', leads: 20, sales: 38 },
    { name: 'Apr', leads: 27, sales: 39 },
    { name: 'May', leads: 18, sales: 48 },
    { name: 'Jun', leads: 23, sales: 38 },
    { name: 'Jul', leads: 34, sales: 43 },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-navy font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">Admin <span className="text-gold">Dashboard</span></h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">System Overview & Management</p>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Properties', count: '124', icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' },
                { title: 'New Leads', count: '18', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
                { title: 'Gallery Photos', count: '85', icon: Images, color: 'text-purple-600', bg: 'bg-purple-100' },
                { title: 'Testimonials', count: '32', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bg} rounded-xl flex items-center justify-center mr-4 sm:mr-5 shrink-0`}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{stat.title}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-navy">{stat.count}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Nav Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Property Manager', desc: 'Add, edit & manage listings', href: '/panel/property-manager', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Lead Manager', desc: 'View the sales Kanban board', href: '/panel/lead-manager', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Gallery Manager', desc: 'Manage photos & albums', href: '/panel/gallery-manager', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                { label: 'Testimonials', desc: 'Add, approve & delete reviews', href: '/panel/admin/testimonials', color: 'bg-orange-50 border-orange-200 text-orange-700' },
              ].map(card => (
                <Link key={card.href} href={card.href}
                  className={`border rounded-2xl p-5 hover:shadow-md transition-all group ${card.color}`}>
                  <p className="font-black text-sm mb-1 group-hover:underline">{card.label}</p>
                  <p className="text-xs opacity-70">{card.desc}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-bold text-navy flex items-center">
                    <TrendingUp className="mr-2 text-gold" size={24} /> Performance Analytics
                  </h2>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm outline-none text-gray-600 bg-gray-50 w-full sm:w-auto">
                    <option>Last 7 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" aspect={2.5}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#C9A84C" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Sales Closed" />
                      <Line type="monotone" dataKey="leads" stroke="#0A1F44" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="New Leads" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-navy flex items-center mb-6">
                  <Activity className="mr-2 text-gold" size={24} /> Recent Activity
                </h2>
                <div className="space-y-6">
                  {[
                    { user: 'John (PM)', action: 'added a new property', target: 'Luxury Villa 3BHK', time: '2 hours ago', color: 'bg-blue-100 text-blue-600' },
                    { user: 'Sarah (LM)', action: 'closed a lead', target: 'Rahul Sharma', time: '4 hours ago', color: 'bg-green-100 text-green-600' },
                    { user: 'Mike (GM)', action: 'uploaded 5 photos to', target: 'Ambernath Heights', time: '1 day ago', color: 'bg-purple-100 text-purple-600' },
                    { user: 'System', action: 'completed weekly database backup', target: '', time: '2 days ago', color: 'bg-gray-100 text-gray-600' }
                  ].map((act, i) => (
                    <div key={i} className="flex relative">
                      {i !== 3 && <div className="absolute top-8 left-4 w-0.5 h-full bg-gray-100 -z-10"></div>}
                      <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center font-bold text-sm shrink-0 z-10 border-2 border-white`}>
                        {act.user.charAt(0)}
                      </div>
                      <div className="ml-4 pb-2">
                        <p className="text-sm text-gray-800">
                          <span className="font-bold text-navy">{act.user}</span> {act.action} <span className="font-semibold text-gray-900">{act.target}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-bold text-navy flex items-center">
                  <Users className="mr-2 text-gold" size={24} /> User Management
                </h2>
                <button className="bg-navy text-white px-4 py-2 sm:py-2 rounded-lg font-bold text-sm hover:bg-navy/90 transition-colors w-full sm:w-auto">
                  + Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                      <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Name</th>
                      <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Email</th>
                      <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Role</th>
                      <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Admin User', email: 'admin@khanbuilders.com', role: 'admin' },
                      { name: 'John Property', email: 'property@khanbuilders.com', role: 'property-manager' },
                      { name: 'Sarah Leads', email: 'lead@khanbuilders.com', role: 'lead-manager' },
                      { name: 'Mike Gallery', email: 'gallery@khanbuilders.com', role: 'gallery-manager' },
                    ].map((user, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-navy font-bold flex items-center">
                          <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs mr-3">{user.name.charAt(0)}</div>
                          {user.name}
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold/10 text-gold border border-gold/20">
                            {user.role.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 mr-4 text-sm font-bold transition-colors">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-bold transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
