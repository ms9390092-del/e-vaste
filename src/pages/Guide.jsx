import { useParams, Link } from 'react-router-dom'
import { EWASTE_CATEGORIES } from '../data/ewaste'
import { CATEGORY_GUIDANCE } from '../data/ewaste'

const GuidanceSection = ({ title, icon, iconColor, children, className = '', idSuffix = '' }) => (
  <section className={`card p-6 sm:p-8 animate-fade-in ${className}`} aria-labelledby={title.toLowerCase().replace(/\s+/g, '-') + idSuffix}>
    <h2 id={title.toLowerCase().replace(/\s+/g, '-') + idSuffix} className="heading-4 mb-4 flex items-center gap-2">
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

const ChecklistList = ({ steps, category }) => (
  <ul className="space-y-3" role="list">
    {steps.map((step, idx) => (
      <li key={idx} className="flex items-start gap-3">
        <input
          type="checkbox"
          id={`guide-check-${category}-${idx}`}
          className="mt-1 w-5 h-5 text-eco-600 border-gray-300 rounded focus:ring-eco-500"
        />
        <label htmlFor={`guide-check-${category}-${idx}`} className="text-gray-700">{step}</label>
      </li>
    ))}
  </ul>
)

const EmptyState = ({ title, description, actionLabel, actionHref }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8 animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-eco-100 flex items-center justify-center">
        <svg className="w-12 h-12 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="heading-3 mb-2">{title}</h1>
      <p className="text-body-sm text-gray-600 mb-8">{description}</p>
      <Link to={actionHref} className="btn-primary">{actionLabel}</Link>
    </div>
  </div>
)

export default function Guide() {
  const { category } = useParams()
  const categoryData = EWASTE_CATEGORIES.find(c => c.id === category)
  const guidance = category ? CATEGORY_GUIDANCE[category] : null

  if (!guidance) {
    return (
      <EmptyState
        title="Guide Not Found"
        description="The requested disposal guide could not be found."
        actionLabel="Browse All Guides"
        actionHref="/disposal-finder"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12 max-w-3xl">
        <Link
          to="/disposal-finder"
          className="link inline-flex items-center gap-1 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Guides
        </Link>

        <header className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-100 text-eco-700 text-sm font-medium mb-4">
            <span role="img" aria-label={guidance.title} className="text-2xl">{categoryData?.icon || '📱'}</span>
            E-Waste Guide
          </div>
          <h1 className="heading-2 mb-2">{guidance.title}</h1>
          <p className="text-body">{guidance.description}</p>
        </header>

        <div className="space-y-8">
          <GuidanceSection
            title="Why This Is E-Waste"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            iconColor="text-eco-600"
          >
            <p className="text-gray-600">{guidance.whyEwaste}</p>
          </GuidanceSection>

          <GuidanceSection
            title="Before Handover Checklist"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            iconColor="text-eco-600"
          >
            <p className="text-body-sm text-gray-600 mb-4">
              Complete these steps before handing over your device. This checklist helps protect your data but does not guarantee secure deletion.
            </p>
            <ChecklistList steps={guidance.beforeHandover} category={category} />
          </GuidanceSection>

          <GuidanceSection
            title="Recommended Responsible Handling"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            iconColor="text-eco-600"
          >
            <StepList
              steps={guidance.recommendedHandling}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
            />
          </GuidanceSection>

          <GuidanceSection
            title="Things to Avoid"
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
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

          <div className="text-center pt-4 animate-fade-in">
            <Link to="/scan" className="btn-primary">
              Scan an Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}