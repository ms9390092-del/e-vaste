import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Auto-detect local mode: if no AWS credentials, use local mocks
const hasAwsCredentials = !!(process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE || process.env.AWS_CONFIG_FILE)
const IS_LOCAL = !hasAwsCredentials || process.env.NODE_ENV !== 'production'

console.log(`[Startup] Running in ${IS_LOCAL ? 'LOCAL MOCK' : 'PRODUCTION'} mode`)

app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.raw({ type: 'application/octet-stream', limit: '15mb' }))

// Load handlers dynamically
let analyzeHandler, itemsHandler, disposalHandler, assistantHandler

async function loadHandlers() {
  if (IS_LOCAL) {
    const analyzeModule = await import('./functions/analyze-image.local.js')
    const itemsModule = await import('./functions/items.local.js')
    const disposalModule = await import('./functions/disposal-finder.js')
    const assistantModule = await import('./functions/assistant.js')
    analyzeHandler = analyzeModule.handler
    itemsHandler = itemsModule.handler
    disposalHandler = disposalModule.handler
    assistantHandler = assistantModule.handler
  } else {
    const analyzeModule = await import('./functions/analyze-image.js')
    const itemsModule = await import('./functions/items.js')
    const disposalModule = await import('./functions/disposal-finder.js')
    const assistantModule = await import('./functions/assistant.js')
    analyzeHandler = analyzeModule.handler
    itemsHandler = itemsModule.handler
    disposalHandler = disposalModule.handler
    assistantHandler = assistantModule.handler
  }
}

function createLambdaEvent(req, pathOverride = null) {
  const path = pathOverride || req.path
  const method = req.method

  return {
    httpMethod: method,
    path: path,
    queryStringParameters: req.query,
    headers: req.headers,
    body: method === 'GET' || method === 'DELETE' ? null : JSON.stringify(req.body),
    requestContext: {
      requestId: crypto.randomUUID()
    }
  }
}

function sendLambdaResponse(res, lambdaResult) {
  const headers = lambdaResult.headers || {}
  Object.entries(headers).forEach(([key, value]) => {
    res.set(key, value)
  })
  res.status(lambdaResult.statusCode).send(lambdaResult.body)
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const event = createLambdaEvent(req, '/analyze')
    const result = await analyzeHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Analyze error:', error)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

app.get('/api/items', async (req, res) => {
  try {
    const event = createLambdaEvent(req, '/items')
    const result = await itemsHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Get items error:', error)
    res.status(500).json({ error: 'Failed to get items' })
  }
})

app.post('/api/items', async (req, res) => {
  try {
    const event = createLambdaEvent(req, '/items')
    const result = await itemsHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Create item error:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

app.get('/api/items/:id', async (req, res) => {
  try {
    const event = createLambdaEvent(req, `/items/${req.params.id}`)
    const result = await itemsHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Get item error:', error)
    res.status(500).json({ error: 'Failed to get item' })
  }
})

app.patch('/api/items/:id', async (req, res) => {
  try {
    const event = createLambdaEvent(req, `/items/${req.params.id}`)
    const result = await itemsHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Update item error:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    const event = createLambdaEvent(req, `/items/${req.params.id}`)
    const result = await itemsHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Delete item error:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

app.get('/api/disposal', async (req, res) => {
  try {
    const event = createLambdaEvent(req, '/disposal')
    const result = await disposalHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Disposal finder error:', error)
    res.status(500).json({ error: 'Failed to find disposal options' })
  }
})

app.post('/api/assistant', async (req, res) => {
  try {
    const event = createLambdaEvent(req, '/assistant')
    const result = await assistantHandler(event)
    sendLambdaResponse(res, result)
  } catch (error) {
    console.error('Assistant error:', error)
    res.status(500).json({ error: 'Failed to process question' })
  }
})

await loadHandlers()

app.listen(PORT, () => {
  console.log(`E-Cycle backend running on http://localhost:${PORT} (${IS_LOCAL ? 'local mock' : 'production'})`)
})