import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Button } from '../components/ui'
import { ArrowLeft, Mail, Globe, Calendar, MessageSquare, Clock, Save } from 'lucide-react'
import api from '../utils/api'

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/api/leads`)
        // Filter manually since single fetch route might not be standard in this simple implementation
        const found = res.data.find(l => l._id === id)
        if (found) {
          setLead(found)
          setEditNotes(found.notes || '')
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching lead details:', err)
        setLoading(false)
      }
    }
    fetchLead()
  }, [id])

  const handleUpdateNotes = async () => {
    try {
      const res = await api.put(`/api/leads/${id}`, { notes: editNotes })
      setLead(res.data)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating lead:', err)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/api/leads/${id}`, { status: newStatus })
      setLead(res.data)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  if (loading) return <div className="p-20 text-center text-gray-500 animate-pulse">Accessing lead intelligence...</div>
  if (!lead) return <div className="p-20 text-center text-red-500">Lead protocol not found. Access denied.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/leads" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 w-fit">
        <ArrowLeft size={20} />
        Back to Headquarters
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-glow text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-glow-purple">
              <span className="text-3xl font-bold text-primary">
                {lead.name?.split(' ').map(n => n[0]).join('') || '?'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{lead.name}</h2>
            <p className="text-gray-400 text-sm">{lead.email}</p>
            
            <div className="mt-6 space-y-3">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Status Protocol</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['new', 'contacted', 'converted'].map((status) => (
                  <button 
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${
                      lead.status === status 
                        ? 'bg-primary/20 text-primary border-primary/50 shadow-glow-purple' 
                        : 'bg-white/5 text-gray-600 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="glass-glow space-y-4">
            <h3 className="font-bold text-sm uppercase text-gray-500 tracking-wider">Intelligence Data</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Globe size={16} className="text-secondary" />
                <span className="text-gray-300">{lead.source}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-accent" />
                <span className="text-gray-300">Acquired {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-glow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Operational Notes
              </h3>
              {isEditing ? (
                <Button onClick={handleUpdateNotes} className="h-8 text-xs py-0 flex items-center gap-2">
                  <Save size={14} /> Save
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="h-8 text-xs py-0">Edit</Button>
              )}
            </div>
            
            {isEditing ? (
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 outline-none focus:border-primary/50 transition-all font-sans"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 italic">
                {lead.notes || "No operational notes recorded for this intelligence."}
              </div>
            )}
          </Card>

          <Card className="glass-glow">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Clock size={20} className="text-secondary" />
              Activity Stream
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-white/10 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-glow-purple"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">Lead acquired from {lead.source}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-white/10 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-secondary shadow-glow-cyan"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">Identity verified in central database</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">System Automata</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
