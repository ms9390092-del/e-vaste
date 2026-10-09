const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }
}

function getMockLabels(fileName) {
  const lowerName = fileName.toLowerCase()

  if (lowerName.includes('laptop') || lowerName.includes('macbook')) {
    return [
      { Name: 'Laptop', Confidence: 96 },
      { Name: 'Computer', Confidence: 91 },
      { Name: 'Electronics', Confidence: 88 },
      { Name: 'Keyboard', Confidence: 72 },
      { Name: 'Screen', Confidence: 85 }
    ]
  }
  if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
    return [
      { Name: 'Tablet', Confidence: 93 },
      { Name: 'Electronics', Confidence: 87 },
      { Name: 'Touchscreen', Confidence: 82 },
      { Name: 'Mobile Device', Confidence: 79 }
    ]
  }
  if (lowerName.includes('monitor') || lowerName.includes('screen')) {
    return [
      { Name: 'Monitor', Confidence: 95 },
      { Name: 'Display', Confidence: 90 },
      { Name: 'Computer Monitor', Confidence: 88 },
      { Name: 'Electronics', Confidence: 82 }
    ]
  }
  if (lowerName.includes('charger') || lowerName.includes('adapter')) {
    return [
      { Name: 'Power Adapter', Confidence: 89 },
      { Name: 'Charger', Confidence: 85 },
      { Name: 'Electronics', Confidence: 80 },
      { Name: 'Cable', Confidence: 70 }
    ]
  }
  if (lowerName.includes('headphone') || lowerName.includes('earphone') || lowerName.includes('earbud') || lowerName.includes('airpod')) {
    return [
      { Name: 'Headphones', Confidence: 91 },
      { Name: 'Earphones', Confidence: 87 },
      { Name: 'Electronics', Confidence: 82 },
      { Name: 'Audio Equipment', Confidence: 76 }
    ]
  }
  if (lowerName.includes('phone') || lowerName.includes('mobile') || lowerName.includes('iphone') || lowerName.includes('android') || lowerName.includes('smartphone')) {
    return [
      { Name: 'Cell Phone', Confidence: 94 },
      { Name: 'Electronics', Confidence: 89 },
      { Name: 'Mobile Phone', Confidence: 92 },
      { Name: 'Screen', Confidence: 78 },
      { Name: 'Display', Confidence: 75 }
    ]
  }
  if (lowerName.includes('battery') || lowerName.includes('powerbank') || lowerName.includes('power-bank')) {
    return [
      { Name: 'Battery', Confidence: 90 },
      { Name: 'Power Bank', Confidence: 85 },
      { Name: 'Electronics', Confidence: 80 }
    ]
  }
  if (lowerName.includes('camera') || lowerName.includes('webcam') || lowerName.includes('dslr')) {
    return [
      { Name: 'Camera', Confidence: 92 },
      { Name: 'Electronics', Confidence: 88 },
      { Name: 'Lens', Confidence: 75 }
    ]
  }
  if (lowerName.includes('printer') || lowerName.includes('scanner')) {
    return [
      { Name: 'Printer', Confidence: 91 },
      { Name: 'Electronics', Confidence: 85 },
      { Name: 'Office Equipment', Confidence: 78 }
    ]
  }
  if (lowerName.includes('keyboard')) {
    return [
      { Name: 'Keyboard', Confidence: 94 },
      { Name: 'Electronics', Confidence: 88 },
      { Name: 'Computer Accessory', Confidence: 82 }
    ]
  }
  if (lowerName.includes('mouse') || lowerName.includes('trackpad')) {
    return [
      { Name: 'Mouse', Confidence: 93 },
      { Name: 'Electronics', Confidence: 87 },
      { Name: 'Computer Accessory', Confidence: 80 }
    ]
  }
  if (lowerName.includes('cable') || lowerName.includes('cord') || lowerName.includes('usb') || lowerName.includes('hdmi')) {
    return [
      { Name: 'Cable', Confidence: 90 },
      { Name: 'Electronics', Confidence: 85 },
      { Name: 'Wire', Confidence: 78 }
    ]
  }

  // Default: generic electronics
  return [
    { Name: 'Electronics', Confidence: 85 },
    { Name: 'Electronic Device', Confidence: 80 },
    { Name: 'Gadget', Confidence: 72 }
  ]
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { imageBase64, fileName, contentType } = body

    if (!imageBase64 || !fileName || !contentType) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required fields: imageBase64, fileName, contentType' })
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
    if (!allowedTypes.includes(contentType)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, HEIC' })
      }
    }

    // Validate file size (base64 is ~33% larger)
    const maxBase64Size = 10 * 1024 * 1024 * 1.33 // ~13.3MB base64
    if (imageBase64.length > maxBase64Size) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'File too large. Max 10MB.' })
      }
    }

    // Local mock analysis - returns labels based on filename
    const labels = getMockLabels(fileName).map(label => ({
      Name: label.Name,
      Confidence: label.Confidence,
      Parents: []
    }))

    const timestamp = Date.now()
    const key = `uploads/${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    console.log(`[LOCAL MOCK] Analyzed image: ${fileName} -> labels:`, labels.map(l => l.Name).join(', '))

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        labels,
        imageKey: key
      })
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Image analysis failed. Please try again.' })
    }
  }
}