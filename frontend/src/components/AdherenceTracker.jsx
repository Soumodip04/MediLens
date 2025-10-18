import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Flame, Trophy, Calendar, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'

const AdherenceTracker = () => {
  const [reminders, setReminders] = useState([])
  const [stats, setStats] = useState({
    totalTaken: 0,
    totalMissed: 0,
    currentStreak: 0,
    bestStreak: 0,
    adherenceRate: 0
  })

  useEffect(() => {
    loadReminders()
    calculateStats()
  }, [])

  const loadReminders = () => {
    const storedReminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    const activeReminders = storedReminders.filter(r => r.active)
    setReminders(activeReminders)
  }

  const calculateStats = () => {
    const storedReminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    
    let totalTaken = 0
    let totalMissed = 0
    let currentStreak = 0
    let bestStreak = 0

    storedReminders.forEach(reminder => {
      if (reminder.adherence) {
        totalTaken += reminder.adherence.taken || 0
        totalMissed += reminder.adherence.missed || 0
        currentStreak = Math.max(currentStreak, reminder.adherence.streak || 0)
        bestStreak = Math.max(bestStreak, reminder.adherence.bestStreak || 0)
      }
    })

    const total = totalTaken + totalMissed
    // Fix NaN issue: default to 0 if no data, or calculate percentage
    const adherenceRate = total > 0 ? Math.round((totalTaken / total) * 100) : (storedReminders.length > 0 ? 0 : 100)

    setStats({
      totalTaken,
      totalMissed,
      currentStreak,
      bestStreak,
      adherenceRate: isNaN(adherenceRate) ? 0 : adherenceRate
    })
  }

  const markAsTaken = (reminderId) => {
    const storedReminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    const updatedReminders = storedReminders.map(reminder => {
      if (reminder.id === reminderId) {
        const newAdherence = {
          ...reminder.adherence,
          taken: (reminder.adherence?.taken || 0) + 1,
          streak: (reminder.adherence?.streak || 0) + 1,
          bestStreak: Math.max(
            (reminder.adherence?.bestStreak || 0),
            (reminder.adherence?.streak || 0) + 1
          ),
          lastTaken: new Date().toISOString()
        }
        return { ...reminder, adherence: newAdherence }
      }
      return reminder
    })
    
    localStorage.setItem('medilens_reminders', JSON.stringify(updatedReminders))
    loadReminders()
    calculateStats()
    toast.success('✅ Marked as taken! Keep up the good work!')
  }

  const markAsMissed = (reminderId) => {
    const storedReminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    const updatedReminders = storedReminders.map(reminder => {
      if (reminder.id === reminderId) {
        const newAdherence = {
          ...reminder.adherence,
          missed: (reminder.adherence?.missed || 0) + 1,
          streak: 0 // Reset streak on miss
        }
        return { ...reminder, adherence: newAdherence }
      }
      return reminder
    })
    
    localStorage.setItem('medilens_reminders', JSON.stringify(updatedReminders))
    loadReminders()
    calculateStats()
    toast.info('Marked as missed. Don\'t worry, keep going!')
  }

  if (reminders.length === 0) {
    return (
      <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-8 text-center">
        <Calendar className="mx-auto mb-4 text-neutral-400 dark:text-neutral-500" size={48} />
        <h3 className="text-xl font-semibold mb-2 dark:text-neutral-100">No Active Reminders</h3>
        <p className="text-neutral-600 dark:text-neutral-300">
          Set up reminders for your medicines to start tracking adherence
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle className="text-green-500" size={24} />}
          label="Taken"
          value={stats.totalTaken}
          color="green"
        />
        <StatCard
          icon={<XCircle className="text-red-500" size={24} />}
          label="Missed"
          value={stats.totalMissed}
          color="red"
        />
        <StatCard
          icon={<Flame className="text-orange-500" size={24} />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          color="orange"
        />
        <StatCard
          icon={<Trophy className="text-yellow-500" size={24} />}
          label="Best Streak"
          value={`${stats.bestStreak} days`}
          color="yellow"
        />
      </div>

      {/* Adherence Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-primary dark:text-accent" size={24} />
            <h3 className="text-lg font-semibold dark:text-neutral-100">Adherence Rate</h3>
          </div>
          <span className="text-3xl font-bold text-primary dark:text-accent">
            {stats.adherenceRate}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.adherenceRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              stats.adherenceRate >= 80
                ? 'bg-green-500'
                : stats.adherenceRate >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
        </div>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {stats.adherenceRate >= 80
            ? '🎉 Excellent! You\'re doing great!'
            : stats.adherenceRate >= 60
            ? '👍 Good job! Try to improve a bit more.'
            : '💪 Keep trying! Consistency is key.'}
        </p>
      </motion.div>

      {/* Active Reminders */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold dark:text-neutral-100">Today's Medicines</h3>
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-lg dark:text-neutral-100">
                  {reminder.medicine}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {reminder.dosage} tablet{reminder.dosage > 1 ? 's' : ''} • {reminder.frequency}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {reminder.times?.map((time, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/10 dark:bg-accent/20 text-primary dark:text-accent text-xs rounded-full font-medium"
                    >
                      {time}
                    </span>
                  ))}
                </div>
                {reminder.notes && (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 italic">
                    "{reminder.notes}"
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {reminder.adherence?.streak > 0 && (
                  <div className="text-center px-2">
                    <Flame className="text-orange-500 mx-auto" size={20} />
                    <span className="text-xs font-bold text-orange-500">
                      {reminder.adherence.streak}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => markAsTaken(reminder.id)}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
              >
                <CheckCircle size={18} />
                <span>Taken</span>
              </button>
              <button
                onClick={() => markAsMissed(reminder.id)}
                className="flex-1 py-2 px-4 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 dark:text-neutral-200 font-medium flex items-center justify-center space-x-2"
              >
                <XCircle size={18} />
                <span>Missed</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-4"
  >
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
    </div>
    <p className="text-2xl font-bold dark:text-neutral-100">{value}</p>
  </motion.div>
)

export default AdherenceTracker
