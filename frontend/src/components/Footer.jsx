import { Heart, Shield, AlertTriangle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const showDisclaimer = location.pathname === '/' // Only show on home page

  return (
    <footer className="glass-card dark:bg-neutral-800 dark:border-neutral-700 mt-16 py-8">
      <div className="container mx-auto px-6">
        {/* Disclaimer - Only on Home Page */}
        {showDisclaimer && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg mb-6 flex items-start space-x-3">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">Important Disclaimer</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                MediLens is for educational and informational purposes only. This app is not a substitute 
                for professional medical advice, diagnosis, or treatment. Always consult your physician 
                or qualified healthcare provider before making any changes to your medication.
              </p>
            </div>
          </div>
        )}

        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h4 className="font-bold text-lg mb-3 flex items-center space-x-2 dark:text-neutral-100">
              <Shield className="text-primary dark:text-accent" size={20} />
              <span>MediLens</span>
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Empowering patients with information about affordable generic alternatives 
              to make informed healthcare decisions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 dark:text-neutral-100">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li><Link to="/about" className="hover:text-primary dark:hover:text-accent">About Us</Link></li>
              <li><Link to="/about" className="hover:text-primary dark:hover:text-accent">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-primary dark:hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-primary dark:hover:text-accent">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 dark:text-neutral-100">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <li>Email: <a href="mailto:support@medilens.com" className="hover:text-primary dark:hover:text-accent">support@medilens.com</a></li>
              <li>Phone: <a href="tel:+911234567890" className="hover:text-primary dark:hover:text-accent">+91 1234567890</a></li>
              <li>
                <Link to="/contact" className="hover:text-primary dark:hover:text-accent">Report an Issue</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="text-red-500 dark:text-red-400" size={16} fill="currentColor" />
            <span>for better healthcare • © 2025 MediLens</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
