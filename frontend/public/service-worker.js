/* eslint-disable no-restricted-globals */

// Service Worker for MediLens - Medicine Reminders & Offline Support
const CACHE_NAME = 'medilens-v2'
const OFFLINE_URL = '/index.html'

// Assets to cache for offline use
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  // Add more assets as needed
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets')
      return cache.addAll(CACHE_ASSETS).catch(err => {
        console.warn('Some assets failed to cache:', err)
      })
    }).then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => clients.claim())
  )
})

// Fetch event - implement offline-first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache the fetched response for future use
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      }).catch(() => {
        // Return offline page if network fails
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL)
        }
      })
    })
  )
})

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_REMINDER') {
    const { medicine, times, frequency, dosage } = event.data.reminder
    console.log(`Setting ${times.length} reminder(s) for ${medicine}`)
    
    // Schedule notifications for each time
    times.forEach(time => {
      scheduleNotification(medicine, time, frequency, dosage)
    })
  }
  
  // Handle cache update requests
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Schedule notification function
function scheduleNotification(medicine, time, frequency, dosage) {
  // Parse time
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const scheduledTime = new Date()
  scheduledTime.setHours(hours, minutes, 0, 0)
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }
  
  const delay = scheduledTime.getTime() - now.getTime()
  
  // Set timeout for notification
  setTimeout(() => {
    self.registration.showNotification('MediLens Reminder 💊', {
      body: `Time to take ${dosage} tablet${dosage > 1 ? 's' : ''} of ${medicine}`,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: `medicine-${medicine}-${time}`,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        { action: 'taken', title: '✅ Taken', icon: '/check-icon.png' },
        { action: 'snooze', title: '⏰ Snooze 10 min', icon: '/snooze-icon.png' }
      ],
      data: {
        medicine,
        time,
        frequency,
        dosage,
        url: '/dashboard'
      }
    })
    
    // Schedule next reminder based on frequency
    rescheduleReminder(medicine, time, frequency, dosage)
  }, delay)
}

// Reschedule based on frequency
function rescheduleReminder(medicine, time, frequency, dosage) {
  let nextDelay = 0
  
  switch (frequency) {
    case 'daily':
      nextDelay = 24 * 60 * 60 * 1000 // 24 hours
      break
    case 'weekly':
      nextDelay = 7 * 24 * 60 * 60 * 1000 // 7 days
      break
    case 'monthly':
      nextDelay = 30 * 24 * 60 * 60 * 1000 // 30 days
      break
    default:
      nextDelay = 24 * 60 * 60 * 1000
  }
  
  setTimeout(() => {
    self.registration.showNotification('MediLens Reminder 💊', {
      body: `Time to take ${dosage} tablet${dosage > 1 ? 's' : ''} of ${medicine}`,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: `medicine-${medicine}-${time}`,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'snooze', title: '⏰ Snooze 10 min' }
      ],
      data: {
        medicine,
        time,
        frequency,
        dosage,
        url: '/dashboard'
      }
    })
    
    // Continue rescheduling
    rescheduleReminder(medicine, time, frequency, dosage)
  }, nextDelay)
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const { action, data } = event
  
  if (action === 'taken') {
    // Mark as taken in localStorage
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        clientList.forEach((client) => {
          client.postMessage({
            type: 'MARK_AS_TAKEN',
            medicine: event.notification.data.medicine
          })
        })
      })
    )
  } else if (action === 'snooze') {
    // Snooze for 10 minutes
    setTimeout(() => {
      self.registration.showNotification('MediLens Reminder 💊 (Snoozed)', {
        body: `Remember to take ${data.dosage} tablet${data.dosage > 1 ? 's' : ''} of ${data.medicine}`,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: `medicine-${data.medicine}-snooze`,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      })
    }, 10 * 60 * 1000) // 10 minutes
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow(data?.url || '/dashboard')
    )
  }
})

// Push notification event (for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        data: data
      })
    )
  }
})
