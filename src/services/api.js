const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

export const api = {
  async analyzeImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Analysis failed')
    return data
  },

  async saveItem(item) {
    return request('/items', {
      method: 'POST',
      body: JSON.stringify(item)
    })
  },

  async getItems() {
    return request('/items')
  },

  async updateItem(id, updates) {
    return request(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  },

  async deleteItem(id) {
    return request(`/items/${id}`, {
      method: 'DELETE'
    })
  },

  async getDisposalOptions(itemType, location) {
    return request(`/disposal?type=${encodeURIComponent(itemType)}&location=${encodeURIComponent(location)}`)
  },

  async askAssistant(question) {
    return request('/assistant', {
      method: 'POST',
      body: JSON.stringify({ question })
    })
  }
}