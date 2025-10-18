import React, { useState } from 'react'
import { ExternalLink, ShoppingCart, TrendingDown, Star, Info, CheckCircle, Package, Truck, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PHARMACIES = [
  {
    id: '1mg',
    name: '1mg',
    fullName: 'Tata 1mg',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6347;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ff4500;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad1)' rx='24'/%3E%3Ctext x='60' y='58' font-family='Arial Black, sans-serif' font-size='52' font-weight='900' fill='white' text-anchor='middle' dominant-baseline='middle'%3E1%3C/text%3E%3Ctext x='60' y='88' font-family='Arial Black, sans-serif' font-size='24' font-weight='800' fill='white' text-anchor='middle' letter-spacing='1'%3Emg%3C/text%3E%3C/svg%3E"
        alt="1mg"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    searchUrl: (medicine) => `https://www.1mg.com/search/all?name=${encodeURIComponent(medicine)}`,
    tag: '⭐ Most Popular',
    features: ['Fast Delivery', 'Genuine Meds', 'Cashback'],
    deliveryTime: '1-2 days',
    rating: 4.5
  },
  {
    id: 'pharmeasy',
    name: 'PharmEasy',
    fullName: 'PharmEasy',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310847e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230d6e6a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad2)' rx='24'/%3E%3Crect x='51' y='22' width='18' height='76' fill='white' rx='9'/%3E%3Crect x='22' y='51' width='76' height='18' fill='white' rx='9'/%3E%3C/svg%3E"
        alt="PharmEasy"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    searchUrl: (medicine) => `https://pharmeasy.in/search/all?name=${encodeURIComponent(medicine)}`,
    tag: '🚀 Quick Delivery',
    features: ['Same Day', 'Upload Rx', 'Health Plus'],
    deliveryTime: '2-4 hours',
    rating: 4.4
  },
  {
    id: 'netmeds',
    name: 'Netmeds',
    fullName: 'Netmeds',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232874f0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231c5ab8;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad3)' rx='24'/%3E%3Ctext x='60' y='70' font-family='Arial Black, sans-serif' font-size='68' font-weight='900' fill='white' text-anchor='middle' dominant-baseline='middle'%3EN%3C/text%3E%3Cpath d='M 32 82 Q 60 92, 88 82' stroke='%2337c5f4' stroke-width='6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"
        alt="Netmeds"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-blue-600 to-blue-700',
    searchUrl: (medicine) => `https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(medicine)}`,
    tag: '🏢 Reliance',
    features: ['COD Available', 'Free Delivery', 'NMS'],
    deliveryTime: '1-3 days',
    rating: 4.3
  },
  {
    id: 'apollo',
    name: 'Apollo',
    fullName: 'Apollo Pharmacy',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236d28d9;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad4)' rx='24'/%3E%3Ccircle cx='60' cy='60' r='42' fill='none' stroke='white' stroke-width='7'/%3E%3Ctext x='60' y='60' font-family='Arial Black, sans-serif' font-size='56' font-weight='900' fill='white' text-anchor='middle' dominant-baseline='central'%3EA%3C/text%3E%3C/svg%3E"
        alt="Apollo"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    searchUrl: (medicine) => `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(medicine)}`,
    tag: '🏆 Trusted Brand',
    features: ['Store Pickup', 'Doctor Consult', 'Lab Tests'],
    deliveryTime: '1-2 days',
    rating: 4.6
  },
  {
    id: 'medplus',
    name: 'MedPlus',
    fullName: 'MedPlus',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2316a34a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad5)' rx='24'/%3E%3Crect x='51' y='24' width='18' height='72' fill='white' rx='9'/%3E%3Crect x='24' y='51' width='72' height='18' fill='white' rx='9'/%3E%3C/svg%3E"
        alt="MedPlus"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-green-600 to-emerald-700',
    searchUrl: (medicine) => `https://www.medplusmart.com/search?text=${encodeURIComponent(medicine)}`,
    tag: '💰 Competitive Prices',
    features: ['Loyalty Points', 'Bulk Discount', 'Membership'],
    deliveryTime: '2-3 days',
    rating: 4.2
  },
  {
    id: 'amazon',
    name: 'Amazon',
    fullName: 'Amazon Pharmacy',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23232f3e' rx='24'/%3E%3Ctext x='60' y='64' font-family='Arial, sans-serif' font-size='64' font-weight='700' fill='white' text-anchor='middle' dominant-baseline='middle'%3Ea%3C/text%3E%3Cpath d='M 22 80 Q 60 98, 98 80' stroke='%23ff9900' stroke-width='7' fill='none' stroke-linecap='round'/%3E%3Cpolygon points='92,77 99,80 95,86' fill='%23ff9900'/%3E%3C/svg%3E"
        alt="Amazon"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-orange-400 to-yellow-500',
    searchUrl: (medicine) => `https://www.amazon.in/s?k=${encodeURIComponent(medicine)}&i=hpc`,
    tag: '🚚 Prime Delivery',
    features: ['Next Day', 'Easy Returns', 'Amazon Pay'],
    deliveryTime: '1 day (Prime)',
    rating: 4.4
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    fullName: 'Flipkart Health+',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad7' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232874f0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231c5ab8;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad7)' rx='24'/%3E%3Ctext x='60' y='74' font-family='Arial Black, sans-serif' font-size='72' font-weight='900' fill='%23ffe500' text-anchor='middle' dominant-baseline='middle' style='font-style: italic;'%3EF%3C/text%3E%3Crect x='68' y='36' width='20' height='7' fill='%23ffe500' rx='3.5'/%3E%3C/svg%3E"
        alt="Flipkart"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-yellow-400 to-blue-500',
    searchUrl: (medicine) => `https://www.flipkart.com/search?q=${encodeURIComponent(medicine)}&marketplace=GROCERY`,
    tag: '💳 Cashback Offers',
    features: ['SuperCoins', 'No Cost EMI', 'Plus Benefits'],
    deliveryTime: '2-4 days',
    rating: 4.1
  },
  {
    id: 'truemeds',
    name: 'Truemeds',
    fullName: 'Truemeds',
    logoComponent: () => (
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='grad8' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236d28d9;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23grad8)' rx='24'/%3E%3Cpath d='M 60 30 C 60 30, 30 38, 30 60 C 30 82, 60 96, 60 108 C 60 96, 90 82, 90 60 C 90 38, 60 30, 60 30 Z' fill='white'/%3E%3Cpath d='M 60 48 L 60 72 M 48 60 L 72 60' stroke='%238b5cf6' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E"
        alt="Truemeds"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
    color: 'bg-gradient-to-br from-indigo-600 to-purple-700',
    searchUrl: (medicine) => `https://www.truemeds.in/medicine/${encodeURIComponent(medicine.toLowerCase().replace(/\s+/g, '-'))}`,
    tag: '🎯 Generic Focus',
    features: ['Generic Options', 'Savings', 'Free Shipping'],
    deliveryTime: '3-5 days',
    rating: 4.3
  }
]

