import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Home, Info, Mail, X, Menu, Moon, Sun, LayoutDashboard } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const location = useLocation()

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('medilens-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('medilens-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('medilens-theme', 'light')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 mb-8"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-primary p-2 rounded-lg">
                <Pill className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MediLens
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home size={18} />} text="Home" active={location.pathname === '/'} />
            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} text="Dashboard" active={location.pathname === '/dashboard'} />
            <NavLink to="/about" icon={<Info size={18} />} text="About" active={location.pathname === '/about'} />
            <NavLink to="/contact" icon={<Mail size={18} />} text="Contact" active={location.pathname === '/contact'} />
            
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-neutral-700/50 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle - Mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-neutral-700/50"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-secondary/50 dark:hover:bg-neutral-700/50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 py-4 border-t border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink 
                  to="/" 
                  icon={<Home size={20} />} 
                  text="Home" 
                  active={location.pathname === '/'}
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/dashboard" 
                  icon={<LayoutDashboard size={20} />} 
                  text="Dashboard" 
                  active={location.pathname === '/dashboard'}
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/about" 
                  icon={<Info size={20} />} 
                  text="About" 
                  active={location.pathname === '/about'}
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/contact" 
                  icon={<Mail size={20} />} 
                  text="Contact" 
                  active={location.pathname === '/contact'}
                  onClick={closeMobileMenu}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ to, icon, text, active }) => (
  <Link to={to}>
    <motion.div
      className={`flex items-center space-x-2 transition-colors ${
        active ? 'text-primary font-semibold' : 'text-neutral-600 hover:text-primary'
      }`}
      whileHover={{ y: -2 }}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </motion.div>
  </Link>
)

const MobileNavLink = ({ to, icon, text, active, onClick }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-secondary/30 text-neutral-700 hover:bg-secondary/50'
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </motion.div>
  </Link>
)

export default Navbar
