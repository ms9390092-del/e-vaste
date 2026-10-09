import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Scan', href: '/scan' },
  { name: 'My E-Waste', href: '/my-ewaste' },
  { name: 'Disposal Guide', href: '/disposal-finder' },
]

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}>
        <nav className="container" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2" aria-label="E-Cycle Home">
              <svg className="w-8 h-8 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xl font-bold text-gray-900">E-Cycle</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-eco-50 text-eco-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/scan" className="btn-primary btn-sm ml-2">
                Scan an Item
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-100 animate-slide-down bg-white" role="navigation" aria-label="Mobile menu">
            <div className="flex flex-col gap-2 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-eco-50 text-eco-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/scan"
                onClick={closeMobileMenu}
                className="btn-primary text-center mt-2"
              >
                Scan an Item
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1" role="main">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2" aria-label="E-Cycle Home">
                <svg className="w-6 h-6 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-bold text-gray-900">E-Cycle</span>
              </Link>
              <p className="mt-3 text-sm text-gray-500">Know it. Handle it. Recycle it.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quick Links</h3>
              <ul className="mt-4 space-y-3">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-gray-600 hover:text-eco-600 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li><Link to="/guide" className="text-sm text-gray-600 hover:text-eco-600 transition-colors">Disposal Guides</Link></li>
                <li><Link to="/assistant" className="text-sm text-gray-600 hover:text-eco-600 transition-colors">Ask E-Cycle</Link></li>
                <li><Link to="/disposal-finder" className="text-sm text-gray-600 hover:text-eco-600 transition-colors">Find Disposal Options</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">About</h3>
              <p className="mt-4 text-sm text-gray-500 max-w-xs">
                Built for the Environmental Hacks hackathon. Helping you responsibly identify and dispose of electronic waste.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>E-Cycle - Environmental Hacks Hackathon Project</p>
          </div>
        </div>
      </footer>
    </div>
  )
}