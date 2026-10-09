import { useState } from 'react'
import { EWASTE_CATEGORIES } from '../data/ewaste'
import { api } from '../services/api'

const DisposalCard = ({ option }) => (
  <article className="card-hover p-6 animate-fade-in" role="listitem">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-eco-100 text-eco-600 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{option.name}</h3>
        <p className="text-body-sm text-gray-600 mt-1">{option.address}</p>
        {option.hours && <p className="text-sm text-gray-500 mt-1">Hours: {option.hours}</p>}
        {option.acceptedItems && (
          <p className="text-sm text-gray-500 mt-1">Accepts: {option.acceptedItems.join(', ')}</p>
        )}
        {option.phone && (
          <a href={`tel:${option.phone}`} className="link text-sm mt-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {option.phone}
          </a>
        )}
      </div>
    </div>
  </article>
)

const EmptyResults = ({ itemType, location }) => (
  <div className="card p-8 text-center border-2 border-dashed border-gray-200 animate-fade-in" role="status">
    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="heading-4 mb-2">No Verified Options Found</h3>
    <p className="text-body-sm text-gray-600 mb-4">
      No verified collection option available in the current dataset for <strong>{itemType}</strong> in <strong>{location}</strong>.
    </p>
    <p className="text-sm text-gray-500">
      This feature requires integration with a verified disposal location dataset or API.
      Consider checking with your local government waste management website or
      electronics retailers like Best Buy, Staples, or manufacturer take-back programs.
    </p>
  </div>
)

const ErrorAlert = ({ message }) => (
  <div className="card p-6 border-red-200 bg-red-50 animate-fade-in" role="alert">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-red-700">{message}</p>
    </div>
  </div>
)

const LoadingState = () => (
  <div className="card animate-fade-in">
    <div className="p-8 text-center">
      <div className="w-12 h-12 mx-auto mb-4 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin" />
      <p className="text-body-sm text-gray-600">Searching disposal options...</p>
    </div>
  </div>
)

const InfoCard = () => (
  <div className="card p-6 sm:p-8 border-t-4 border-eco-500 animate-fade-in" aria-labelledby="disclaimer-heading">
    <h2 id="disclaimer-heading" className="heading-4 mb-3">Data Sources & Limitations</h2>
    <div className="prose max-w-none text-sm text-gray-600">
      <p>This feature is designed to integrate with verified disposal location datasets such as:</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>Earth911 Recycling Search API</li>
        <li>Call2Recycle Drop-off Locator</li>
        <li>Local government open data portals</li>
        <li>Manufacturer take-back program APIs</li>
        <li>Certified recycler directories (R2, e-Stewards)</li>
      </ul>
      <p className="mt-4">Currently, no live API integration is configured. The feature structure is in place for future connection to authoritative data sources.
      <strong>Never invent collection center names, addresses, distances, or opening hours.</strong>
      If no verified data source is available, the application clearly indicates this limitation.</p>
    </div>
  </div>
)

const ImportantNotes = () => (
  <div className="card p-6 bg-gray-50 border border-gray-200 animate-fade-in">
    <p className="font-medium text-gray-900 mb-2">Important Notes:</p>
    <ul className="space-y-1 list-disc list-inside text-sm text-gray-600">
      <li>Always call ahead to verify acceptance and hours</li>
      <li>Remove personal data from devices before drop-off</li>
      <li>Some locations may charge fees for certain items</li>
      <li>Certified recyclers (R2, e-Stewards) are preferred</li>
    </ul>
  </div>
)

export default function DisposalFinder() {
  const [itemType, setItemType] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!itemType || !location) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const data = await api.getDisposalOptions(itemType, location)
      setResults(data)
    } catch (err) {
      setError('Unable to fetch disposal options. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 sm:py-12 max-w-3xl">
        <header className="mb-10 animate-fade-in">
          <h1 className="heading-2">Find Responsible Disposal Options</h1>
          <p className="mt-2 text-body">Enter your item type and location to find certified disposal options near you.</p>
        </header>

        <form onSubmit={handleSearch} className="card p-6 sm:p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="item-type" className="label">Item Type</label>
              <select
                id="item-type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="input"
                required
              >
                <option value="">Select item type...</option>
                {EWASTE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="label">City / Location</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input"
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </span>
            ) : (
              'Find Options'
            )}
          </button>
        </form>

        {error && <ErrorAlert message={error} />}

        {loading && <LoadingState />}

        {results && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="heading-3">Disposal Options</h2>

            {results.options && results.options.length > 0 ? (
              <div className="space-y-4" role="list">
                {results.options.map((option, idx) => (
                  <DisposalCard key={idx} option={option} />
                ))}
              </div>
            ) : (
              <EmptyResults itemType={itemType} location={location} />
            )}

            <ImportantNotes />
          </div>
        )}

        <InfoCard />
      </div>
    </div>
  )
}