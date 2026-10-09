import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION || 'us-east-1' })

const BUCKET_NAME = process.env.S3_BUCKET_NAME
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }
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

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64')

    // Generate unique key
    const timestamp = Date.now()
    const key = `uploads/${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      ServerSideEncryption: 'AES256'
    }))

    // Analyze with Rekognition
    const detectCommand = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Key: key
        }
      },
      MaxLabels: 20,
      MinConfidence: 50
    })

    const rekognitionResult = await rekognitionClient.send(detectCommand)

    // Clean up - delete from S3 after analysis (optional, can keep for records)
    // await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }))

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        labels: rekognitionResult.Labels?.map(label => ({
          Name: label.Name,
          Confidence: label.Confidence,
          Parents: label.Parents?.map(p => p.Name)
        })) || [],
        imageKey: key
      })
    }
  } catch (error) {
    console.error('Analysis error:', error)

    // Don't expose internal error details
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Image analysis failed. Please try again.' })
    }
  }
}