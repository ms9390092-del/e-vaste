import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStoredItems, updateStoredItem, deleteStoredItem } from '../services/storage'
import { CATEGORY_GUIDANCE } from '../data/ewaste'

const statusColors = {
  'Saved': 'badge-success',
  'Needs Action': 'badge-warning',
  'Ready for Handover': 'badge-info',
  'Handled': 'badge-gray'
}

const statusOptions = [
  'Saved',
  'Needs Action',
  'Ready for Handover',
  'Handled'
]

const EmptyState = ({ title, description, actionLabel, actionHref }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8 max-w-md">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-eco-100 flex items-center justify-center">
        <svg className="w-12 h-12 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h1 className="heading-3 mb-2">{title}</h1>
      <p className="text-body-sm text-gray-600 mb-8">{description}</p>
      <Link to={actionHref} className="btn-primary">{actionLabel}</Link>
    </div>
  </div>
)

const ChecklistItem = ({ step, index, itemId, prefix }) => (
  <li key={index} className="flex items-start gap-3">
    <input
      type="checkbox"
      id={`${prefix}-${itemId}-${index}`}
      className="mt-1 w-5 h-5 text-eco-600 border-gray-300 rounded focus:ring-eco-500"
    />
    <label htmlFor={`${prefix}-${itemId}-${index}`} className="text-gray-700">{step}</label>
  </li>
)

const StepItem = ({ step, index, icon, iconColor = 'text-eco-600' }) => (
  <li key={index} className="flex items-start gap-3">
    <svg className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {icon}
    </svg>
    <span className="text-gray-700">{step}</span>
  </li>
)

export default function Result() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const items = getStoredItems()
  const item = items.find(i => i.id === itemId)
  const guidance = item ? CATEGORY_GUIDANCE[item.guidanceId] : null

  if (!item) {
    return (
      <EmptyState
        title="Item Not Found"
        description="This item may have been removed or the link is invalid."
        actionLabel="View My E-Waste"
        actionHref="/my-ewaste"
      />
    )
  }

  const handleStatusChange = (newStatus) => {
    updateStoredItem(itemId, { status: newStatus })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteStoredItem(itemId)
      navigate('/my-ewaste')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/scan" className="link inline-flex items-center gap-1 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Scan
            </Link>
            <h1 className="heading-2">Analysis Result</h1>
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
            aria-label="Delete item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card overflow-hidden animate-fade-in">
            <div className="relative aspect-square bg-gray-100">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={`Photo of ${item.categoryName}`}
                  className="w-full h-full object-cover"
                />
              )}
              {!item.imageUrl && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`${statusColors[item.status]} shadow-sm`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="heading-3">{item.categoryName}</h2>
              <p className="mt-1 text-body-sm text-gray-600">Identified on {new Date(item.timestamp).toLocaleDateString()}</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-eco-100 text-eco-600 flex items-center justify-center text-3xl" role="img" aria-label={item.categoryName}>
                  {guidance?.icon || '📱'}
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-Waste Classification</p>
                  <p className="text-xl font-bold text-eco-700">E-WASTE</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{item.confidence}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{item.categoryName}</p>
                </div>
              </div>
            </div>

            {guidance && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Why This Is E-Waste</h3>
                <p className="text-gray-600">{guidance.whyEwaste}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/guide/${item.guidanceId}`}
                className="btn-primary flex-1 text-center"
              >
                View Handling Guide
              </Link>
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input flex-1 sm:w-auto"
                aria-label="Update item status"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Link to="/scan" className="btn-ghost w-full sm:w-auto mx-auto block text-center">
              Scan Another Item
            </Link>
          </div>
        </div>

        {guidance && (
          <div className="mt-12 space-y-8">
            <section className="card p-6 sm:p-8 animate-fade-in" aria-labelledby="prep-heading">
              <h2 id="prep-heading" className="heading-4 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Before Handover Checklist
              </h2>
              <p className="text-body-sm text-gray-600 mb-4">
                Complete these steps before handing over your device. This checklist helps protect your data but does not guarantee secure deletion.
              </p>
              <ul className="space-y-3" role="list">
                {guidance.beforeHandover.map((step, idx) => (
                  <ChecklistItem step={step} index={idx} itemId={itemId} prefix="check" />
                ))}
              </ul>
            </section>

            <section className="card p-6 sm:p-8 animate-slide-up" aria-labelledby="handling-heading">
              <h2 id="handling-heading" className="heading-4 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommended Handling
              </h2>
              <ul className="space-y-3" role="list">
                {guidance.recommendedHandling.map((step, idx) => (
                  <StepItem
                    step={step}
                    index={idx}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  />
                ))}
              </ul>
            </section>

            <section className="card p-6 sm:p-8 border-l-4 border-red-500 animate-slide-up" aria-labelledby="avoid-heading">
              <h2 id="avoid-heading" className="heading-4 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Things to Avoid
              </h2>
              <ul className="space-y-3" role="list">
                {guidance.avoid.map((step, idx) => (
                  <StepItem
                    step={step}
                    index={idx}
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                    iconColor="text-red-600"
                  />
                ))}
              </ul>
            </section>

            {guidance.reuseNote && (
              <section className="card p-6 sm:p-8 bg-eco-50 border border-eco-200 animate-fade-in" aria-labelledby="reuse-heading">
                <h2 id="reuse-heading" className="heading-4 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reuse & Refurbishment Note
                </h2>
                <p className="text-gray-700">{guidance.reuseNote}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}