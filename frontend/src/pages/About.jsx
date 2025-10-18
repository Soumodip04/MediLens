import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Shield, Users, Target, Award, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link to="/" className="flex items-center space-x-2 text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent/80 font-medium">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          About MediLens
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Making healthcare affordable and accessible for everyone in India
        </p>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-8 mb-12"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Target className="text-primary dark:text-accent" size={32} />
          <h2 className="text-3xl font-bold dark:text-neutral-100">Our Mission</h2>
        </div>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
          At MediLens, we believe that access to affordable medication is a fundamental right. 
          Our mission is to empower patients with information about generic alternatives, helping 
          them save money without compromising on quality. We use cutting-edge AI and OCR technology 
          to make this process as simple as taking a photo of your prescription.
        </p>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-neutral-100">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="text-primary dark:text-accent" size={40} />}
            title="Instant OCR Scanning"
            description="Upload your prescription and our AI extracts medicine names in seconds using advanced Tesseract OCR technology."
          />
          <FeatureCard
            icon={<Shield className="text-primary dark:text-accent" size={40} />}
            title="Verified Generic Alternatives"
            description="We match medicines by active ingredients to find safe, approved generic alternatives that work exactly the same."
          />
          <FeatureCard
            icon={<Heart className="text-primary dark:text-accent" size={40} />}
            title="Save Money"
            description="Compare prices across 6+ pharmacies and discover generic alternatives that can save you 30-80% on medication costs."
          />
        </div>
      </motion.section>

      {/* Statistics */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-8 mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-neutral-100">Impact by Numbers</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <StatCard number="107+" label="Medicines in Database" />
          <StatCard number="6" label="Pharmacy Partners" />
          <StatCard number="95%" label="OCR Accuracy" />
          <StatCard number="₹5000+" label="Avg. Yearly Savings" />
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-neutral-100">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <StepCard
            number="1"
            title="Upload Prescription"
            description="Take a photo or upload your prescription image"
          />
          <StepCard
            number="2"
            title="AI Extraction"
            description="Our OCR technology reads and extracts medicine names"
          />
          <StepCard
            number="3"
            title="Find Alternatives"
            description="We match by active ingredients to find generics"
          />
          <StepCard
            number="4"
            title="Compare & Save"
            description="View prices across pharmacies and save money"
          />
        </div>
      </motion.section>

      {/* Team Values */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-8 mb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Users className="text-primary dark:text-accent" size={32} />
          <h2 className="text-3xl font-bold dark:text-neutral-100">Our Values</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard
            icon={<Shield size={24} />}
            title="Patient Safety"
            description="We only recommend verified, approved generic alternatives with the same active ingredients."
          />
          <ValueCard
            icon={<Heart size={24} />}
            title="Transparency"
            description="Clear information about medicines, prices, and alternatives - no hidden costs or surprises."
          />
          <ValueCard
            icon={<Award size={24} />}
            title="Accessibility"
            description="Making healthcare affordable for everyone, especially those who need it most."
          />
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
      >
        <h3 className="font-bold text-yellow-800 mb-2">Important Note</h3>
        <p className="text-yellow-700">
          MediLens is an informational tool designed to help you make informed decisions about 
          generic alternatives. Always consult your doctor or pharmacist before switching medications. 
          We are not a substitute for professional medical advice.
        </p>
      </motion.section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6 text-center"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 dark:text-neutral-100">{title}</h3>
    <p className="text-neutral-600 dark:text-neutral-300">{description}</p>
  </motion.div>
)

const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-primary dark:text-accent mb-2">{number}</div>
    <div className="text-neutral-600 dark:text-neutral-300">{label}</div>
  </div>
)

const StepCard = ({ number, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6 text-center"
  >
    <div className="w-12 h-12 bg-primary dark:bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-lg font-bold mb-2 dark:text-neutral-100">{title}</h3>
    <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
  </motion.div>
)

const ValueCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-lg mb-3 text-primary dark:text-accent">
      {icon}
    </div>
    <h4 className="font-semibold mb-2 dark:text-neutral-100">{title}</h4>
    <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
  </div>
)

export default About
