import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Clock,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalSavings: 0,
    avgSavingsPerSearch: 0,
    mostSearchedCategory: 'Pain Relief',
    searchTrend: [],
    savingsTrend: [],
    adherenceData: [],
    categoryDistribution: {}
  })

  useEffect(() => {
    calculateAnalytics()
  }, [])

  const calculateAnalytics = () => {
    const searches = JSON.parse(localStorage.getItem('medilens_recent_searches') || '[]')
    const stats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    const reminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
    const searchHistory = JSON.parse(localStorage.getItem('medilens_search_history') || '[]')

    // Calculate REAL savings from search history
    let totalSavings = 0
    let searchesWithSavings = 0
    
    searchHistory.forEach(search => {
      if (search.results && Array.isArray(search.results)) {
        search.results.forEach(medicine => {
          if (medicine.generics && Array.isArray(medicine.generics)) {
            medicine.generics.forEach(generic => {
              const savings = (medicine.price || 0) - (generic.price || 0)
              if (savings > 0) {
                totalSavings += savings
                searchesWithSavings++
              }
            })
          }
        })
      }
    })

    // Generate REAL 7-day trend data from actual search timestamps
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toDateString()
      }
    })

    // Count REAL searches per day
    const searchTrend = last7Days.map(day => {
      return searches.filter(search => {
        const searchDate = new Date(search.timestamp)
        return searchDate.toDateString() === day.date
      }).length
    })

    // Calculate REAL daily savings from search history
    const savingsTrend = last7Days.map(day => {
      let daySavings = 0
      searchHistory.forEach(search => {
        if (search.timestamp) {
          const searchDate = new Date(search.timestamp)
          if (searchDate.toDateString() === day.date && search.results) {
            search.results.forEach(medicine => {
              if (medicine.generics && Array.isArray(medicine.generics)) {
                medicine.generics.forEach(generic => {
                  const savings = (medicine.price || 0) - (generic.price || 0)
                  if (savings > 0) daySavings += savings
                })
              }
            })
          }
        }
      })
      return Math.round(daySavings)
    })

    // Calculate REAL adherence data
    let totalTaken = 0
    let totalMissed = 0
    reminders.forEach(reminder => {
      if (reminder.adherence) {
        totalTaken += reminder.adherence.taken || 0
        totalMissed += reminder.adherence.missed || 0
      }
    })

    const adherenceData = [totalTaken, totalMissed]

    // Get REAL most searched medicine
    const medicineCount = {}
    searches.forEach(search => {
      const query = search.query.toLowerCase()
      medicineCount[query] = (medicineCount[query] || 0) + 1
    })
    const mostSearched = Object.keys(medicineCount).length > 0
      ? Object.entries(medicineCount).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A'

    setAnalytics({
      totalSavings: Math.round(totalSavings),
      avgSavingsPerSearch: stats.totalSearches > 0 ? Math.round(totalSavings / stats.totalSearches) : 0,
      mostSearchedCategory: mostSearched,
      searchTrend: { labels: last7Days.map(d => d.label), data: searchTrend },
      savingsTrend: { labels: last7Days.map(d => d.label), data: savingsTrend },
      adherenceData: { labels: ['Taken', 'Missed'], data: adherenceData },
      categoryDistribution: {}
    })
  }

  // Chart configurations
  const searchTrendChart = {
    labels: analytics.searchTrend.labels || [],
    datasets: [
      {
        label: 'Searches',
        data: analytics.searchTrend.data || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const savingsTrendChart = {
    labels: analytics.savingsTrend.labels || [],
    datasets: [
      {
        label: 'Potential Savings (₹)',
        data: analytics.savingsTrend.data || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }

  const adherenceChart = {
    labels: analytics.adherenceData.labels || [],
    datasets: [
      {
        data: analytics.adherenceData.data || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e5e5' : '#404040'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#a3a3a3' : '#737373'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#404040' : '#e5e5e5'
        }
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#a3a3a3' : '#737373'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#404040' : '#e5e5e5'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e5e5' : '#404040'
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-neutral-100">Analytics & Insights</h2>
        <p className="text-neutral-600 dark:text-neutral-300">
          Track your medicine search patterns, savings, and adherence trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign className="text-green-500" size={24} />}
          title="Total Potential Savings"
          value={`₹${analytics.totalSavings.toLocaleString()}`}
          trend="+12%"
          trendUp={true}
        />
        <MetricCard
          icon={<TrendingUp className="text-blue-500" size={24} />}
          title="Avg Savings per Search"
          value={`₹${analytics.avgSavingsPerSearch}`}
          trend="+8%"
          trendUp={true}
        />
        <MetricCard
          icon={<PieChart className="text-purple-500" size={24} />}
          title="Most Searched"
          value={analytics.mostSearchedCategory === 'N/A' ? 'No searches yet' : analytics.mostSearchedCategory.charAt(0).toUpperCase() + analytics.mostSearchedCategory.slice(1)}
          trend="Top result"
          trendUp={true}
        />
        <MetricCard
          icon={<Activity className="text-orange-500" size={24} />}
          title="Adherence Rate"
          value={`${(() => {
            const data = analytics.adherenceData?.data;
            if (!data || data.length < 2) return 0;
            const taken = data[0] || 0;
            const missed = data[1] || 0;
            const total = taken + missed;
            return total > 0 ? Math.round((taken / total) * 100) : 0;
          })()}%`}
          trend={analytics.adherenceData?.data?.[0] > analytics.adherenceData?.data?.[1] ? '+5%' : '-3%'}
          trendUp={analytics.adherenceData?.data?.[0] > analytics.adherenceData?.data?.[1]}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="text-primary dark:text-accent" size={24} />
            <h3 className="text-lg font-semibold dark:text-neutral-100">Search Activity (7 Days)</h3>
          </div>
          <div className="h-64">
            <Line data={searchTrendChart} options={chartOptions} />
          </div>
        </motion.div>

        {/* Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="text-primary dark:text-accent" size={24} />
            <h3 className="text-lg font-semibold dark:text-neutral-100">Potential Savings (7 Days)</h3>
          </div>
          <div className="h-64">
            <Bar data={savingsTrendChart} options={chartOptions} />
          </div>
        </motion.div>

        {/* Adherence Distribution */}
        {analytics.adherenceData.data?.length > 0 && analytics.adherenceData.data[0] + analytics.adherenceData.data[1] > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="text-primary dark:text-accent" size={24} />
              <h3 className="text-lg font-semibold dark:text-neutral-100">Medicine Adherence</h3>
            </div>
            <div className="h-64">
              <Pie data={adherenceChart} options={pieOptions} />
            </div>
          </motion.div>
        )}

        {/* Time Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-primary dark:text-accent" size={24} />
            <h3 className="text-lg font-semibold dark:text-neutral-100">Usage Insights</h3>
          </div>
          <div className="space-y-4">
            <InsightRow
              label="Total Searches"
              value={`${analytics.searchTrend.data?.reduce((a, b) => a + b, 0) || 0} this week`}
              icon="�"
            />
            <InsightRow
              label="Medicines Tracked"
              value={`${JSON.parse(localStorage.getItem('medilens_reminders') || '[]').length} reminders`}
              icon="💊"
            />
            <InsightRow
              label="Adherence Score"
              value={`${(() => {
                const data = analytics.adherenceData?.data;
                if (!data || data.length < 2) return 0;
                const taken = data[0] || 0;
                const missed = data[1] || 0;
                const total = taken + missed;
                return total > 0 ? Math.round((taken / total) * 100) : 0;
              })()}%`}
              icon="⏱️"
            />
            <InsightRow
              label="Most Searched"
              value={analytics.mostSearchedCategory === 'N/A' ? 'None yet' : analytics.mostSearchedCategory.charAt(0).toUpperCase() + analytics.mostSearchedCategory.slice(1)}
              icon="📅"
            />
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-neutral-100">💡 Personalized Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {analytics.totalSavings > 0 && (
            <InsightCard
              emoji="💰"
              title="Great Savings!"
              description={`You've potentially saved ₹${analytics.totalSavings.toLocaleString()} by choosing generic alternatives`}
              color="green"
            />
          )}
          {analytics.adherenceData.data?.[0] > 0 && (
            <InsightCard
              emoji="🎯"
              title="Consistency Matters"
              description={`You've taken ${analytics.adherenceData.data[0]} doses on time. Keep up the good work!`}
              color="blue"
            />
          )}
          {analytics.searchTrend.data && analytics.searchTrend.data.reduce((a, b) => a + b, 0) > 0 && (
            <InsightCard
              emoji="🔍"
              title="Active Health Management"
              description={`You've made ${analytics.searchTrend.data.reduce((a, b) => a + b, 0)} searches this week. Great engagement!`}
              color="purple"
            />
          )}
          {/* Show motivational message if no data */}
          {analytics.totalSavings === 0 && analytics.adherenceData.data?.[0] === 0 && (
            <InsightCard
              emoji="�"
              title="Get Started!"
              description="Start searching for medicines to track your savings and health journey"
              color="blue"
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

const MetricCard = ({ icon, title, value, trend, trendUp }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-4"
  >
    <div className="flex items-center justify-between mb-2">
      {icon}
      <span className={`text-sm font-medium flex items-center ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {trendUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {trend}
      </span>
    </div>
    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
    <p className="text-2xl font-bold dark:text-neutral-100">{value}</p>
  </motion.div>
)

const InsightRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0">
    <div className="flex items-center space-x-2">
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
    </div>
    <span className="text-sm font-semibold dark:text-neutral-100">{value}</span>
  </div>
)

const InsightCard = ({ emoji, title, description, color }) => {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="font-semibold mb-1 dark:text-neutral-100">{title}</h4>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
    </div>
  )
}

export default Analytics
