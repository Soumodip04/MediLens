import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'

const MobileSearchResults = ({ results, onClose, onSelectResult }) => {
  const [dragY, setDragY] = useState(0)

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {results && results.length > 0 && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDrag={(event, info) => setDragY(info.offset.y)}
          className="md:hidden fixed inset-x-0 bottom-0 top-20 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl z-50 overflow-hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Drag Handle */}
          <div className="sticky top-0 bg-white dark:bg-neutral-900 pt-2 pb-4 px-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Search Results</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto h-full pb-24">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectResult(result)}
                className="p-4 border-b border-neutral-200 dark:border-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-800 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-3">
                    <h4 className="font-semibold text-base mb-1">{result.branded_name}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {result.generic_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent font-medium">
                        {result.manufacturer}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        ₹{result.price}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-neutral-400 flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileSearchResults
