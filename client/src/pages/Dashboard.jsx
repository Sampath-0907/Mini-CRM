import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, Button } from '../components/ui'
import { Users, TrendingUp, UserCheck, Inbox } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/api/leads')
        setLeads(Array.isArray(res.data) ? res.data : [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        if (err.response?.status === 401) {
           // Auth error handled by ProtectedRoute/Navigate, 
           // but we should stop loading here.
        }
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const stats = [
    { 
      label: 'Total Leads', 
      value: leads.length, 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      label: 'New Today', 
      value: leads.filter(l => l.createdAt && new Date(l.createdAt).toDateString() === new Date().toDateString()).length, 
      icon: Inbox, 
      color: 'text-green-500' 
    },
    { 
      label: 'Converted', 
      value: leads.filter(l => l.status === 'converted').length, 
      icon: UserCheck, 
      color: 'text-accent' 
    },
    { 
      label: 'Contacted', 
      value: leads.filter(l => l.status === 'contacted').length, 
      icon: TrendingUp, 
      color: 'text-secondary' 
    },
  ]

  // Mock chart data based on real lead count for visual effect
  const chartData = [
    { name: 'Mon', leads: Math.floor(leads.length * 0.1) },
    { name: 'Tue', leads: Math.floor(leads.length * 0.2) },
    { name: 'Wed', leads: Math.floor(leads.length * 0.15) },
    { name: 'Thu', leads: Math.floor(leads.length * 0.3) },
    { name: 'Fri', leads: Math.floor(leads.length * 0.25) },
    { name: 'Sat', leads: Math.floor(leads.length * 0.4) },
    { name: 'Sun', leads: leads.length },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-glow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">
                  {loading ? '...' : stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                {stat.icon && <stat.icon size={24} />}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-green-500 font-medium">+100%</span>
              <span className="text-gray-500 text-xs">from static mock</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-glow p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Leads Acquisition</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Real-time Intelligence</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-glow flex flex-col">
          <h3 className="text-xl font-bold mb-6">Inbound Stream</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {leads.slice(0, 5).map((lead, idx) => (
              <div key={lead._id || idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">
                    {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">New lead from <span className="text-primary">{lead.source}</span></p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{lead.name} initiated contact.</p>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
            {leads.length === 0 && !loading && (
              <p className="text-center text-gray-500 italic mt-10 text-sm">No recent activity detected.</p>
            )}
          </div>
          <Button variant="outline" className="w-full mt-6 py-2 text-sm" onClick={() => window.location.href='/leads'}>
            Manage Database
          </Button>
        </Card>
      </div>
    </div>
  )
}
