import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Pill, Calendar, Package } from 'lucide-react'

const DosageCalculator = ({ medicineName, dosageForm }) => {
  const [frequency, setFrequency] = useState(1) // times per day
  const [duration, setDuration] = useState(7) // days
  const [tabletsPerStrip, setTabletsPerStrip] = useState(10) // standard strip size

  // Calculate total tablets needed
  const totalTablets = frequency * duration
  
  // Calculate strips needed (round up)
  const stripsNeeded = Math.ceil(totalTablets / tabletsPerStrip)
  
  // Calculate total tablets to buy (accounting for full strips)
  const totalToBuy = stripsNeeded * tabletsPerStrip
  
  // Calculate extra tablets
  const extraTablets = totalToBuy - totalTablets

  // Common presets
  const presets = [
    { name: 'Once daily - 1 week', freq: 1, dur: 7 },
    { name: 'Twice daily - 1 week', freq: 2, dur: 7 },
    { name: 'Twice daily - 2 weeks', freq: 2, dur: 14 },
    { name: 'Thrice daily - 1 week', freq: 3, dur: 7 },
    { name: 'Thrice daily - 2 weeks', freq: 3, dur: 14 }
  ]

  const applyPreset = (freq, dur) => {
    setFrequency(freq)
    setDuration(dur)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-blue-600 dark:text-blue-400" size={20} />
        <h4 className="font-semibold text-blue-900 dark:text-blue-300">
          💊 Dosage Calculator & Strip Planner
        </h4>
      </div>

      <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
        Calculate how many strips you need to buy based on your prescription
      </p>

      {/* Quick Presets */}
      <div className="mb-4">
        <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset.freq, preset.dur)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs rounded-lg border border-blue-200 dark:border-blue-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
            <Pill className="inline w-3 h-3 mr-1" />
            Times per day
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={frequency}
            onChange={(e) => setFrequency(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
            <Calendar className="inline w-3 h-3 mr-1" />
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            max="90"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
            <Package className="inline w-3 h-3 mr-1" />
            Tablets/Strip
          </label>
          <select
            value={tabletsPerStrip}
            onChange={(e) => setTabletsPerStrip(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          >
            <option value="10">10 tablets</option>
            <option value="15">15 tablets</option>
            <option value="20">20 tablets</option>
            <option value="30">30 tablets</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Tablets Needed</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {totalTablets}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ({frequency}×{duration} days)
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Strips to Buy</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stripsNeeded}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ({stripsNeeded} × {tabletsPerStrip} = {totalToBuy} tablets)
            </p>
          </div>
        </div>

        {extraTablets > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              💡 <strong>Note:</strong> You'll have <strong>{extraTablets}</strong> extra tablet{extraTablets > 1 ? 's' : ''} after completing the course.
              {extraTablets >= tabletsPerStrip / 2 && (
                <span className="block mt-1">
                  Consider keeping them for emergencies or future use (check expiry date).
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Practical Tips */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
            📋 Practical Tips:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Buy exactly <strong>{stripsNeeded} strip{stripsNeeded > 1 ? 's' : ''}</strong> from the pharmacy</li>
            <li>• Set {frequency} reminder{frequency > 1 ? 's' : ''} daily in the app</li>
            <li>• Mark calendar for {duration}-day treatment course</li>
            {extraTablets > 0 && (
              <li>• Store extra tablets safely in original packaging</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default DosageCalculator
