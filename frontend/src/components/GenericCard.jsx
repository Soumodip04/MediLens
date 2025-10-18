import { motion } from 'framer-motion'
import { TrendingDown, Bell, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import PharmacyLinks from './PharmacyLinks'

const GenericCard = ({ generic, originalPrice, onSetReminder }) => {
  const savings = originalPrice - generic.price
  const savingsPercent = ((savings / originalPrice) * 100).toFixed(0)
  const [showPharmacies, setShowPharmacies] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-card border-2 border-secondary dark:border-neutral-600 hover:border-primary dark:hover:border-accent transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h5 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">
            {generic.brand_name}
          </h5>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{generic.manufacturer}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {typeof generic.is_otc !== 'undefined' && (
              <span className={`px-2 py-0.5 text-[10px] rounded border ${generic.is_otc ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
                {generic.is_otc ? 'OTC' : 'Rx'}
              </span>
            )}
            {generic.schedule && (
              <span className={`px-2 py-0.5 text-[10px] rounded border ${generic.schedule === 'H1' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' : generic.schedule === 'H' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'}`}>
                {generic.schedule}
              </span>
            )}
          </div>
        </div>
        {savings > 0 && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-green-200 dark:border-green-800">
            <TrendingDown size={14} />
            <span>-{savingsPercent}%</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-primary dark:text-accent">
            ₹{generic.price?.toFixed(2)}
          </p>
          {savings > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Save ₹{savings.toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSetReminder}
            className="bg-primary hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 text-white p-2 rounded-lg"
            title="Set Reminder"
          >
            <Bell size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPharmacies(!showPharmacies)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
            title="Buy Online"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>

      {/* Pharmacy Links Dropdown */}
      {showPharmacies && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <PharmacyLinks 
            medicineName={generic.brand_name}
            isGeneric={true}
            onClose={() => setShowPharmacies(false)}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default GenericCard
