import { motion } from 'framer-motion'
import { Sparkles, Shield, Clock } from 'lucide-react'

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Smart Prescription Scanner
        </h1>
        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Upload Your Prescription. Discover Affordable Generic Alternatives.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-8 mt-12"
      >
        <Feature
          icon={<Sparkles className="text-primary" size={24} />}
          title="AI-Powered OCR"
          description="Accurate prescription scanning"
        />
        <Feature
          icon={<Shield className="text-primary" size={24} />}
          title="Verified Generics"
          description="Safe & approved alternatives"
        />
        <Feature
          icon={<Clock className="text-primary" size={24} />}
          title="Smart Reminders"
          description="Never miss a dose"
        />
      </motion.div>
    </motion.section>
  )
}

const Feature = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.05 }}
    className="glass-card p-6 w-64"
  >
    <div className="bg-secondary/50 dark:bg-accent/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2 dark:text-neutral-100">{title}</h3>
    <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
  </motion.div>
)

export default Hero
