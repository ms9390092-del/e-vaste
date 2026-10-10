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
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        const commaIndex = typeof result === 'string' ? result.indexOf(',') : -1
        resolve(commaIndex !== -1 ? result.slice(commaIndex + 1) : result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    return request('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        imageBase64: base64,
        fileName: file.name || 'image.jpg',
        contentType: file.type || 'image/jpeg'
      })
    })
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