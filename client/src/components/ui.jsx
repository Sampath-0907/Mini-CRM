import { motion } from 'framer-motion'

export const Card = ({ children, className = "" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass p-6 rounded-2xl ${className}`}
  >
    {children}
  </motion.div>
)

export const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-hover shadow-glow-purple",
    secondary: "bg-secondary hover:bg-secondary-hover shadow-glow-cyan",
    outline: "border border-white/10 hover:bg-white/5"
  }
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all text-white ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

export const Input = ({ label, type = "text", value, onChange, placeholder, className = "" }) => (
  <div className="flex flex-col gap-2 text-left">
    {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50 transition-colors ${className}`}
    />
  </div>
)
