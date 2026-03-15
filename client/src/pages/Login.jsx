import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Button, Input } from '../components/ui'
import { LogIn } from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-neon-gradient bg-clip-text text-transparent mb-2">
            Mini CRM
          </h1>
          <p className="text-gray-400">Welcome back, Commander.</p>
        </div>

        <Card className="glass-glow">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
            <Input 
              label="Email Address"
              type="email"
              placeholder="admin@minicrm.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full h-12 flex items-center justify-center gap-2">
              <LogIn size={20} />
              Login to Terminal
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-sm text-gray-500 text-center">
              Don't have access? <span className="text-primary hover:underline cursor-pointer">Request Entry</span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
