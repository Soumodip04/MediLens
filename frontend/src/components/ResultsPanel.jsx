import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Info, DollarSign, AlertCircle, Star, StarOff, Share2, Copy, MessageCircle, Mail, Download } from 'lucide-react'
import GenericCard from './GenericCard'
import ReminderModal from './ReminderModal'
import PharmacyLinks from './PharmacyLinks'
import DosageCalculator from './DosageCalculator'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ResultsPanel = ({ results, onReset }) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [showReminder, setShowReminder] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('medilens_favorites') || '[]')
  })

  // Close share menu when clicking outside
  useState(() => {
    const handleClickOutside = (e) => {
      if (showShareMenu !== null && !e.target.closest('.share-menu-container')) {
        setShowShareMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showShareMenu])

  const toggleFavorite = (medicine) => {
    const existingFavorites = JSON.parse(localStorage.getItem('medilens_favorites') || '[]')
    const isFavorite = existingFavorites.some(fav => fav.brand_name === medicine.brand_name)
    
    let updatedFavorites
    if (isFavorite) {
      updatedFavorites = existingFavorites.filter(fav => fav.brand_name !== medicine.brand_name)
      toast.info(`${medicine.brand_name} removed from favorites`)
    } else {
      // Add timestamp when adding to favorites
      const medicineWithTimestamp = {
        ...medicine,
        timestamp: new Date().toISOString()
      }
      updatedFavorites = [...existingFavorites, medicineWithTimestamp]
      toast.success(`${medicine.brand_name} added to favorites`)
    }
    
    localStorage.setItem('medilens_favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)

    // Update stats
    const stats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    stats.favoriteCount = updatedFavorites.length
    localStorage.setItem('medilens_stats', JSON.stringify(stats))
  }

  const isFavorite = (medicineName) => {
    return favorites.some(fav => fav.brand_name === medicineName)
  }

  const generateShareText = (medicine) => {
    return `
🏥 *Medicine Information from MediLens*

💊 *${medicine.brand_name}*
${medicine.hindi_name ? `(${medicine.hindi_name})` : ''}

🔬 Active Ingredient: ${medicine.active_ingredient}
💪 Strength: ${medicine.strength || 'N/A'}
📋 Form: ${medicine.dosage_form || 'N/A'}
💰 Price: ₹${medicine.price?.toFixed(2) || 'N/A'}

📌 Use Case: ${medicine.use_case}
⚠️ Side Effects: ${medicine.side_effects}
🏭 Manufacturer: ${medicine.manufacturer}

${medicine.is_otc ? '✅ Available Over-The-Counter (OTC)' : '⚕️ Prescription Required'}
${medicine.schedule ? `📋 Schedule: ${medicine.schedule}` : ''}

---
Powered by MediLens 🔍
Find generic alternatives & save up to 80%!
`.trim()
  }

  const handleShare = async (medicine, method) => {
    const shareText = generateShareText(medicine)
    const shareUrl = window.location.href
    
    try {
      switch(method) {
        case 'copy':
          await navigator.clipboard.writeText(shareText)
          toast.success('✅ Medicine details copied to clipboard!')
          break
          
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
          toast.success('📱 Opening WhatsApp...')
          break
          
        case 'email':
          const subject = `Medicine Info: ${medicine.brand_name}`
          const body = encodeURIComponent(shareText)
          window.location.href = `mailto:?subject=${subject}&body=${body}`
          toast.success('📧 Opening email client...')
          break
          
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: `Medicine Info: ${medicine.brand_name}`,
              text: shareText,
              url: shareUrl
            })
            toast.success('✅ Shared successfully!')
          } else {
            // Fallback to copy
            await navigator.clipboard.writeText(shareText)
            toast.success('✅ Medicine details copied to clipboard!')
          }
          break
          
        case 'download':
          const blob = new Blob([shareText], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${medicine.brand_name.replace(/\s+/g, '_')}_info.txt`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success('📥 Downloaded medicine info!')
          break
      }
      setShowShareMenu(null)
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Failed to share. Please try copying instead.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center space-x-2 text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent/80 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Upload New Prescription</span>
        </motion.button>
        
        <div className="glass-card px-6 py-3">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            Found <strong className="text-primary dark:text-accent">{results.medicines?.length || 0}</strong> medicine(s)
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        <AnimatePresence>
          {results.medicines?.map((medicine, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass-card p-6">
                {/* Medicine Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-2xl font-bold text-primary dark:text-accent">
                        {medicine.brand_name}
                        {medicine.hindi_name && (
                          <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">({medicine.hindi_name})</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(medicine)}
                          className={`p-2 rounded-lg transition-colors ${
                            isFavorite(medicine.brand_name)
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-yellow-500'
                          }`}
                          title={isFavorite(medicine.brand_name) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFavorite(medicine.brand_name) ? (
                            <Star size={20} className="fill-current" />
                          ) : (
                            <StarOff size={20} />
                          )}
                        </motion.button>
                        
                        {/* Share Button */}
                        <div className="relative share-menu-container">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowShareMenu(showShareMenu === index ? null : index)}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Share medicine details"
                          >
                            <Share2 size={20} />
                          </motion.button>
                          
                          {/* Share Menu Dropdown */}
                          <AnimatePresence>
                            {showShareMenu === index && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[200px]"
                              >
                                <div className="space-y-1">
                                  <button
                                    onClick={() => handleShare(medicine, 'copy')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                  >
                                    <Copy size={18} className="text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Copy to Clipboard</span>
                                  </button>
                                  <button
                                    onClick={() => handleShare(medicine, 'whatsapp')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
                                  >
                                    <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share on WhatsApp</span>
                                  </button>
                                  <button
                                    onClick={() => handleShare(medicine, 'email')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                                  >
                                    <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Send via Email</span>
                                  </button>
                                  <button
                                    onClick={() => handleShare(medicine, 'download')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
                                  >
                                    <Download size={18} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download as Text</span>
                                  </button>
                                  {navigator.share && (
                                    <button
                                      onClick={() => handleShare(medicine, 'native')}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
                                    >
                                      <Share2 size={18} className="text-orange-600 dark:text-orange-400" />
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">More Options...</span>
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-2">
                      Active: <span className="font-medium">{medicine.active_ingredient}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {medicine.strength && (
                        <span className="px-2 py-1 text-xs rounded bg-secondary/60 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600">Strength: {medicine.strength}</span>
                      )}
                      {medicine.dosage_form && (
                        <span className="px-2 py-1 text-xs rounded bg-secondary/60 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600">Form: {medicine.dosage_form}</span>
                      )}
                      {typeof medicine.is_otc !== 'undefined' && (
                        <span className={`px-2 py-1 text-xs rounded border ${medicine.is_otc ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>{medicine.is_otc ? 'OTC' : 'Prescription'}</span>
                      )}
                      {medicine.schedule && (
                        <span className={`px-2 py-1 text-xs rounded border ${
                          medicine.schedule === 'H1' 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
                            : medicine.schedule === 'H' 
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' 
                            : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                        }`}>Schedule {medicine.schedule}</span>
                      )}
                      {medicine.age_group && (
                        <span className="px-2 py-1 text-xs rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{medicine.age_group === 'pediatric' ? 'Pediatric' : medicine.age_group === 'both' ? 'All ages' : 'Adult'}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Price</p>
                    <p className="text-2xl font-bold text-primary dark:text-accent">
                      ₹{medicine.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Medicine Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <InfoCard
                    icon={<Info size={18} />}
                    title="Use Case"
                    content={medicine.use_case}
                  />
                  <InfoCard
                    icon={<AlertCircle size={18} />}
                    title="Side Effects"
                    content={medicine.side_effects}
                    warning
                  />
                  <InfoCard
                    icon={<DollarSign size={18} />}
                    title="Manufacturer"
                    content={medicine.manufacturer}
                  />
                </div>

                {(medicine.interactions || medicine.contraindications) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {medicine.interactions && (
                      <InfoCard
                        icon={<Info size={18} />}
                        title="Interactions"
                        content={medicine.interactions}
                      />
                    )}
                    {medicine.contraindications && (
                      <InfoCard
                        icon={<AlertCircle size={18} />}
                        title="Contraindications"
                        content={medicine.contraindications}
                        warning
                      />
                    )}
                  </div>
                )}

                {/* Dosage Calculator */}
                {(medicine.dosage_form === 'Tablet' || medicine.dosage_form === 'Capsule') && (
                  <div className="mb-6">
                    <DosageCalculator 
                      medicineName={medicine.brand_name}
                      dosageForm={medicine.dosage_form}
                    />
                  </div>
                )}

                {/* Generic Alternatives */}
                {medicine.generics && medicine.generics.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="bg-secondary px-3 py-1 rounded-full text-primary">
                        {medicine.generics.length} Cheaper Alternative(s)
                      </span>
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {medicine.generics.map((generic, idx) => (
                        <GenericCard
                          key={idx}
                          generic={generic}
                          originalPrice={medicine.price}
                          onSetReminder={() => {
                            setSelectedMedicine(generic.brand_name)
                            setShowReminder(true)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pharmacy Links - Buy Online */}
                <PharmacyLinks 
                  medicineName={medicine.brand_name}
                  isGeneric={false}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reminder Modal */}
      {showReminder && (
        <ReminderModal
          medicine={selectedMedicine}
          onClose={() => setShowReminder(false)}
        />
      )}
    </motion.div>
  )
}

const InfoCard = ({ icon, title, content, warning }) => (
  <div className={`p-4 rounded-lg ${
    warning 
      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
      : 'bg-secondary/30 dark:bg-neutral-700/30'
  }`}>
    <div className="flex items-center space-x-2 mb-2">
      <span className={warning ? 'text-red-600 dark:text-red-400' : 'text-primary dark:text-accent'}>{icon}</span>
      <h5 className="font-semibold text-sm dark:text-neutral-100">{title}</h5>
    </div>
    <p className="text-sm text-neutral-700 dark:text-neutral-300">{content}</p>
  </div>
)

export default ResultsPanel
