import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle, X, Plus, Trash2, Shield, AlertCircle } from 'lucide-react'

const DrugInteractionChecker = ({ currentMedicines = [] }) => {
  const [medicines, setMedicines] = useState(currentMedicines)
  const [newMedicine, setNewMedicine] = useState('')
  const [interactions, setInteractions] = useState([])
  const [showWarning, setShowWarning] = useState(false)

  // Enhanced interaction database with real-world drug interactions
  const interactionDatabase = {
    // Cardiovascular
    'aspirin-warfarin': {
      severity: 'critical',
      description: 'Increased bleeding risk',
      recommendation: 'Consult doctor immediately. Requires close monitoring of INR levels.',
      effects: ['Increased bleeding', 'Bruising', 'Nosebleeds'],
    },
    'aspirin-ibuprofen': {
      severity: 'moderate',
      description: 'Reduced cardiovascular protection',
      recommendation: 'Space doses 2-4 hours apart or use alternative pain relievers.',
      effects: ['Decreased aspirin effectiveness', 'GI bleeding risk'],
    },
    'metoprolol-diltiazem': {
      severity: 'critical',
      description: 'Severe bradycardia and hypotension',
      recommendation: 'Avoid combination. Consult cardiologist.',
      effects: ['Very slow heart rate', 'Low blood pressure', 'Dizziness'],
    },
    
    // Antibiotics
    'amoxicillin-warfarin': {
      severity: 'moderate',
      description: 'Enhanced anticoagulant effect',
      recommendation: 'Monitor INR closely during and after antibiotic therapy.',
      effects: ['Increased bleeding risk', 'Bruising'],
    },
    'ciprofloxacin-antacids': {
      severity: 'moderate',
      description: 'Reduced antibiotic absorption',
      recommendation: 'Take ciprofloxacin 2 hours before or 6 hours after antacids.',
      effects: ['Reduced effectiveness', 'Treatment failure'],
    },
    'azithromycin-hydroxychloroquine': {
      severity: 'critical',
      description: 'QT prolongation - heart rhythm issues',
      recommendation: 'Avoid combination. Risk of life-threatening arrhythmia.',
      effects: ['Irregular heartbeat', 'Sudden cardiac death'],
    },

    // Diabetes
    'metformin-alcohol': {
      severity: 'moderate',
      description: 'Increased lactic acidosis risk',
      recommendation: 'Limit alcohol consumption. Avoid binge drinking.',
      effects: ['Lactic acidosis', 'Low blood sugar', 'Nausea'],
    },
    'insulin-beta-blockers': {
      severity: 'moderate',
      description: 'Masked hypoglycemia symptoms',
      recommendation: 'Monitor blood sugar more frequently. Beta-blockers can hide low sugar symptoms.',
      effects: ['Unrecognized low blood sugar', 'Prolonged hypoglycemia'],
    },

    // Antidepressants
    'fluoxetine-tramadol': {
      severity: 'critical',
      description: 'Serotonin syndrome risk',
      recommendation: 'Avoid combination. Use alternative pain medication.',
      effects: ['Confusion', 'Rapid heart rate', 'High blood pressure', 'Fever'],
    },
    'ssri-nsaid': {
      severity: 'moderate',
      description: 'Increased GI bleeding risk',
      recommendation: 'Consider gastroprotective agent (PPI). Monitor for bleeding.',
      effects: ['Stomach ulcers', 'GI bleeding', 'Abdominal pain'],
    },

    // Pain relievers
    'tramadol-ondansetron': {
      severity: 'moderate',
      description: 'Reduced pain relief',
      recommendation: 'Use alternative anti-nausea medication if possible.',
      effects: ['Decreased tramadol effectiveness'],
    },
    'acetaminophen-alcohol': {
      severity: 'critical',
      description: 'Severe liver damage risk',
      recommendation: 'Avoid alcohol when taking acetaminophen. Limit to occasional use only.',
      effects: ['Liver toxicity', 'Acute liver failure'],
    },

    // Statins
    'atorvastatin-grapefruit': {
      severity: 'moderate',
      description: 'Increased statin blood levels',
      recommendation: 'Avoid grapefruit juice. Can increase side effects.',
      effects: ['Muscle pain', 'Rhabdomyolysis', 'Liver damage'],
    },
    'simvastatin-clarithromycin': {
      severity: 'critical',
      description: 'Severe muscle breakdown risk',
      recommendation: 'Avoid combination. Suspend statin during antibiotic course.',
      effects: ['Muscle pain', 'Rhabdomyolysis', 'Kidney failure'],
    },

    // Blood pressure
    'lisinopril-potassium': {
      severity: 'moderate',
      description: 'Hyperkalemia risk',
      recommendation: 'Monitor potassium levels. Limit high-potassium foods.',
      effects: ['High potassium', 'Irregular heartbeat', 'Weakness'],
    },
    'amlodipine-simvastatin': {
      severity: 'moderate',
      description: 'Increased statin levels',
      recommendation: 'Limit simvastatin to 20mg daily when combined with amlodipine.',
      effects: ['Muscle pain', 'Weakness'],
    },

    // Anticoagulants
    'warfarin-vitamin-k': {
      severity: 'moderate',
      description: 'Reduced anticoagulant effect',
      recommendation: 'Maintain consistent vitamin K intake. Monitor INR.',
      effects: ['Decreased warfarin effectiveness', 'Blood clot risk'],
    },
    'apixaban-aspirin': {
      severity: 'moderate',
      description: 'Increased bleeding risk',
      recommendation: 'Combination should only be used if medically necessary.',
      effects: ['Bleeding', 'Bruising', 'Blood in urine/stool'],
    },

    // Common OTC + Prescription
    'omeprazole-clopidogrel': {
      severity: 'moderate',
      description: 'Reduced clopidogrel effectiveness',
      recommendation: 'Use alternative PPI (pantoprazole) or H2 blocker.',
      effects: ['Increased cardiovascular events', 'Blood clot risk'],
    },
    'prednisone-nsaid': {
      severity: 'moderate',
      description: 'Severe GI bleeding risk',
      recommendation: 'Avoid NSAIDs. Use acetaminophen for pain if needed.',
      effects: ['Stomach ulcers', 'GI bleeding', 'Perforation'],
    },

    // Herbal interactions
    'st-johns-wort-oral-contraceptives': {
      severity: 'critical',
      description: 'Reduced contraceptive effectiveness',
      recommendation: 'Use backup contraception. Consider alternative antidepressant.',
      effects: ['Unwanted pregnancy', 'Breakthrough bleeding'],
    },
  }

  // Check for interactions whenever medicines list changes
  useEffect(() => {
    checkInteractions()
  }, [medicines])

  const checkInteractions = () => {
    const foundInteractions = []
    const normalizedMeds = medicines.map(m => m.toLowerCase().trim())

    // Check all pair combinations
    for (let i = 0; i < normalizedMeds.length; i++) {
      for (let j = i + 1; j < normalizedMeds.length; j++) {
        const med1 = normalizedMeds[i]
        const med2 = normalizedMeds[j]
        
        // Check both orderings
        const key1 = `${med1}-${med2}`
        const key2 = `${med2}-${med1}`
        
        if (interactionDatabase[key1]) {
          foundInteractions.push({
            medicines: [medicines[i], medicines[j]],
            ...interactionDatabase[key1],
          })
        } else if (interactionDatabase[key2]) {
          foundInteractions.push({
            medicines: [medicines[i], medicines[j]],
            ...interactionDatabase[key2],
          })
        }

        // Check for partial matches (e.g., "ibuprofen" in "ibuprofen 200mg")
        Object.keys(interactionDatabase).forEach(key => {
          const [drug1, drug2] = key.split('-')
          if ((med1.includes(drug1) && med2.includes(drug2)) || 
              (med1.includes(drug2) && med2.includes(drug1))) {
            const existing = foundInteractions.find(
              int => int.medicines[0] === medicines[i] && int.medicines[1] === medicines[j]
            )
            if (!existing) {
              foundInteractions.push({
                medicines: [medicines[i], medicines[j]],
                ...interactionDatabase[key],
              })
            }
          }
        })
      }
    }

    setInteractions(foundInteractions)
    setShowWarning(foundInteractions.some(int => int.severity === 'critical'))
  }

  const addMedicine = () => {
    if (newMedicine.trim() && !medicines.includes(newMedicine.trim())) {
      setMedicines([...medicines, newMedicine.trim()])
      setNewMedicine('')
    }
  }

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-700 dark:text-yellow-300'
      case 'minor':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={24} className="text-red-500" />
      case 'moderate':
        return <AlertCircle size={24} className="text-yellow-500" />
      case 'minor':
        return <Info size={24} className="text-blue-500" />
      default:
        return <CheckCircle size={24} className="text-green-500" />
    }
  }

  const criticalCount = interactions.filter(int => int.severity === 'critical').length
  const moderateCount = interactions.filter(int => int.severity === 'moderate').length
  const minorCount = interactions.filter(int => int.severity === 'minor').length

  return (
    <div className="space-y-6">
      {/* Header with Shield Icon */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Drug Interaction Checker</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Check for potential interactions between your medications
        </p>
      </motion.div>

      {/* Critical Warning Banner */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-red-700 dark:text-red-300 mb-1">
                  Critical Interaction Detected!
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Your medication list contains potentially dangerous drug interactions. 
                  Please consult your healthcare provider immediately.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Medicine Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Your Medications</h3>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newMedicine}
            onChange={(e) => setNewMedicine(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMedicine()}
            placeholder="Enter medicine name..."
            className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
          />
          <button
            onClick={addMedicine}
            className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add</span>
          </button>
        </div>

        {/* Medicine List */}
        <div className="space-y-2">
          {medicines.length === 0 ? (
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
              No medicines added yet. Add medicines to check for interactions.
            </p>
          ) : (
            medicines.map((medicine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 dark:bg-neutral-700/30"
              >
                <span className="font-medium">{medicine}</span>
                <button
                  onClick={() => removeMedicine(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Interaction Summary */}
      {medicines.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <div className="glass-card p-4 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-500">{criticalCount}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Critical Interactions</div>
          </div>
          <div className="glass-card p-4 border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-500">{moderateCount}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Moderate Interactions</div>
          </div>
          <div className="glass-card p-4 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-500">{minorCount}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Minor Interactions</div>
          </div>
        </motion.div>
      )}

      {/* Detailed Interactions */}
      {interactions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Detected Interactions</h3>
          
          {interactions.map((interaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`glass-card p-6 border-l-4 ${getSeverityColor(interaction.severity)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getSeverityIcon(interaction.severity)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">
                      {interaction.medicines.join(' + ')}
                    </h4>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-white dark:bg-neutral-800">
                      {interaction.severity}
                    </span>
                  </div>
                  
                  <p className="font-semibold mb-2">{interaction.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Recommendation: </span>
                      <span>{interaction.recommendation}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Possible Effects: </span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {interaction.effects.map((effect, idx) => (
                          <li key={idx}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : medicines.length >= 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-12 text-center border-2 border-green-500"
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
            No Known Interactions Detected
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Your current medication list doesn't show any known interactions in our database.
            However, always consult your healthcare provider about your medications.
          </p>
        </motion.div>
      ) : null}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700"
      >
        <div className="flex items-start space-x-3">
          <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Medical Disclaimer:</strong> This tool provides general information about drug interactions 
            and should not be used as a substitute for professional medical advice. Always consult your healthcare 
            provider or pharmacist about potential drug interactions before starting or stopping any medication.
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DrugInteractionChecker
