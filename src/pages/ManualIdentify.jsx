import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MANUAL_CATEGORIES, getManualCategory } from '../utils/classification'
import { addStoredItem } from '../services/storage'
import { CATEGORY_GUIDANCE } from '../data/ewaste'

const CategoryCard = ({ category, isSelected, onSelect, onViewGuide, onSave }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(category.id)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(category.id)
      }
    }}
    className={`card-hover p-6 text-left transition-all relative overflow-hidden cursor-pointer ${
      isSelected
        ? 'ring-2 ring-eco-500 bg-eco-50 border-eco-200'
        : ''
    }`}
    aria-pressed={isSelected}
  >
    <div className="flex items-center gap-4">
      <span className="text-4xl" role="img" aria-label={category.name}>{category.icon}</span>
      <div>
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-500">E-Waste</p>
      </div>
    </div>
    {isSelected && (
      <div className="absolute inset-0 bg-eco-50/50 pointer-events-none" aria-hidden="true" />
    )}
    {isSelected && (
      <div className="mt-4 pt-4 border-t border-eco-200 flex gap-2 relative z-10 animate-slide-up">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onViewGuide(category.id)
          }}
          className="btn-secondary btn-sm flex-1"
        >
          View Guide
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSave(category.id)
          }}
          className="btn-primary btn-sm flex-1"
        >
          Save Item
        </button>
      </div>
    )}
  </div>
)

const GuidanceSection = ({ title, icon, iconColor, children, className = '' }) => (
  <section className={`card p-6 sm:p-8 ${className}`} aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
    <h2 id={title.toLowerCase().replace(/\s+/g, '-')} className="heading-4 mb-4 flex items-center gap-2">
      <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {icon}
      </svg>
      {title}
    </h2>
    {children}
  </section>
)

const StepList = ({ steps, icon, iconColor = 'text-eco-600' }) => (
  <ul className="space-y-3" role="list">
    {steps.map((step, idx) => (
      <li key={idx} className="flex items-start gap-3">
        <svg className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {icon}
        </svg>
        <span className="text-gray-700">{step}</span>
      </li>
    ))}
  </ul>
)

const ChecklistList = ({ steps, itemId, prefix }) => (
  <ul className="space-y-3" role="list">
    {steps.map((step, idx) => (
      <li key={idx} className="flex items-start gap-3">
        <input
          type="checkbox"
          id={`${prefix}-${itemId}-${idx}`}
          className="mt-1 w-5 h-5 text-eco-600 border-gray-300 rounded focus:ring-eco-500"
        />
        <label htmlFor={`${prefix}-${itemId}-${idx}`} className="text-gray-700">{step}</label>
      </li>
    ))}
  </ul>
)

export default function ManualIdentify() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showGuidance, setShowGuidance] = useState(false)

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setShowGuidance(false)
  }

  const handleSave = (catId) => {
    const idToUse = catId || selectedCategory
    if (!idToUse) return

    const category = getManualCategory(idToUse)
    const saved = addStoredItem({
      categoryId: category.id,
      categoryName: category.name,
      isEwaste: true,
      confidence: 100,
      detectedLabels: [category.name],
      timestamp: new Date().toISOString(),
      guidanceId: category.id,
      status: 'Saved'
    })

    navigate(`/result/${saved.id}`)
  }

  const handleViewGuide = (catId) => {
    const idToUse = catId || selectedCategory
    if (idToUse) {
      if (catId && catId !== selectedCategory) {
        setSelectedCategory(catId)
      }
      setShowGuidance(true)
    }
  }

  const guidance = selectedCategory ? CATEGORY_GUIDANCE[selectedCategory] : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="heading-2">Identify Manually</h1>
          <p className="mt-2 text-body-sm">Select the type of electronic item you have</p>
        </div>

        {!showGuidance ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MANUAL_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={handleCategorySelect}
                onViewGuide={handleViewGuide}
                onSave={handleSave}
              />
            ))}
          </div>
        ) : (
          <div className="card animate-slide-up max-w-3xl mx-auto">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowGuidance(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Back to categories"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="heading-3">{guidance.title}</h2>
                    <p className="text-body-sm text-gray-600">E-Waste Item</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Save to My E-Waste
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <GuidanceSection
                  title="About This Item"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  iconColor="text-eco-600"
                >
                  <p className="text-gray-600">{guidance.description}</p>
                </GuidanceSection>

                <GuidanceSection
                  title="Why It's E-Waste"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  iconColor="text-eco-600"
                >
                  <p className="text-gray-600">{guidance.whyEwaste}</p>
                </GuidanceSection>

                <GuidanceSection
                  title="Before Handover Checklist"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  iconColor="text-eco-600"
                >
                  <p className="text-gray-600 text-sm mb-4">
                    Complete these steps before handing over your device. This checklist helps protect your data but does not guarantee secure deletion.
                  </p>
                  <ChecklistList steps={guidance.beforeHandover} itemId={selectedCategory} prefix="manual-check" />
                </GuidanceSection>

                <GuidanceSection
                  title="Recommended Handling"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  iconColor="text-eco-600"
                >
                  <StepList steps={guidance.recommendedHandling} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />} />
                </GuidanceSection>

                <GuidanceSection
                  title="Things to Avoid"
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                  iconColor="text-red-600"
                  className="border-l-4 border-red-500"
                >
                  <StepList
                    steps={guidance.avoid}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                    iconColor="text-red-600"
                  />
                </GuidanceSection>

                {guidance.reuseNote && (
                  <GuidanceSection
                    title="Reuse & Refurbishment Note"
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                    iconColor="text-eco-600"
                    className="bg-eco-50 border border-eco-200"
                  >
                    <p className="text-gray-700">{guidance.reuseNote}</p>
                  </GuidanceSection>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}