import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const UploadSection = ({ onUploadComplete, isLoading, setIsLoading }) => {
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)

    // Upload to backend
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('📤 Uploading file to backend...')
      const response = await axios.post('http://localhost:8000/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log('📥 Backend response:', response.data)

      if (response.data.success && response.data.detected_medicines && response.data.detected_medicines.length > 0) {
        console.log(`✅ Found ${response.data.detected_medicines.length} medicines`)
        
        // Fetch detailed drug information
        const medicinePromises = response.data.detected_medicines.map(med =>
          axios.get(`http://localhost:8000/drugs?medicine_name=${encodeURIComponent(med)}`)
        )
        
        const results = await Promise.all(medicinePromises)
        const allResults = results
          .filter(r => r.data.success)
          .flatMap(r => r.data.results)

        console.log('📊 Detailed results:', allResults)

        if (allResults.length > 0) {
          onUploadComplete({
            medicines: allResults,
            raw_text: response.data.raw_text
          })
          toast.success(`Found ${allResults.length} medicine(s)!`)
        } else {
          toast.warning('Medicines detected but no details found. Try searching manually.')
        }
      } else {
        console.warn('⚠️ No medicines detected in image')
        toast.warning('No medicines detected. Try a clearer image with printed text.')
        
        // Show what was detected
        if (response.data.raw_text) {
          console.log('Raw OCR text:', response.data.raw_text)
        }
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      
      if (error.response) {
        // Backend responded with error
        const errorMsg = error.response.data?.detail || 'Server error occurred'
        toast.error(`Error: ${errorMsg}`)
        
        if (errorMsg.includes('Tesseract')) {
          toast.error('Tesseract OCR not installed! Check console for installation guide.')
        }
      } else if (error.request) {
        // No response from backend
        toast.error('Cannot connect to backend. Is it running on port 8000?')
        console.error('Backend not responding. Please start: python backend/main.py')
      } else {
        toast.error('Upload failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [onUploadComplete, setIsLoading])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    disabled: isLoading
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-3xl mx-auto mb-16"
    >
      <div
        {...getRootProps()}
        className={`glass-card p-12 border-2 border-dashed transition-all cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-105'
            : 'border-neutral-300 dark:border-neutral-600 hover:border-primary hover:shadow-xl'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="text-center">
            <Loader className="mx-auto mb-4 text-primary animate-spin" size={48} />
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-200">Processing prescription...</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">This may take a few seconds</p>
          </div>
        ) : preview ? (
          <div className="text-center">
            <img
              src={preview}
              alt="Prescription preview"
              className="max-h-64 mx-auto rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Click or drag to upload a different image
            </p>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Upload className="mx-auto mb-4 text-primary dark:text-accent" size={48} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 dark:text-neutral-100">Upload Prescription</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Drag & drop your prescription image here, or click to browse
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Supports: JPEG, PNG • Max size: 10MB
            </p>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default UploadSection
