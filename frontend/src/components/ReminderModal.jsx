import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Bell, Plus, Trash2, Pill } from 'lucide-react'
import { toast } from 'react-toastify'

const ReminderModal = ({ medicine, onClose }) => {
  const [times, setTimes] = useState(['09:00'])
  const [frequency, setFrequency] = useState('daily')
  const [dosage, setDosage] = useState('1')
  const [notes, setNotes] = useState('')

  const addTime = () => {
    if (times.length < 4) {
      setTimes([...times, '12:00'])
    } else {
      toast.warning('Maximum 4 reminders per day')
    }
  }

  const removeTime = (index) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index))
    } else {
      toast.warning('At least one reminder time is required')
    }
  }

  const updateTime = (index, value) => {
    const newTimes = [...times]
    newTimes[index] = value
    setTimes(newTimes)
  }

  const handleSetReminder = async () => {
    // Request notification permission
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        const permission = await Notification.requestPermission()
        
        if (permission === 'granted') {
          // Register service worker if not already registered
          let registration = await navigator.serviceWorker.getRegistration()
          
          if (!registration) {
            registration = await navigator.serviceWorker.register('/service-worker.js')
            await navigator.serviceWorker.ready
          }
          
          // Store reminder in localStorage with enhanced details
          const reminder = {
            id: Date.now().toString(),
            medicine,
            times: times.sort(), // Sort times chronologically
            frequency,
            dosage,
            notes,
            created: new Date().toISOString(),
            active: true,
            adherence: {
              taken: 0,
              missed: 0,
              streak: 0,
              lastTaken: null
            }
          }
          
          const reminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
          reminders.push(reminder)
          localStorage.setItem('medilens_reminders', JSON.stringify(reminders))
          
          // Send message to service worker to schedule notifications
          if (registration.active) {
            registration.active.postMessage({
              type: 'SET_REMINDER',
              reminder: { medicine, times, frequency, dosage }
            })
          }
          
          // Show immediate test notification
          new Notification('MediLens Reminder Set! 💊', {
            body: `${times.length} reminder${times.length > 1 ? 's' : ''} set for ${medicine} - ${dosage} tablet${dosage > 1 ? 's' : ''}`,
            icon: '/vite.svg',
            badge: '/vite.svg'
          })
          
          toast.success(`✅ ${times.length} reminder${times.length > 1 ? 's' : ''} set for ${medicine}`)
          onClose()
        } else {
          toast.error('Please allow notifications to set reminders')
        }
      } catch (error) {
        console.error('Error setting reminder:', error)
        toast.error('Failed to set reminder. Please try again.')
      }
    } else {
      toast.error('Notifications not supported in this browser')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card dark:bg-neutral-800 dark:border-neutral-700 max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 dark:bg-accent/20 p-2 rounded-lg">
                <Bell className="text-primary dark:text-accent" size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-neutral-100">Set Reminder</h3>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Medicine Name */}
          <div className="mb-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Medicine</p>
            <p className="text-lg font-semibold text-primary dark:text-accent">{medicine}</p>
          </div>

          {/* Dosage */}
          <div className="mb-4">
            <label className="flex text-sm font-medium mb-2 items-center space-x-2 dark:text-neutral-200">
              <Pill size={16} />
              <span>Dosage (tablets)</span>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none"
            />
          </div>

          {/* Reminder Times */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex text-sm font-medium items-center space-x-2 dark:text-neutral-200">
                <Clock size={16} />
                <span>Reminder Times ({times.length}/4)</span>
              </label>
              {times.length < 4 && (
                <button
                  onClick={addTime}
                  className="text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent/80 text-sm font-medium flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {times.map((time, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none"
                  />
                  {times.length > 1 && (
                    <button
                      onClick={() => removeTime(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition-all ${
                    frequency === freq
                      ? 'bg-primary dark:bg-accent text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g., Take with food, After breakfast..."
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 dark:text-neutral-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSetReminder}
              className="flex-1 btn-primary"
            >
              Set Reminder
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReminderModal
