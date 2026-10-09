import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

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
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        Limit: 100
      }))

      // Sort by createdAt descending
      const items = (result.Items || []).sort((a, b) =>
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

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newItem
      }))

      return {
        statusCode: 201,
        headers: corsHeaders(),
        body: JSON.stringify(newItem)
      }
    }

    // GET /items/:id - Get single item
    if (method === 'GET' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]

      const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }))

      if (!result.Item) {
        return {
          statusCode: 404,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(result.Item)
      }
    }

    // PATCH /items/:id - Update item
    if (method === 'PATCH' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]
      const updates = JSON.parse(event.body || '{}')

      // Only allow certain fields to be updated
      const allowedUpdates = ['status', 'notes']
      const updateExpressions = []
      const expressionAttributeNames = {}
      const expressionAttributeValues = {}

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          updateExpressions.push(`#${key} = :${key}`)
          expressionAttributeNames[`#${key}`] = key
          expressionAttributeValues[`:${key}`] = value
        }
      }

      if (updateExpressions.length === 0) {
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ error: 'No valid fields to update' })
        }
      }

      updateExpressions.push('#updatedAt = :updatedAt')
      expressionAttributeNames['#updatedAt'] = 'updatedAt'
      expressionAttributeValues[':updatedAt'] = new Date().toISOString()

      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: 'attribute_exists(id)'
      }))

      const result = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }))

      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(result.Item)
      }
    }

    // DELETE /items/:id - Delete item
    if (method === 'DELETE' && path.startsWith('/items/')) {
      const id = path.split('/items/')[1]

      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
        ConditionExpression: 'attribute_exists(id)'
      }))

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

    if (error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Item not found' })
      }
    }

    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Operation failed. Please try again.' })
    }
  }
}