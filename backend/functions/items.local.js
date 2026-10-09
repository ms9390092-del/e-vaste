const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

// In-memory storage for local development
const mockItems = new Map()

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }
}

function generateId() {
  return crypto.randomUUID()
}

function validateItem(item) {
  const required = ['categoryId', 'categoryName', 'isEwaste', 'confidence', 'detectedLabels', 'guidanceId']
  for (const field of required) {
    if (item[field] === undefined || item[field] === null) {
      return `Missing required field: ${field}`
    }
  }
  return null
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' }
  }

  const path = event.path || ''
  const method = event.httpMethod

  try {
    // GET /items - List all items
    if (method === 'GET' && path === '/items') {
      // Sort by createdAt descending
      const items = Array.from(mockItems.values()).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      )

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ items })
      }
    }

    // POST /items - Create new item
    if (method === 'POST' && path === '/items') {
      const item = JSON.parse(event.body || '{}')

      const validationError = validateItem(item)
      if (validationError) {
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ error: validationError })
        }
      }

      const newItem = {
        id: generateId(),
        ...item,
        status: item.status || 'Saved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockItems.set(newItem.id, newItem)

      return {
        statusCode: 201,
        headers: corsHeaders(),
        body: JSON.stringify(newItem)
      }
    }

    // GET /items/:id - Get single item
    if (method === 'GET' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]
      const item = mockItems.get(id)

      if (!item) {
        return {
          statusCode: 404,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(item)
      }
    }

    // PATCH /items/:id - Update item
    if (method === 'PATCH' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]
      const updates = JSON.parse(event.body || '{}')

      if (!mockItems.has(id)) {
        return {
          statusCode: 404,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      // Only allow certain fields to be updated
      const allowedUpdates = ['status', 'notes']
      const item = mockItems.get(id)

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          item[key] = value
        }
      }

      item.updatedAt = new Date().toISOString()
      mockItems.set(id, item)

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(item)
      }
    }

    // DELETE /items/:id - Delete item
    if (method === 'DELETE' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]

      if (!mockItems.has(id)) {
        return {
          statusCode: 404,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      mockItems.delete(id)

      return {
        statusCode: 204,
        headers: corsHeaders(),
        body: ''
      }
    }

    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Not found' })
    }
  } catch (error) {
    console.error('Items API error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Operation failed. Please try again.' })
    }
  }
}