export default function PharmacyLinks({ medicineName, isGeneric = false }) {
  const [expandedPharmacy, setExpandedPharmacy] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [view, setView] = useState(isGeneric ? 'list' : 'grid') // Force list view for generic alternatives

  const handlePharmacyClick = (pharmacy) => {
    // Track click for analytics
    const clicks = JSON.parse(localStorage.getItem('medilens_pharmacy_clicks') || '{}')
    clicks[pharmacy.id] = (clicks[pharmacy.id] || 0) + 1
    localStorage.setItem('medilens_pharmacy_clicks', JSON.stringify(clicks))

    // Track timestamp for analytics
    const clickHistory = JSON.parse(localStorage.getItem('medilens_pharmacy_history') || '[]')
    clickHistory.unshift({
      pharmacy: pharmacy.name,
      medicine: medicineName,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('medilens_pharmacy_history', JSON.stringify(clickHistory.slice(0, 100)))

    // Open in new tab
    window.open(pharmacy.searchUrl(medicineName), '_blank', 'noopener,noreferrer')
  }

  // Get most clicked pharmacy for "Popular Choice" badge
  const clicks = JSON.parse(localStorage.getItem('medilens_pharmacy_clicks') || '{}')
  const mostPopular = Object.keys(clicks).length > 0 
    ? Object.entries(clicks).sort(([,a], [,b]) => b - a)[0][0]
    : '1mg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-4 border-2 border-primary/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Buy Online
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Compare prices across {PHARMACIES.length} trusted platforms
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Info className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Generic Badge */}
      {isGeneric && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
        >
          <div className="flex items-center gap-2 text-white">
            <TrendingDown className="w-5 h-5" />
            <span className="font-semibold">
              Generic Medicine - Save up to 80% compared to branded!
            </span>
          </div>
        </motion.div>
      )}

      {/* Info Banner */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-2">How to get the best deal:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Compare prices across multiple platforms</li>
                    <li>Check for ongoing offers and coupons</li>
                    <li>Look for first-order discounts on new platforms</li>
                    <li>Use credit card offers for additional cashback</li>
                    <li>Always upload a valid prescription for Rx medicines</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {PHARMACIES.length} Pharmacies Available
          </span>
        </div>
        {/* Hide grid/list toggle for generic alternatives */}
        {!isGeneric && (
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                view === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
          </div>
        )}
      </div>

      {/* Pharmacy Grid/List */}
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
        {PHARMACIES.map((pharmacy) => {
          const isPopular = pharmacy.id === mostPopular

          return (
            <motion.button
              key={pharmacy.id}
              onClick={() => handlePharmacyClick(pharmacy)}
              onMouseEnter={() => setExpandedPharmacy(pharmacy.id)}
              onMouseLeave={() => setExpandedPharmacy(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative flex items-center gap-4 p-4 rounded-xl border-2 
                ${expandedPharmacy === pharmacy.id 
                  ? 'border-primary shadow-lg bg-primary/5' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }
                hover:border-primary transition-all duration-200
              `}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </div>
              )}

              {/* Pharmacy Logo */}
              <div className={`
                w-14 h-14 ${pharmacy.color} rounded-xl 
                flex items-center justify-center overflow-hidden
                group-hover:scale-110 transition-transform
                shadow-md
              `}>
                {pharmacy.logoComponent()}
              </div>

              {/* Pharmacy Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">
                    {pharmacy.name}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-primary flex-shrink-0" />
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {pharmacy.tag}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Click to check prices and availability
                </p>

                {/* Delivery & Rating */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Truck className="w-3 h-3" />
                    {pharmacy.deliveryTime}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {pharmacy.rating}
                  </div>
                </div>
                
                {/* Features (show on hover/expanded) */}
                {expandedPharmacy === pharmacy.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-1 mt-3"
                  >
                    {pharmacy.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Arrow Icon */}
              <div className="text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-transform text-2xl flex-shrink-0">
                →
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Prescription Upload Reminder */}
      <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
              📋 Prescription Required?
            </h4>
            <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Upload photo of doctor's prescription
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Accepted formats: JPG, PNG, PDF
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Ensure medicine name is clearly visible
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <Info className="w-4 h-4" />
          How to get best deals?
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
          ⚠️ <strong>Important:</strong> Click any pharmacy to check real-time prices and availability. 
          MediLens redirects you to trusted pharmacy websites where you can view actual pricing and purchase medicines. 
          We do not display estimated prices to ensure accuracy. Always verify medicine details and upload valid prescriptions for Rx medicines.
        </p>
      </div>
    </motion.div>
  )
}
