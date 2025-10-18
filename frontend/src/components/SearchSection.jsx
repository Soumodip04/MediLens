import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader, Clock, TrendingUp, X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const SearchSection = ({ onSearchResults, initialQuery = '', triggerSearch = false, onSearchTriggered }) => {
  const [query, setQuery] = useState(initialQuery)
  const [onlyOTC, setOnlyOTC] = useState(false)
  const [onlyPediatric, setOnlyPediatric] = useState(false)
  const [onlyH1, setOnlyH1] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const searchRef = useRef(null)

  // Update query when initialQuery prop changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  // Trigger search when triggerSearch prop becomes true
  useEffect(() => {
    if (triggerSearch && query) {
      handleSearch(null, query)
      if (onSearchTriggered) {
        onSearchTriggered()
      }
    }
  }, [triggerSearch])

  // Load recent searches on mount
  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem('medilens_recent_searches') || '[]')
    setRecentSearches(searches.slice(0, 5))
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
        )
        if (response.data.success && response.data.results) {
          // Get unique suggestions
          const uniqueSuggestions = response.data.results
            .slice(0, 5)
            .map(med => ({
              brand_name: med.brand_name,
              generic_name: med.generic_name,
              active_ingredient: med.active_ingredient
            }))
          setSuggestions(uniqueSuggestions)
        }
      } catch (error) {
        console.error('Suggestion fetch error:', error)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  const saveSearchHistory = (searchQuery) => {
    const searches = JSON.parse(localStorage.getItem('medilens_recent_searches') || '[]')
    const newSearch = {
      query: searchQuery,
      timestamp: new Date().toISOString()
    }
    // Remove duplicates and add new search at beginning
    const filtered = searches.filter(s => s.query.toLowerCase() !== searchQuery.toLowerCase())
    const updated = [newSearch, ...filtered].slice(0, 10) // Keep last 10
    localStorage.setItem('medilens_recent_searches', JSON.stringify(updated))
    setRecentSearches(updated.slice(0, 5))

    // Update stats
    const stats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    stats.totalSearches += 1
    localStorage.setItem('medilens_stats', JSON.stringify(stats))
  }

  const handleSearch = async (e, searchQuery = null) => {
    if (e) e.preventDefault()
    
    const queryToSearch = searchQuery || query
    if (!queryToSearch.trim()) {
      toast.warning('Please enter a medicine name')
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)
    
    try {
      // Check if it's a symptom search
      const symptomResult = searchBySymptom(queryToSearch)
      
      const response = await axios.get(
        `${API_BASE_URL}/search?query=${encodeURIComponent(symptomResult || queryToSearch)}`
      )

      if (response.data.success && response.data.results?.length > 0) {
        let meds = response.data.results
        
        // Apply client-side filters
        meds = meds.filter(m => {
          if (onlyOTC && !(m.is_otc === true)) return false
          if (onlyPediatric && !(m.age_group === 'pediatric' || m.age_group === 'both')) return false
          if (onlyH1 && !(m.schedule === 'H1')) return false
          return true
        })
        
        onSearchResults({ medicines: meds })
        saveSearchHistory(queryToSearch)
        
        // Save search results with medicines for analytics
        const searchHistory = JSON.parse(localStorage.getItem('medilens_search_history') || '[]')
        searchHistory.unshift({
          query: queryToSearch,
          timestamp: new Date().toISOString(),
          results: meds.slice(0, 5), // Save first 5 results to avoid storage bloat
          resultCount: meds.length
        })
        // Keep last 50 searches
        localStorage.setItem('medilens_search_history', JSON.stringify(searchHistory.slice(0, 50)))
        
        if (symptomResult) {
          toast.success(`Found ${meds.length} medicine(s) for "${queryToSearch}"`)
        } else {
          toast.success(`Found ${meds.length} result(s)`)
        }
      } else {
        toast.info('No medicines found. Try a different name.')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // Symptom to medicine mapping
  const searchBySymptom = (symptom) => {
    const symptomMap = {
      'headache': 'Paracetamol',
      'head ache': 'Paracetamol',
      'pain': 'Paracetamol',
      'fever': 'Paracetamol',
      'cold': 'Cetirizine',
      'cough': 'Dextromethorphan',
      'acidity': 'Pantoprazole',
      'gas': 'Pantoprazole',
      'heartburn': 'Omeprazole',
      'allergy': 'Cetirizine',
      'diabetes': 'Metformin',
      'sugar': 'Metformin',
      'blood pressure': 'Amlodipine',
      'hypertension': 'Amlodipine',
      'infection': 'Azithromycin',
      'antibiotic': 'Azithromycin',
      'inflammation': 'Ibuprofen',
      'swelling': 'Diclofenac',
      'vomiting': 'Ondansetron',
      'nausea': 'Ondansetron',
      'diarrhea': 'Loperamide',
      'loose motion': 'Loperamide',
      'constipation': 'Isabgol',
      'anxiety': 'Alprazolam',
      'depression': 'Fluoxetine',
      'insomnia': 'Zolpidem',
      'sleep': 'Zolpidem',
      'asthma': 'Salbutamol',
      'breathlessness': 'Salbutamol'
    }
    
    const lowerSymptom = symptom.toLowerCase().trim()
    return symptomMap[lowerSymptom] || null
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.brand_name)
    setShowSuggestions(false)
    handleSearch(null, suggestion.brand_name)
  }

  const handleRecentSearchClick = (search) => {
    setQuery(search.query)
    handleSearch(null, search.query)
  }

  const clearRecentSearches = () => {
    localStorage.removeItem('medilens_recent_searches')
    setRecentSearches([])
    toast.info('Search history cleared')
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="max-w-2xl mx-auto mb-16"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Or Search Manually</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Search by medicine name or symptom (e.g., "headache", "fever")
        </p>
      </div>

      <form onSubmit={handleSearch} className="glass-card p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative" ref={searchRef}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for Paracetamol, Aspirin, or symptoms like 'headache'..."
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              disabled={isSearching}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSuggestions([])
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <X size={18} />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-80 overflow-y-auto shadow-xl"
                  style={{ zIndex: 9999 }}
                >
                  {/* Suggestions from search */}
                  {suggestions.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center">
                        <TrendingUp size={14} className="mr-2" />
                        Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
                        >
                          <div className="font-medium text-sm">{suggestion.brand_name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {suggestion.generic_name || suggestion.active_ingredient}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && !query && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-2" />
                          Recent Searches
                        </div>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Clear
                        </button>
                      </div>
                      {recentSearches.map((search, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-3 py-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <span className="text-sm">{search.query}</span>
                          <span className="text-xs text-neutral-400">
                            {new Date(search.timestamp).toLocaleDateString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSearching}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="inline-flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={onlyOTC} onChange={(e) => setOnlyOTC(e.target.checked)} />
            <span>OTC only</span>
          </label>
          <label className="inline-flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={onlyPediatric} onChange={(e) => setOnlyPediatric(e.target.checked)} />
            <span>Pediatric suitable</span>
          </label>
          <label className="inline-flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={onlyH1} onChange={(e) => setOnlyH1(e.target.checked)} />
            <span>Schedule H1</span>
          </label>
        </div>
      </form>
    </motion.section>
  )
}

export default SearchSection
