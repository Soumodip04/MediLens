import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <AlertCircle size={64} />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium shadow-lg"
          >
            <Home size={20} />
            <span>Go Home</span>
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <HelpfulLink onClick={() => navigate('/')} icon={<Search size={16} />} text="Search Medicines" />
            <HelpfulLink onClick={() => navigate('/about')} icon={<AlertCircle size={16} />} text="About Us" />
            <HelpfulLink onClick={() => navigate('/contact')} icon={<Search size={16} />} text="Contact Support" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

const HelpfulLink = ({ onClick, icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-card hover:shadow-md transition-all"
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </motion.button>
)

export default NotFound
