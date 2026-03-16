import { useState, useEffect } from 'react'
import { Card, Button, Input } from '../components/ui'
import { Search, Filter, Plus, Edit2, Trash2, X } from 'lucide-react'
import api from '../utils/api'

export default function Leads({ openModal = false }) {
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(openModal)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    status: 'new',
    notes: ''
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await api.get('/api/leads')
      setLeads(Array.isArray(res.data) ? res.data : [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching leads:', err)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to eliminate this lead from the database?')) return
    try {
      await api.delete(`/api/leads/${id}`)
      setLeads(leads.filter(lead => lead._id !== id))
    } catch (err) {
      console.error('Error deleting lead:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/leads', formData)
      setLeads([res.data, ...leads])
      setIsModalOpen(false)
      setFormData({ name: '', email: '', source: '', status: 'new', notes: '' })
    } catch (err) {
      console.error('Error creating lead:', err)
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-primary/20 text-primary border-primary/50 shadow-glow-purple'
      case 'contacted': return 'bg-secondary/20 text-secondary border-secondary/50 shadow-glow-cyan'
      case 'converted': return 'bg-green-500/20 text-green-500 border-green-500/50'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search leads database..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-primary/50 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            Filter
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            New Lead
          </Button>
        </div>
      </div>

      <Card className="glass-glow overflow-hidden p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-gray-500">Decrypting lead database...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 font-semibold text-sm">Lead Identity</th>
                  <th className="px-6 py-4 font-semibold text-sm">Source</th>
                  <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm">Entry Date</th>
                  <th className="px-6 py-4 font-semibold text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-primary border border-white/10">
                          {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-gray-400">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <Button variant="outline" className="p-2 h-auto" onClick={() => window.location.href = `/leads/${lead._id}`}>
                          <Edit2 size={16} />
                        </Button>
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">No intelligence matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg glass-glow p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Inbound Lead Generation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Identity Name</label>
                  <Input 
                    required 
                    placeholder="Enter full name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Direct Email</label>
                  <Input 
                    required 
                    type="email" 
                    placeholder="name@company.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Source Stream</label>
                  <Input 
                    required 
                    placeholder="Website, LinkedIn, etc." 
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Initial Status</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary/50 transition-all font-sans appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="new">New Inbound</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Operational Notes</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary/50 transition-all font-sans min-h-[100px]"
                  placeholder="Additional intelligence details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <Button type="submit" className="w-full mt-4 h-12 text-lg">Initialize Lead</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
