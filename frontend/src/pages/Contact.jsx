import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
          Get in Touch
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="text-primary dark:text-accent" size={28} />
              <h2 className="text-2xl font-bold dark:text-neutral-100">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="report">Report an Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-neutral-200">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary dark:focus:border-accent focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 outline-none resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Contact Cards */}
          <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-lg">
                <Mail className="text-primary dark:text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 dark:text-neutral-100">Email Us</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-2">Send us an email anytime</p>
                <a href="mailto:support@medilens.com" className="text-primary dark:text-accent hover:underline">
                  support@medilens.com
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-lg">
                <Phone className="text-primary dark:text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 dark:text-neutral-100">Call Us</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-2">Mon-Fri from 9am to 6pm IST</p>
                <a href="tel:+911234567890" className="text-primary dark:text-accent hover:underline">
                  +91 1234 567 890
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-lg">
                <MapPin className="text-primary dark:text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 dark:text-neutral-100">Visit Us</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  MediLens Healthcare Pvt. Ltd.<br />
                  123 Health Street, Medical District<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 dark:bg-accent/20 p-3 rounded-lg">
                <Clock className="text-primary dark:text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 dark:text-neutral-100">Business Hours</h3>
                <div className="text-neutral-600 dark:text-neutral-300 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">Quick Response</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent technical issues, please call our support hotline.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-neutral-100">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FAQCard
            question="Is MediLens free to use?"
            answer="Yes! MediLens is completely free. Our mission is to make healthcare affordable for everyone."
          />
          <FAQCard
            question="Are generic medicines safe?"
            answer="Absolutely. Generic medicines contain the same active ingredients as branded versions and are approved by regulatory authorities."
          />
          <FAQCard
            question="How accurate is the OCR scanning?"
            answer="Our OCR technology has 95%+ accuracy. However, we recommend double-checking the detected medicines before making decisions."
          />
          <FAQCard
            question="Do you sell medicines?"
            answer="No, we don't sell medicines. We provide information and comparison. You can purchase from our partner pharmacies."
          />
        </div>
      </motion.section>
    </div>
  )
}

const FAQCard = ({ question, answer }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="glass-card dark:bg-neutral-800 dark:border-neutral-700 p-6"
  >
    <h3 className="font-semibold text-lg mb-2 dark:text-neutral-100">{question}</h3>
    <p className="text-neutral-600 dark:text-neutral-300">{answer}</p>
  </motion.div>
)

export default Contact
