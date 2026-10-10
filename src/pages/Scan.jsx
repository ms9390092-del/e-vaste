import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { classifyItem } from '../utils/classification'
import { api } from '../services/api'
import { addStoredItem } from '../services/storage'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const DropZone = ({ onDrop, onDragOver, onDragLeave, onClick, children, isActive, isDragActive, className = '' }) => (
  <div
    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
      isDragActive
        ? 'border-eco-500 bg-eco-50 scale-[1.01] shadow-lg'
        : isActive
        ? 'border-eco-500 bg-eco-50'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    } ${className}`}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    aria-label="Drop zone for image upload"
  >
    {children}
  </div>
)

const ProgressRing = ({ progress, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg className="w-full h-full text-eco-600" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        className="opacity-25"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        className="opacity-75 transform -rotate-90 transition-all duration-300 ease-out"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transitionDelay: '0ms' }}
      />
    </svg>
  )
}

const SkeletonCard = () => (
  <div className="card animate-fade-in">
    <div className="p-8 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="skeleton w-full h-full rounded-full" />
      </div>
      <div className="skeleton h-6 w-48 mx-auto mb-3" />
      <div className="skeleton h-4 w-64 mx-auto mb-6" />
      <div className="skeleton h-2 w-64 mx-auto rounded-full" />
    </div>
  </div>
)

export default function Scan() {
  const navigate = useNavigate()
  const [state, setState] = useState('idle') // idle, selected, uploading, analyzing, success, low-confidence, error
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const progressIntervalRef = useRef(null)

  const validateFile = useCallback((f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP, HEIC)'
    }
    if (f.size > MAX_SIZE) {
      return 'File size must be less than 10MB'
    }
    return null
  }, [])

  const handleFileSelect = useCallback((f) => {
    const err = validateFile(f)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setState('selected')
  }, [validateFile])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const removeImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setState('idle')
    setError(null)
    setResult(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [previewUrl])

  const analyzeImage = async () => {
    if (!file) return

    setState('uploading')
    setProgress(0)
    setError(null)

    try {
      // Simulate upload progress
      progressIntervalRef.current = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90))
      }, 100)

      let analysisResult

      try {
        analysisResult = await api.analyzeImage(file)
      } catch (apiError) {
        // Fallback to mock analysis for demo
        console.warn('API unavailable, using mock analysis:', apiError)
        analysisResult = getMockAnalysis(file.name)
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setProgress(95)
      setState('analyzing')

      // Small delay to show analyzing state
      await new Promise(resolve => setTimeout(resolve, 500))

      // Classify the detected labels
      const classification = classifyItem(analysisResult.labels || [])

      const itemResult = {
        ...classification,
        imageUrl: previewUrl,
        imageName: file.name,
        timestamp: new Date().toISOString(),
        labels: analysisResult.labels || [],
        guidanceId: classification.categoryId
      }

      setResult(itemResult)

      if (classification.confidence < 60) {
        setState('low-confidence')
      } else {
        setState('success')
      }
      setProgress(100)
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setError(err.message || 'Analysis failed. Please try again.')
      setState('error')
    }
  }

  const getMockAnalysis = (fileName) => {
    const lowerName = (fileName || '').toLowerCase()

    if (lowerName.includes('laptop') || lowerName.includes('macbook')) {
      return { labels: [
        { Name: 'Laptop', Confidence: 96 },
        { Name: 'Computer', Confidence: 91 },
        { Name: 'Electronics', Confidence: 88 },
        { Name: 'Keyboard', Confidence: 72 },
        { Name: 'Screen', Confidence: 85 }
      ]}
    }
    if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
      return { labels: [
        { Name: 'Tablet', Confidence: 93 },
        { Name: 'Electronics', Confidence: 87 },
        { Name: 'Touchscreen', Confidence: 82 },
        { Name: 'Mobile Device', Confidence: 79 }
      ]}
    }
    if (lowerName.includes('monitor') || lowerName.includes('screen')) {
      return { labels: [
        { Name: 'Monitor', Confidence: 95 },
        { Name: 'Display', Confidence: 90 },
        { Name: 'Computer Monitor', Confidence: 88 },
        { Name: 'Electronics', Confidence: 82 }
      ]}
    }
    if (lowerName.includes('charger') || lowerName.includes('adapter')) {
      return { labels: [
        { Name: 'Power Adapter', Confidence: 89 },
        { Name: 'Charger', Confidence: 85 },
        { Name: 'Electronics', Confidence: 80 },
        { Name: 'Cable', Confidence: 70 }
      ]}
    }
    if (lowerName.includes('headphone') || lowerName.includes('earphone') || lowerName.includes('earbud') || lowerName.includes('airpod')) {
      return { labels: [
        { Name: 'Headphones', Confidence: 91 },
        { Name: 'Earphones', Confidence: 87 },
        { Name: 'Electronics', Confidence: 82 },
        { Name: 'Audio Equipment', Confidence: 76 }
      ]}
    }
    if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('iphone') || lowerName.includes('android') || lowerName.includes('smartphone')) {
      return { labels: [
        { Name: 'Cell Phone', Confidence: 94 },
        { Name: 'Electronics', Confidence: 89 },
        { Name: 'Mobile Phone', Confidence: 92 },
        { Name: 'Screen', Confidence: 78 },
        { Name: 'Display', Confidence: 75 }
      ]}
    }
    if (lowerName.includes('battery') || lowerName.includes('powerbank') || lowerName.includes('power-bank')) {
      return { labels: [
        { Name: 'Battery', Confidence: 90 },
        { Name: 'Power Bank', Confidence: 85 },
        { Name: 'Electronics', Confidence: 80 }
      ]}
    }
    if (lowerName.includes('camera') || lowerName.includes('webcam') || lowerName.includes('dslr')) {
      return { labels: [
        { Name: 'Camera', Confidence: 92 },
        { Name: 'Electronics', Confidence: 88 },
        { Name: 'Lens', Confidence: 75 }
      ]}
    }
    if (lowerName.includes('printer') || lowerName.includes('scanner')) {
      return { labels: [
        { Name: 'Printer', Confidence: 91 },
        { Name: 'Electronics', Confidence: 85 },
        { Name: 'Office Equipment', Confidence: 78 }
      ]}
    }
    if (lowerName.includes('keyboard')) {
      return { labels: [
        { Name: 'Keyboard', Confidence: 94 },
        { Name: 'Electronics', Confidence: 88 },
        { Name: 'Computer Accessory', Confidence: 82 }
      ]}
    }
    if (lowerName.includes('mouse') || lowerName.includes('trackpad')) {
      return { labels: [
        { Name: 'Mouse', Confidence: 93 },
        { Name: 'Electronics', Confidence: 87 },
        { Name: 'Computer Accessory', Confidence: 80 }
      ]}
    }
    if (lowerName.includes('cable') || lowerName.includes('cord') || lowerName.includes('usb') || lowerName.includes('hdmi')) {
      return { labels: [
        { Name: 'Cable', Confidence: 90 },
        { Name: 'Electronics', Confidence: 85 },
        { Name: 'Wire', Confidence: 78 }
      ]}
    }

    // Default for unrecognized filenames (e.g. IMG_2041.jpg): generic electronics
    return { labels: [
      { Name: 'Electronics', Confidence: 85 },
      { Name: 'Electronic Device', Confidence: 80 },
      { Name: 'Gadget', Confidence: 72 }
    ]}
  }

  const handleSave = () => {
    if (!result) return
    const saved = addStoredItem({
      ...result,
      status: 'Saved'
    })
    navigate(`/result/${saved.id}`)
  }

  const handleManual = () => {
    navigate('/manual')
  }

  const handleRetry = () => {
    setState('selected')
    setError(null)
    setResult(null)
    setProgress(0)
  }

  const renderIdleState = () => (
    <DropZone onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
        disabled={state !== 'idle' && state !== 'selected' && state !== 'error'}
        aria-label="Choose image file"
      />
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="mt-4 text-lg text-gray-600">Drag & drop an image here, or click to select</p>
      <p className="mt-1 text-sm text-gray-500">JPEG, PNG, WebP, HEIC · Max 10MB</p>
      <button onClick={() => fileInputRef.current?.click()} className="mt-6 btn-primary">
        Choose File
      </button>
    </DropZone>
  )

  const renderSelectedState = () => (
    <>
      <div className="relative w-full max-w-md mx-auto mb-6">
        <img
          src={previewUrl}
          alt="Preview of selected image"
          className="w-full h-auto max-h-64 rounded-xl shadow-lg object-contain animate-fade-in"
        />
        <button
          onClick={removeImage}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Remove image"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary w-full sm:w-auto"
        >
          Change Image
        </button>
        <button
          onClick={analyzeImage}
          className="btn-primary w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Analyze Item
        </button>
      </div>
    </>
  )

  const renderProgressState = () => (
    <div className="card animate-fade-in">
      <div className="p-8 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <ProgressRing progress={progress} size={80} strokeWidth={6} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-eco-600">{progress}%</span>
          </div>
        </div>
        <h2 className="heading-4 mb-2">
          {state === 'uploading' ? 'Uploading Image...' : 'Analyzing Image...'}
        </h2>
        <p className="text-body-sm mb-6">This usually takes a few seconds</p>
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-eco-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Analysis progress"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderResultState = () => (
    <div className="card animate-slide-up">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="heading-4">
              {state === 'low-confidence' ? 'Low Confidence Result' : 'Item Identified'}
            </h2>
            <p className="text-body-sm text-gray-600">
              {state === 'low-confidence'
                ? 'Could not confidently identify this item'
                : `Likely: ${result.categoryName}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium text-gray-900">{result.categoryName}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="font-medium text-gray-900">{result.confidence}%</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            Save to My E-Waste
          </button>
          <button
            onClick={() => navigate(`/guide/${result.guidanceId}`)}
            className="btn-secondary flex-1"
          >
            View Handling Guide
          </button>
          <button
            onClick={() => {
              removeImage()
              setState('idle')
            }}
            className="btn-ghost flex-1"
          >
            Scan Another
          </button>
        </div>

        {state === 'low-confidence' && (
          <button
            onClick={handleManual}
            className="mt-4 w-full btn-secondary"
          >
            Identify Manually Instead
          </button>
        )}

        <details className="mt-6">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">Detected labels</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.labels.slice(0, 10).map((label, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {label.Name} ({Math.round(label.Confidence)}%)
              </span>
            ))}
          </div>
        </details>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="card animate-fade-in">
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="heading-4 mb-2">Analysis Failed</h2>
        <p className="text-body-sm text-gray-600 mb-6">{error || 'An unexpected error occurred'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleRetry} className="btn-primary">Try Again</button>
          <button onClick={handleManual} className="btn-secondary">Identify Manually</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="heading-2">Scan an Item</h1>
          <p className="mt-2 text-body-sm">Upload a photo of your electronic device for smart identification</p>
        </div>

        <div className="space-y-6">
          {state === 'idle' && <div className="card"><div className="p-6 sm:p-8">{renderIdleState()}</div></div>}

          {state === 'selected' && (
            <div className="card">
              <div className="p-6 sm:p-8">
                {renderSelectedState()}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {(state === 'uploading' || state === 'analyzing') && renderProgressState()}

          {(state === 'success' || state === 'low-confidence') && result && renderResultState()}

          {state === 'error' && renderErrorState()}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">Not sure what you have?</p>
          <button onClick={handleManual} className="mt-2 text-eco-600 hover:text-eco-700 font-medium inline-flex items-center gap-1">
            Identify Manually
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}