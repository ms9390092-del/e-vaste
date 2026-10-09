import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoredItems, updateStoredItem, deleteStoredItem } from '../services/storage'
import { CATEGORY_GUIDANCE } from '../data/ewaste'

const statusBadges = {
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
    <div className="text-center p-8 max-w-md animate-fade-in">
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

const ItemCard = ({ item, guidance, isExpanded, onToggleExpand, onView, onStatusChange, onDelete, statusOptions }) => (
  <article
    className="card-hover animate-fade-in"
    role="listitem"
  >
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-eco-100 text-eco-600 flex items-center justify-center text-3xl flex-shrink-0" role="img" aria-label={item.categoryName}>
          {guidance?.icon || '📱'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{item.categoryName}</h2>
              <p className="text-sm text-gray-500">Added {new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <span className={`${statusBadges[item.status]} shadow-sm flex-shrink-0`}>
              {item.status}
            </span>
          </div>

          {isExpanded && (
            <div id={`expand-${item.id}`} className="mt-4 pt-4 border-t border-gray-100 animate-slide-down">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Confidence</p>
                  <p className="font-medium text-gray-900">{item.confidence}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Detected Labels</p>
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {item.detectedLabels?.slice(0, 3).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onView(item.id)}
                  className="btn-secondary btn-sm flex-1 sm:flex-none"
                >
                  View Details
                </button>
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className="input input-sm flex-1 sm:flex-none py-2"
                  aria-label="Update status"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => onDelete(item.id)}
                  className="btn-ghost btn-sm text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onToggleExpand(item.id)}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 flex-shrink-0 transition-colors"
          aria-expanded={isExpanded}
          aria-controls={`expand-${item.id}`}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  </article>
)

export default function MyEwaste() {
  const navigate = useNavigate()
  const [items, setItems] = useState(() => getStoredItems())
  const [expandedId, setExpandedId] = useState(null)

  const refreshItems = () => {
    setItems(getStoredItems())
  }

  const handleStatusChange = (id, newStatus) => {
    updateStoredItem(id, { status: newStatus })
    refreshItems()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteStoredItem(id)
      refreshItems()
    }
  }

  const handleView = (id) => {
    navigate(`/result/${id}`)
  }

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No E-Waste Items Yet"
        description="Start by scanning or manually identifying an electronic item to add it to your list."
        actionLabel="Scan Your First Item"
        actionHref="/scan"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="heading-2">My E-Waste</h1>
            <p className="mt-1 text-body-sm">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Link to="/scan" className="btn-primary w-full sm:w-auto">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Add Item
          </Link>
        </div>

        <div className="space-y-4" role="list" aria-label="Saved e-waste items">
          {items.map((item, index) => {
            const guidance = item.guidanceId ? CATEGORY_GUIDANCE[item.guidanceId] : null
            const isExpanded = expandedId === item.id

            return (
              <ItemCard
                key={item.id}
                item={item}
                guidance={guidance}
                isExpanded={isExpanded}
                onToggleExpand={handleToggleExpand}
                onView={handleView}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                statusOptions={statusOptions}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}