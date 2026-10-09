import { useState, useRef, useEffect } from 'react'
import { CATEGORY_GUIDANCE } from '../data/ewaste'
import { api } from '../services/api'

const SUGGESTED_QUESTIONS = [
  "What should I do with an old charger?",
  "Is my old laptop e-waste?",
  "What should I prepare before handing over a phone?",
  "How do I recycle a broken monitor?",
  "Can I throw batteries in the trash?",
  "Where can I recycle electronics near me?"
]

const GREETING = "Hi! I'm the E-Cycle Assistant. Ask me anything about e-waste identification, handling, or disposal. I'll use the app's guidance data to answer."

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user'
  return (
    <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] ${isUser ? 'bg-eco-600 text-white rounded-2xl rounded-tr-md' : 'bg-white text-gray-900 shadow-sm rounded-2xl rounded-tl-md'} border ${!isUser ? 'border-gray-100' : ''}`}>
        <div className="p-4">
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={`whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-700'}`}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const SuggestionChip = ({ question, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-eco-300 hover:text-eco-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eco-500"
  >
    {question}
  </button>
)

const TypingIndicator = () => (
  <div className="flex justify-start animate-fade-in">
    <div className="bg-white text-gray-900 shadow-sm rounded-2xl rounded-tl-md p-4 border border-gray-100">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-eco-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
)

const findRelevantGuidance = (question) => {
  const lowerQ = question.toLowerCase()
  const keywords = {
    'mobile-phone': ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'cell'],
    'laptop': ['laptop', 'notebook', 'macbook', 'computer'],
    'tablet': ['tablet', 'ipad'],
    'monitor': ['monitor', 'display', 'screen'],
    'keyboard': ['keyboard'],
    'mouse': ['mouse', 'trackpad'],
    'charger': ['charger', 'adapter', 'power brick', 'charging'],
    'cable': ['cable', 'cord', 'wire', 'usb', 'hdmi'],
    'earphones': ['earphone', 'earbud', 'airpod', 'headphone', 'headset'],
    'printer': ['printer', 'scanner'],
    'camera': ['camera', 'dslr', 'webcam'],
    'battery': ['battery', 'power bank', 'button cell'],
  }

  for (const [catId, kws] of Object.entries(keywords)) {
    if (kws.some(kw => lowerQ.includes(kw))) {
      return CATEGORY_GUIDANCE[catId]
    }
  }
  return null
}

const generateResponse = (question) => {
  const lowerQ = question.toLowerCase()
  const guidance = findRelevantGuidance(question)

  if (guidance) {
    let response = `Based on the **${guidance.title}** guide:\n\n`

    if (lowerQ.includes('what should i do') || lowerQ.includes('how do i') || lowerQ.includes('recycle') || lowerQ.includes('dispose')) {
      response += "**Recommended Handling:**\n"
      guidance.recommendedHandling.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('prepare') || lowerQ.includes('handover') || lowerQ.includes('data') || lowerQ.includes('backup')) {
      response += "**Before Handover Checklist:**\n"
      guidance.beforeHandover.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('avoid') || lowerQ.includes('not') || lowerQ.includes('don\'t')) {
      response += "**Things to Avoid:**\n"
      guidance.avoid.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('reuse') || lowerQ.includes('refurbish') || lowerQ.includes('sell') || lowerQ.includes('donate')) {
      response += `**Reuse Note:** ${guidance.reuseNote}\n\n`
    }

    if (!lowerQ.includes('what should') && !lowerQ.includes('how') && !lowerQ.includes('prepare') && !lowerQ.includes('avoid') && !lowerQ.includes('reuse')) {
      response += `**What it is:** ${guidance.description}\n\n`
      response += `**Why it's e-waste:** ${guidance.whyEwaste}\n\n`
      response += "**Quick Summary:**\n"
      response += `• ${guidance.recommendedHandling[0]}\n`
      response += `• ${guidance.beforeHandover[0]}\n`
      response += `• ${guidance.avoid[0]}\n`
    }

    return response
  }

  // General responses
  if (lowerQ.includes('what is e-waste') || lowerQ.includes('define e-waste')) {
    return "E-waste (electronic waste) refers to discarded electrical or electronic devices. This includes phones, computers, TVs, appliances, and any device with a plug or battery. E-waste contains hazardous materials like lead, mercury, and flame retardants, plus valuable recoverable materials like gold, copper, and rare earth elements."
  }

  if (lowerQ.includes('battery') && (lowerQ.includes('trash') || lowerQ.includes('throw'))) {
    return "**Never throw batteries in the trash.** Batteries pose fire risks in waste trucks and facilities, and contain toxic materials. Take them to dedicated battery recycling locations (Call2Recycle bins at retailers, household hazardous waste facilities, or auto parts stores for lead-acid batteries)."
  }

  if (lowerQ.includes('data') && (lowerQ.includes('secure') || lowerQ.includes('delete') || lowerQ.includes('wipe'))) {
    return "For data security:\n1. Back up important files\n2. Sign out of all accounts\n3. Use secure erase tools (not quick format) for drives\n4. For highly sensitive data, consider physical drive destruction\n\n**Note:** This checklist helps protect your data but does not guarantee secure deletion. For certified data destruction, use professional ITAD services."
  }

  if (lowerQ.includes('near me') || lowerQ.includes('where') || lowerQ.includes('location') || lowerQ.includes('find')) {
    return "I can't access live location data. For finding disposal options near you:\n• Use the **Disposal Finder** feature in this app (requires verified data source)\n• Check Earth911.com or Call2Recycle.org\n• Visit your local government waste management website\n• Check retailer programs (Best Buy, Staples, Home Depot)\n• Contact manufacturer take-back programs directly"
  }

  return "I can help with questions about specific e-waste categories like phones, laptops, batteries, chargers, monitors, etc. Try asking:\n• \"What should I do with an old [item]?\"\n• \"How do I prepare a [item] for recycling?\"\n• \"Is [item] considered e-waste?\"\n\nFor location-specific or regulation-specific information, please verify with official/local sources."
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setLoading(true)

    try {
      // Try API first
      let response
      try {
        const data = await api.askAssistant(userMessage)
        response = data.answer
      } catch {
        // Fallback to local logic
        response = generateResponse(userMessage)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (question) => {
    setInput(question)
    handleSend({ preventDefault: () => {} })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container py-4">
          <h1 className="heading-3 flex items-center gap-2">
            <svg className="w-7 h-7 text-eco-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask E-Cycle
          </h1>
          <p className="text-body-sm text-gray-500 mt-1">Get answers about e-waste handling and disposal</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, idx) => (
            <MessageBubble message={msg} index={idx} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="mt-8 animate-fade-in" role="region" aria-label="Suggested questions">
            <p className="text-sm text-gray-500 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <SuggestionChip
                  key={idx}
                  question={q}
                  onClick={() => handleSuggestion(q)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100">
        <div className="container py-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about e-waste..."
              className="input flex-1"
              disabled={loading}
              aria-label="Ask a question"
            />
            <button
              type="submit"
              className="btn-primary p-3"
              disabled={loading || !input.trim()}
              aria-label={loading ? 'Sending...' : 'Send message'}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-3 max-w-xl mx-auto">
            Answers based on app guidance data. For location-specific or regulation-specific information,
            verify with official/local sources. This assistant does not hallucinate collection centers, laws,
            certifications, or exact environmental statistics.
          </p>
        </div>
      </footer>
    </div>
  )
}