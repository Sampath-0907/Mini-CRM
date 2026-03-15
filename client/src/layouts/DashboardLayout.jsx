import { motion } from 'framer-motion'
import { LayoutDashboard, Users, UserPlus, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Manage Leads', path: '/leads' },
    { icon: UserPlus, label: 'Add Lead', path: '/leads/new' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 80 }}
        className="glass border-r border-white/5 h-screen sticky top-0 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isOpen && <h2 className="text-xl font-bold bg-neon-gradient bg-clip-text text-transparent">MINI CRM</h2>}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/5 rounded-lg">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                location.pathname === item.path ? 'bg-primary/20 text-primary shadow-glow-purple' : 'hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={location.pathname === item.path ? 'drop-shadow-glow-purple' : 'group-hover:text-primary transition-colors'} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans">Strategic Overview</h1>
            <p className="text-gray-400 mt-1">Systems nominal. Overviewing leads and performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">Live Terminal</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
