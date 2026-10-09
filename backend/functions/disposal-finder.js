import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)

const TABLE_NAME = process.env.DISPOSAL_TABLE_NAME || 'ecycle-disposal-locations'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  }
}

const MOCK_DISPOSAL_DATA = [
  {
    id: 'loc-1',
    name: 'Best Buy Electronics Recycling',
    address: '123 Main St, San Francisco, CA 94102',
    hours: 'Mon-Sat 10am-9pm, Sun 11am-7pm',
    acceptedItems: ['Mobile Phone', 'Laptop', 'Tablet', 'Charger', 'Cable', 'Headphones', 'Camera'],
    phone: '415-555-0100',
    city: 'San Francisco',
    state: 'CA',
    certified: true,
    certification: 'R2'
  },
  {
    id: 'loc-2',
    name: 'San Francisco Household Hazardous Waste Facility',
    address: '501 Tunnel Ave, San Francisco, CA 94134',
    hours: 'Thu-Sat 8am-4pm',
    acceptedItems: ['Battery', 'Mobile Phone', 'Laptop', 'Monitor', 'Printer', 'Charger', 'Cable'],
    phone: '415-555-0200',
    city: 'San Francisco',
    state: 'CA',
    certified: true,
    certification: 'Government'
  },
  {
    id: 'loc-3',
    name: 'Staples Electronics Recycling',
    address: '456 Market St, San Francisco, CA 94103',
    hours: 'Mon-Fri 8am-9pm, Sat 9am-9pm, Sun 10am-6pm',
    acceptedItems: ['Laptop', 'Monitor', 'Printer', 'Charger', 'Cable', 'Keyboard', 'Mouse'],
    phone: '415-555-0300',
    city: 'San Francisco',
    state: 'CA',
    certified: true,
    certification: 'R2'
  },
  {
    id: 'loc-4',
    name: 'Apple Store Trade-In',
    address: '1 Stockton St, San Francisco, CA 94108',
    hours: 'Mon-Sat 10am-8pm, Sun 11am-7pm',
    acceptedItems: ['Mobile Phone', 'Laptop', 'Tablet', 'Charger', 'Headphones', 'Camera'],
    phone: '415-555-0400',
    city: 'San Francisco',
    state: 'CA',
    certified: true,
    certification: 'Manufacturer'
  },
  {
    id: 'loc-5',
    name: 'Goodwill Electronics Recycling',
    address: '789 Mission St, San Francisco, CA 94103',
    hours: 'Mon-Sat 9am-8pm, Sun 10am-6pm',
    acceptedItems: ['Mobile Phone', 'Laptop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Charger', 'Cable'],
    phone: '415-555-0500',
    city: 'San Francisco',
    state: 'CA',
    certified: false
  }
]

async function queryDynamoDB(itemType, location) {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'contains(#city, :city) AND contains(#acceptedItems, :itemType)',
      ExpressionAttributeNames: {
        '#city': 'city',
        '#acceptedItems': 'acceptedItems'
      },
      ExpressionAttributeValues: {
        ':city': location.split(',')[0].trim(),
        ':itemType': itemType
      }
    }))
    return result.Items || []
  } catch (error) {
    console.warn('DynamoDB query failed, using mock data:', error.message)
    return []
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const queryParams = event.queryStringParameters || {}
  const itemType = queryParams.type
  const location = queryParams.location

  if (!itemType || !location) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Missing required parameters: type, location' })
    }
  }

  try {
    // Try to query DynamoDB first
    let locations = await queryDynamoDB(itemType, location)

    // Fallback to mock data if DynamoDB is empty or unavailable
    if (locations.length === 0) {
      const cityName = location.split(',')[0].trim().toLowerCase()
      locations = MOCK_DISPOSAL_DATA.filter(loc =>
        loc.city.toLowerCase().includes(cityName) &&
        loc.acceptedItems.includes(itemType)
      )
    }

    // If still no results, return empty with clear message
    if (locations.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          options: [],
          message: 'No verified collection option available in the current dataset.',
          note: 'This feature requires integration with a verified disposal location dataset or API. Consider checking Earth911.com, Call2Recycle.org, or your local government waste management website.'
        })
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        options: locations.map(loc => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
          hours: loc.hours,
          acceptedItems: loc.acceptedItems,
          phone: loc.phone,
          certified: loc.certified,
          certification: loc.certification
        }))
      })
    }
  } catch (error) {
    console.error('Disposal finder error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Failed to find disposal options. Please try again.' })
    }
  }
}