import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register Service Worker for notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered successfully:', registration)
        
        // Load existing reminders from localStorage and reschedule them
        const reminders = JSON.parse(localStorage.getItem('medilens_reminders') || '[]')
        reminders.forEach(reminder => {
          if (reminder.active && registration.active) {
            registration.active.postMessage({
              type: 'SET_REMINDER',
              reminder: {
                medicine: reminder.medicine,
                time: reminder.time,
                frequency: reminder.frequency
              }
            })
          }
        })
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
