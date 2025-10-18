import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60]"
        >
          <div
            className={`px-6 py-3 rounded-full shadow-lg flex items-center space-x-3 ${
              isOnline
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi size={20} />
                <span className="font-medium">Back online!</span>
              </>
            ) : (
              <>
                <WifiOff size={20} />
                <span className="font-medium">You're offline</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineIndicator
