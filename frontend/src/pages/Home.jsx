import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import UploadSection from '../components/UploadSection'
import ResultsPanel from '../components/ResultsPanel'
import SearchSection from '../components/SearchSection'

const Home = () => {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const [triggerSearch, setTriggerSearch] = useState(false)
  const location = useLocation()

  // Handle search query from Dashboard (Quick Reorder or Quick Search)
  useEffect(() => {
    if (location.state?.searchQuery) {
      const autoSearch = location.state?.autoSearch || false
      
      // Set the initial query for SearchSection
      setInitialQuery(location.state.searchQuery)
      
      // If autoSearch is true, trigger search
      if (autoSearch) {
        setTriggerSearch(true)
      }
      
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleUploadComplete = (data) => {
    setResults(data)
    // Update stats
    const stats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    stats.medicinesViewed += data.medicines?.length || 0
    localStorage.setItem('medilens_stats', JSON.stringify(stats))
  }

  const handleSearchResults = (data) => {
    setResults(data)
    // Update stats
    const stats = JSON.parse(localStorage.getItem('medilens_stats') || '{"totalSearches":0,"medicinesViewed":0,"favoriteCount":0}')
    stats.medicinesViewed += data.medicines?.length || 0
    localStorage.setItem('medilens_stats', JSON.stringify(stats))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {!results ? (
        <>
          <Hero />
          <UploadSection 
            onUploadComplete={handleUploadComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <SearchSection 
            onSearchResults={handleSearchResults}
            initialQuery={initialQuery}
            triggerSearch={triggerSearch}
            onSearchTriggered={() => setTriggerSearch(false)}
          />
        </>
      ) : (
        <ResultsPanel 
          results={results} 
          onReset={() => setResults(null)}
        />
      )}
    </main>
  )
}

export default Home
