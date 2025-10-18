import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Upload, Clock, Heart, TrendingUp, Pill, BookOpen, Activity, ShoppingCart, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import AdherenceTracker from '../components/AdherenceTracker'
import Analytics from '../components/Analytics'
import DrugInteractionChecker from '../components/DrugInteractionChecker'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const [recentSearches, setRecentSearches] = useState([])
  const [favorites, setFavorites] = useState([])
  const [reminders, setReminders] = useState([])
  const [stats, setStats] = useState({
    totalSearches: 0,
    medicinesViewed: 0,
    favoriteCount: 0
  })
  const [showAdherence, setShowAdherence] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // overview, adherence, analytics, safety

  useEffect(() => {
    // Load data from localStorage
    const searches = JSON.parse(localStorage.getItem('medilens_recent_searches') || '[]')
    const favs = JSON.parse(localStorage.getItem('medilens_favorites') || '[]')
    const savedStats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    const savedReminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    
    setRecentSearches(searches.slice(0, 5)) // Last 5 searches
    setFavorites(favs.slice(0, 6)) // Last 6 favorites
    setStats(savedStats)
    setReminders(savedReminders)
    setShowAdherence(savedReminders.length > 0) // Show adherence tracker if reminders exist
  }, [])

  const handleQuickSearch = (query) => {
    navigate('/', { state: { searchQuery: query } })
  }

  const clearRecentSearches = () => {
    localStorage.removeItem('medilens_recent_searches')
    setRecentSearches([])
  }

  const handleQuickReorder = (medicine) => {
    // Navigate to home with search query
    navigate('/', { state: { searchQuery: medicine.brand_name || medicine.name, autoSearch: true } })
    toast.success(`🛒 Quick Reorder: Searching for ${medicine.brand_name || medicine.name}`)
  }

  const removeFavorite = (medicine, e) => {
    e.stopPropagation() // Prevent triggering the card click
    const existingFavorites = JSON.parse(localStorage.getItem('medilens_favorites') || '[]')
    const updatedFavorites = existingFavorites.filter(fav => fav.brand_name !== medicine.brand_name)
    localStorage.setItem('medilens_favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
    
    // Update stats
    const statsData = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    statsData.favoriteCount = updatedFavorites.length
    localStorage.setItem('medilens_stats', JSON.stringify(statsData))
    setStats(statsData)
    
    toast.info(`${medicine.brand_name} removed from favorites`)
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Welcome back! Here's your medicine management overview.
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 flex space-x-2 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-accent'
            }`}
          >
            Overview
          </button>
          {showAdherence && (
            <button
              onClick={() => setActiveTab('adherence')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'adherence'
                  ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-accent'
              }`}
            >
              Adherence
            </button>
          )}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-accent'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'safety'
                ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-accent'
            }`}
          >
            Safety
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="mr-2 text-primary" size={24} />
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={<Search size={28} />}
            title="Search Medicine"
            description="Find medicine info & alternatives"
            onClick={() => navigate('/')}
            gradient="from-blue-500 to-cyan-500"
          />
          <QuickActionCard
            icon={<Upload size={28} />}
            title="Upload Prescription"
            description="Extract medicines using OCR"
            onClick={() => navigate('/')}
            gradient="from-purple-500 to-pink-500"
          />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary" size={24} />
          Your Stats
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            icon={<Search size={24} />}
            value={stats.totalSearches}
            label="Total Searches"
            color="text-blue-500"
          />
          <StatCard
            icon={<Pill size={24} />}
            value={stats.medicinesViewed}
            label="Medicines Viewed"
            color="text-green-500"
          />
          <StatCard
            icon={<Heart size={24} />}
            value={stats.favoriteCount}
            label="Bookmarks"
            color="text-red-500"
          />
        </div>
      </motion.div>

      {/* Adherence Tracker (if reminders exist) */}
      {showAdherence && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-neutral-100">
            <Activity className="mr-2 text-primary dark:text-accent" size={24} />
            Medicine Adherence
          </h2>
          <AdherenceTracker />
        </motion.div>
      )}

      {/* Recent Searches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 text-primary" size={24} />
            Recent Searches
          </h2>
          {recentSearches.length > 0 && (
            <button
              onClick={clearRecentSearches}
              className="text-sm text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        {recentSearches.length > 0 ? (
          <div className="glass-card p-6">
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 dark:hover:bg-neutral-700/30 cursor-pointer transition-colors"
                  onClick={() => handleQuickSearch(search.query)}
                >
                  <div className="flex items-center space-x-3">
                    <Search size={16} className="text-neutral-400" />
                    <span className="font-medium">{search.query}</span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Search size={48} />}
            message="No recent searches yet"
            description="Start searching for medicines to see them here"
          />
        )}
      </motion.div>

      {/* Bookmarked Medicines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Heart className="mr-2 text-primary" size={24} />
          Bookmarked Medicines
        </h2>
        
        {favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((medicine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass-card p-4 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg flex-1 cursor-pointer hover:text-primary dark:hover:text-accent transition-colors"
                      onClick={() => handleQuickSearch(medicine.brand_name || medicine.name)}>
                    {medicine.brand_name || medicine.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-red-500 fill-current" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => removeFavorite(medicine, e)}
                      className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {medicine.generic_name || medicine.generic || medicine.active_ingredient || 'Generic name'}
                </p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {medicine.timestamp 
                      ? `Added ${new Date(medicine.timestamp).toLocaleDateString()}`
                      : 'Recently added'
                    }
                  </span>
                </div>
                
                {/* Quick Reorder Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickReorder(medicine)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <ShoppingCart size={18} />
                  Quick Reorder
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen size={48} />}
            message="No bookmarks yet"
            description="Bookmark medicines for quick access later"
          />
        )}
      </motion.div>
        </>
      )}

      {/* Adherence Tab */}
      {activeTab === 'adherence' && showAdherence && (
        <AdherenceTracker />
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <Analytics />
      )}

      {/* Safety Tab - Drug Interactions */}
      {activeTab === 'safety' && (
        <DrugInteractionChecker currentMedicines={reminders.map(r => r.medicine)} />
      )}
    </div>
  )
}

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, onClick, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-6 cursor-pointer hover:shadow-xl transition-all"
  >
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
  </motion.div>
)

// Stat Card Component
const StatCard = ({ icon, value, label, color }) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={color}>{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
  </div>
)

// Empty State Component
const EmptyState = ({ icon, message, description }) => (
  <div className="glass-card p-12 text-center">
    <div className="text-neutral-300 dark:text-neutral-600 mb-4 flex justify-center">
      {icon}
    </div>
    <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
      {message}
    </p>
    <p className="text-sm text-neutral-500 dark:text-neutral-500">
      {description}
    </p>
  </div>
)

export default Dashboard
