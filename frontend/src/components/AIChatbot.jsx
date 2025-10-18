import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader, Mic, Volume2, VolumeX } from 'lucide-react'

// Accurate Medicine Knowledge Base - Based on Medical Literature
const MEDICINE_KNOWLEDGE = {
  // Specific medicine information - verified and accurate
  medicines: {
    paracetamol: {
      name: "Paracetamol (Acetaminophen)",
      info: {
        food: "Can be taken with or without food. Food may slightly delay absorption but doesn't affect overall effectiveness.",
        alcohol: "⚠️ AVOID alcohol. Alcohol combined with paracetamol significantly increases risk of liver damage. Even moderate alcohol consumption should be avoided.",
        pregnancy: "Generally considered safe in all trimesters when used at recommended doses. However, consult your doctor before use.",
        breastfeeding: "Safe in normal therapeutic doses. Small amounts pass into breast milk but are not harmful to the baby.",
        storage: "Store at room temperature (15-30°C), away from moisture and heat.",
        overdose: "⚠️ SERIOUS: Overdose can cause severe liver damage. Never exceed 4000mg (4g) in 24 hours for adults."
      }
    },
    ibuprofen: {
      name: "Ibuprofen",
      info: {
        food: "⚠️ MUST take with food or milk. Reduces stomach irritation and ulcer risk. Taking on empty stomach can cause gastric damage.",
        alcohol: "Avoid alcohol. Increases risk of stomach bleeding and ulcers. Also increases kidney strain.",
        pregnancy: "⚠️ NOT RECOMMENDED especially after 30 weeks. Can cause heart problems in baby and complications during delivery. Consult doctor immediately.",
        breastfeeding: "Generally safe in short-term use at low doses. Small amounts pass into breast milk. Consult pediatrician for prolonged use.",
        storage: "Store at room temperature (20-25°C), protected from light and moisture.",
        warnings: "⚠️ Risk of heart attack/stroke increases with long-term use. Not suitable for patients with heart disease, high blood pressure, or kidney problems without medical supervision."
      }
    },
    aspirin: {
      name: "Aspirin (Acetylsalicylic Acid)",
      info: {
        food: "Take with food or full glass of water/milk to prevent stomach upset and ulcers.",
        alcohol: "⚠️ AVOID alcohol. Significantly increases stomach bleeding risk and can cause severe gastric damage.",
        pregnancy: "⚠️ NOT RECOMMENDED, especially in third trimester. Can cause bleeding complications in mother and baby. Only use if specifically prescribed by doctor.",
        breastfeeding: "Generally avoided. Can be used in low doses for specific conditions under medical supervision. High doses not recommended.",
        storage: "Store in cool, dry place. Discard if vinegar smell develops (sign of degradation).",
        warnings: "⚠️ Not for children under 16 with viral infections (Reye's syndrome risk). Risk of bleeding - inform doctor/dentist before procedures."
      }
    }
  },
  
  // Evidence-based common questions
  commonQuestions: [
    {
      question: "Can I take this with food?",
      keywords: ["food", "eat", "meal", "stomach", "empty stomach", "before food", "after food"],
      response: "📋 FOOD INTERACTION GUIDELINES:\n\n• Most medicines can be taken with or without food\n• Some require food to prevent stomach upset (NSAIDs like ibuprofen)\n• Some work better on empty stomach (certain antibiotics)\n• Check medicine label for specific instructions\n• Ask pharmacist if unclear\n\n⚠️ Always follow the specific directions on your medicine label or as prescribed by your doctor."
    },
    {
      question: "What are common side effects?",
      keywords: ["side effect", "reaction", "adverse", "problem", "symptoms"],
      response: "⚕️ SIDE EFFECTS - WHAT TO KNOW:\n\nCOMMON (Usually Mild):\n• Nausea or upset stomach\n• Drowsiness or dizziness\n• Headache\n• Dry mouth\n\n⚠️ SEEK IMMEDIATE MEDICAL HELP IF:\n• Difficulty breathing or swallowing\n• Severe rash, hives, or swelling\n• Chest pain or irregular heartbeat\n• Severe stomach pain\n• Signs of allergic reaction\n\n💡 TIP: Use our search feature to find specific side effects for your medicine. Every medicine has different side effects."
    },
    {
      question: "Can I drink alcohol?",
      keywords: ["alcohol", "beer", "wine", "drink", "liquor", "drinking"],
      response: "🍺 ALCOHOL & MEDICINES:\n\n⚠️ GENERAL RULE: Avoid alcohol with medications\n\nWHY IT'S DANGEROUS:\n• Reduces medicine effectiveness\n• Increases side effects (drowsiness, dizziness)\n• Can cause liver damage (paracetamol + alcohol)\n• Risk of stomach bleeding (NSAIDs + alcohol)\n• Dangerous interactions with antibiotics, antidepressants\n\n✅ SAFE APPROACH:\n• Wait at least 2-3 hours after taking medicine\n• Better to avoid alcohol entirely during treatment\n• Consult your doctor for specific medicines\n\n⚠️ This is general advice. Some medicines absolutely cannot be mixed with alcohol."
    },
    {
      question: "Is it safe during pregnancy?",
      keywords: ["pregnancy", "pregnant", "expecting", "baby", "conception", "trimester"],
      response: "🤰 PREGNANCY & MEDICINES:\n\n⚠️ CRITICAL: ALWAYS consult your doctor BEFORE taking ANY medicine during pregnancy\n\nGENERAL GUIDELINES:\n✅ Generally Safe (with doctor approval):\n• Paracetamol (acetaminophen) - at normal doses\n• Certain antibiotics (as prescribed)\n• Prenatal vitamins\n\n⚠️ AVOID (unless prescribed):\n• Ibuprofen (especially after 30 weeks)\n• Aspirin (especially third trimester)\n• Most pain medications\n• Herbal supplements\n\n💡 IMPORTANT:\n• Risk varies by trimester\n• Even 'safe' medicines need doctor approval\n• Don't stop prescribed medicines without consulting doctor\n• Use non-drug alternatives when possible\n\n🚨 NEVER self-medicate during pregnancy"
    },
    {
      question: "Can I take this with other medicines?",
      keywords: ["interaction", "together", "combine", "mix", "other medicine", "multiple", "drug interaction"],
      response: "💊 DRUG INTERACTIONS:\n\n⚠️ IMPORTANT: Medicine interactions can be dangerous\n\nCOMMON INTERACTIONS:\n• Blood thinners + NSAIDs = Bleeding risk\n• Paracetamol + Warfarin = Increased blood thinning\n• Antibiotics + Birth control = Reduced effectiveness\n• Antacids + Many medicines = Reduced absorption\n\n✅ WHAT TO DO:\n1. Use our 'Drug Interaction Checker' feature\n2. Tell your doctor about ALL medicines you take:\n   - Prescription medicines\n   - Over-the-counter medicines\n   - Vitamins & supplements\n   - Herbal products\n\n3. Maintain a medicine list\n4. Check with pharmacist before combining\n\n⚠️ This applies to ALL medicines, including supplements and herbs"
    },
    {
      question: "How should I store medicines?",
      keywords: ["store", "storage", "keep", "refrigerator", "temperature", "expiry", "shelf life"],
      response: "🏠 PROPER MEDICINE STORAGE:\n\n✅ GENERAL RULES:\n• Cool, dry place (15-25°C)\n• Away from direct sunlight\n• Original container with label\n• Out of reach of children\n• Away from heat sources\n\n❌ DON'T STORE:\n• In bathroom (humidity damages medicines)\n• In car (temperature fluctuations)\n• Near kitchen sink (moisture)\n• In extreme heat or cold\n\n🔍 CHECK REGULARLY:\n• Expiry dates (use before expiration)\n• Physical changes (color, odor, texture)\n• Damaged packaging\n\n⚠️ SPECIAL STORAGE:\n• Some medicines need refrigeration (check label)\n• Insulin, certain antibiotics - refrigerate\n• Never freeze unless instructed\n\n💡 When in doubt, check the label or ask your pharmacist"
    },
    {
      question: "What if I miss a dose?",
      keywords: ["miss", "forgot", "skip", "dose", "missed dose"],
      response: "⏰ MISSED DOSE - WHAT TO DO:\n\n✅ GENERAL RULE:\n• Take it as soon as you remember\n• If close to next dose time (within 1-2 hours), skip it\n• Never double the dose\n\n⚠️ EXCEPTIONS:\n• Time-critical medicines (birth control, antibiotics)\n• Some medicines have specific missed dose instructions\n• Check your medicine label or ask pharmacist\n\n💡 PREVENT MISSED DOSES:\n• Set phone alarms/reminders\n• Use our Adherence Tracker feature\n• Link to daily routine (meals, bedtime)\n• Use pill organizers\n• Keep medicines visible\n\n🚨 IF UNSURE:\n• Contact your pharmacist\n• Call your doctor\n• Don't guess - get professional advice\n\n⚠️ Some medicines (like blood thinners, heart medicines) require immediate medical consultation if missed"
    },
    {
      question: "Can I stop taking suddenly?",
      keywords: ["stop", "discontinue", "quit", "end", "stopping", "finish course"],
      response: "🛑 STOPPING MEDICINES:\n\n⚠️ CRITICAL: NEVER stop prescription medicines suddenly without consulting your doctor\n\nDANGERS OF SUDDEN STOPPING:\n• Withdrawal symptoms\n• Disease worsening\n• Rebound effects\n• Medical complications\n\nMEDICINES REQUIRING GRADUAL TAPERING:\n• Antidepressants (SSRIs, SNRIs)\n• Blood pressure medicines\n• Steroids (prednisone)\n• Anxiety/sleep medicines (benzodiazepines)\n• Seizure medicines\n\n✅ ANTIBIOTICS:\n• ALWAYS complete the full course\n• Even if you feel better\n• Prevents antibiotic resistance\n• Prevents infection return\n\n💡 SAFE APPROACH:\n• Discuss concerns with your doctor\n• Doctor will create tapering schedule if needed\n• Never stop because you 'feel better'\n• Follow medical advice\n\n🚨 If experiencing side effects, contact doctor immediately - don't just stop taking"
    }
  ]
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Welcome! I'm your AI Medicine Assistant.\n\nI provide EVIDENCE-BASED medicine information:\n\n✅ Food & alcohol interactions\n✅ Pregnancy & breastfeeding safety\n✅ Storage guidelines\n✅ Side effects information\n✅ General medicine safety\n\n⚠️ IMPORTANT DISCLAIMER:\nI provide general medical information only. I cannot diagnose, prescribe, or replace professional medical advice.\n\n👨‍⚕️ Always consult your doctor or pharmacist for:\n• Diagnosis\n• Treatment plans\n• Prescription changes\n• Medical emergencies\n\nHow can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Voice input
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  // Text-to-speech with better formatting
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
      
      // Clean text for speech - remove emojis and format properly
      const cleanText = text
        .replace(/[⚠️👋💊🔍✅❌🍽️🍺🤰🤱🏠📋💡🚨⏰🛑📞🏥🤔]/g, '') // Remove emojis
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '') // Remove asterisks
        .replace(/•/g, '') // Remove bullet points
        .replace(/\n\n+/g, '. ') // Replace multiple newlines with period
        .replace(/\n/g, ' ') // Replace single newlines with space
        .replace(/:/g, ',') // Replace colons with commas for better speech flow
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.85 // Slightly slower for medical info
      utterance.pitch = 1
      utterance.volume = 1
      utterance.lang = 'en-US'

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // AI Response Generator - Evidence-Based and Accurate
  const generateResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase().trim()

    // Check for greetings
    if (/^(hi|hello|hey|good morning|good evening|good afternoon|namaste|namaskar)/.test(messageLower)) {
      return "Hello! 👋\n\nI'm your AI Medicine Assistant. I provide evidence-based medicine information.\n\n⚠️ IMPORTANT: I provide general medical information only. For diagnosis, treatment, or prescription changes, please consult your healthcare provider.\n\nHow can I help you today?"
    }

    // Check for thanks
    if (/(thank|thanks|appreciate|helpful)/.test(messageLower)) {
      return "You're welcome! 😊\n\nRemember:\n• Always consult your healthcare provider for medical decisions\n• Keep all medicines out of reach of children\n• Check expiry dates regularly\n\nStay healthy and safe! Feel free to ask more questions."
    }

    // Check common questions - with better matching
    for (const qa of MEDICINE_KNOWLEDGE.commonQuestions) {
      if (qa.keywords.some(keyword => messageLower.includes(keyword))) {
        return qa.response + "\n\n💡 Use our Search feature to find specific information about your medicine."
      }
    }

    // Check for specific medicine names with detailed info
    const medicineNames = Object.keys(MEDICINE_KNOWLEDGE.medicines)
    for (const medicineName of medicineNames) {
      if (messageLower.includes(medicineName)) {
        const medicine = MEDICINE_KNOWLEDGE.medicines[medicineName]
        const info = medicine.info
        
        let response = `� ${medicine.name.toUpperCase()}\n\n`
        
        response += `🍽️ FOOD:\n${info.food}\n\n`
        response += `🍺 ALCOHOL:\n${info.alcohol}\n\n`
        response += `🤰 PREGNANCY:\n${info.pregnancy}\n\n`
        response += `🤱 BREASTFEEDING:\n${info.breastfeeding}\n\n`
        response += `🏠 STORAGE:\n${info.storage}\n\n`
        
        if (info.overdose) {
          response += `⚠️ OVERDOSE WARNING:\n${info.overdose}\n\n`
        }
        
        if (info.warnings) {
          response += `⚠️ WARNINGS:\n${info.warnings}\n\n`
        }
        
        response += `🚨 IMPORTANT REMINDER:\nThis is general information. Your doctor may have specific instructions for you. Always follow your doctor's advice and prescription label.`
        
        return response
      }
    }

    // Search for medicine-related queries
    if (/(tell me about|information about|info on|details of|what is)/.test(messageLower) && 
        /(medicine|drug|tablet|capsule|pill)/.test(messageLower)) {
      return "🔍 SEARCHING FOR MEDICINE INFORMATION:\n\n" +
             "For detailed, accurate information about specific medicines:\n\n" +
             "1️⃣ Use the SEARCH bar on home page\n" +
             "2️⃣ Type the medicine name\n" +
             "3️⃣ Get complete details:\n" +
             "   • Active ingredients\n" +
             "   • Uses and dosage\n" +
             "   • Side effects\n" +
             "   • Contraindications\n" +
             "   • Generic alternatives\n" +
             "   • Price comparison across 8 pharmacies\n\n" +
             "You can also ask me general questions like:\n" +
             "• 'Can I take paracetamol with food?'\n" +
             "• 'What are common side effects?'\n" +
             "• 'Is it safe during pregnancy?'\n\n" +
             "⚠️ For diagnosis or treatment advice, please consult your doctor."
    }

    // Dosage questions
    if (/(how much|dosage|dose|how many|quantity)/.test(messageLower)) {
      return "⚕️ DOSAGE INFORMATION:\n\n" +
             "⚠️ CRITICAL: I cannot provide specific dosage recommendations.\n\n" +
             "DOSAGE depends on:\n" +
             "• Your age, weight, and health condition\n" +
             "• Severity of illness\n" +
             "• Other medicines you're taking\n" +
             "• Kidney/liver function\n" +
             "• Your doctor's assessment\n\n" +
             "✅ WHAT TO DO:\n" +
             "1. Follow your prescription label exactly\n" +
             "2. Use our Dosage Calculator feature (if available)\n" +
             "3. Ask your pharmacist for clarification\n" +
             "4. Never adjust dose without consulting doctor\n\n" +
             "🚨 OVERDOSE WARNING:\n" +
             "Taking too much can be dangerous or fatal. If you suspect overdose, call emergency services immediately.\n\n" +
             "💡 Use our search feature to find standard dosage information for reference (actual dose must be prescribed by doctor)."
    }

    // Generic medicine query
    if (/(medicine|drug|tablet|capsule|syrup|pill|medication)/.test(messageLower)) {
      return "💊 MEDICINE INFORMATION:\n\n" +
             "I can help with evidence-based medicine information!\n\n" +
             "✅ AVAILABLE FEATURES:\n" +
             "🔍 Medicine Search - Detailed drug information\n" +
             "⚠️ Drug Interaction Checker - Check medicine combinations\n" +
             "📋 Prescription Upload - OCR analysis\n" +
             "💰 Price Comparison - 8 pharmacy platforms\n" +
             "📱 Adherence Tracker - Never miss a dose\n\n" +
             "❓ ASK ME:\n" +
             "• 'Can I take [medicine] with food?'\n" +
             "• 'What are side effects of [medicine]?'\n" +
             "• 'Is [medicine] safe during pregnancy?'\n" +
             "• 'Can I drink alcohol with medicines?'\n" +
             "• 'How should I store medicines?'\n\n" +
             "⚠️ DISCLAIMER: I provide general information only.\n" +
             "For medical advice, diagnosis, or treatment:\n" +
             "👨‍⚕️ Always consult your healthcare provider"
    }

    // Emergency or medical emergency
    if (/(emergency|urgent|severe|serious|help|poison|overdose|911|112|108)/.test(messageLower)) {
      return "🚨 MEDICAL EMERGENCY PROTOCOL:\n\n" +
             "⚠️ If this is a medical emergency:\n\n" +
             "� CALL IMMEDIATELY:\n" +
             "• India: 108 (Ambulance)\n" +
             "• India: 1066 (Poison Control)\n" +
             "• Your local emergency number\n\n" +
             "🏥 GO TO NEAREST HOSPITAL if:\n" +
             "• Difficulty breathing\n" +
             "• Chest pain\n" +
             "• Severe allergic reaction\n" +
             "• Suspected overdose\n" +
             "• Loss of consciousness\n" +
             "• Severe bleeding\n\n" +
             "⚠️ DO NOT wait for online advice in emergencies!\n\n" +
             "For non-emergency questions, I'm here to help with general medicine information."
    }

    // Default response - helpful and non-hallucinating
    return "🤔 I want to provide you with accurate information.\n\n" +
           "I can help with:\n" +
           "✅ General medicine safety (food, alcohol, pregnancy)\n" +
           "✅ Storage and handling guidelines\n" +
           "✅ When to consult a doctor\n" +
           "✅ Using MediLens features effectively\n\n" +
           "Please ask me about:\n" +
           "• Food/alcohol interactions\n" +
           "• Pregnancy/breastfeeding safety\n" +
           "• Medicine storage\n" +
           "• Missed doses\n" +
           "• General safety information\n\n" +
           "Or use these features:\n" +
           "🔍 Search - Find detailed medicine info\n" +
           "⚠️ Drug Checker - Check interactions\n" +
           "💰 Price Compare - Best pharmacy deals\n\n" +
           "⚠️ IMPORTANT:\n" +
           "I provide general information only. I cannot:\n" +
           "❌ Diagnose conditions\n" +
           "❌ Prescribe medicines\n" +
           "❌ Replace doctor consultation\n❌ Provide treatment plans\n\n" +
           "👨‍⚕️ Always consult your healthcare provider for medical advice."
  }

  const handleSend = () => {
    if (!inputText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateResponse(inputText),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick action buttons
  const quickActions = [
    "Can I take with food?",
    "What are side effects?",
    "Is it safe during pregnancy?",
    "Can I take with alcohol?"
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border-2 border-primary/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">AI Medicine Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything about medicines</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                      {message.text}
                    </div>
                    {message.type === 'bot' && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                        className="mt-2 text-xs text-primary dark:text-accent hover:underline flex items-center gap-1"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            Listen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none p-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(action)}
                      className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about medicines..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-primary to-purple-600 text-white p-2 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                ⚠️ AI provides general info. Consult doctor for medical advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
