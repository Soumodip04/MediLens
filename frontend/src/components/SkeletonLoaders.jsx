import { motion } from 'framer-motion'

// Skeleton for search results
export const SearchResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((j) => (
              <div key={j} className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4 animate-pulse" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((k) => (
              <div key={k} className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for upload section
export const UploadSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-12"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto mb-3 animate-pulse" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mx-auto animate-pulse" />
      </div>
    </motion.div>
  )
}

// Skeleton for medicine cards
export const MedicineCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3 animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-3 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 animate-pulse" />
            <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for dashboard stats
export const StatsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-10 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

// Generic skeleton loader
export const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
    </div>
  )
}

// Shimmer effect skeleton
export const ShimmerSkeleton = ({ className = '', rows = 3 }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded animate-shimmer"
          style={{ 
            width: `${100 - i * 15}%`,
            backgroundSize: '1000px 100%'
          }}
        />
      ))}
    </div>
  )
}

export default SearchResultsSkeleton
