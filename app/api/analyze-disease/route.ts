import { NextRequest, NextResponse } from 'next/server'
import { analyzeDiseaseImage } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BODY_BYTES = 7 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('content-length')) {
      const contentLength = Number(request.headers.get('content-length'))
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return NextResponse.json(
          { error: 'Payload too large. Max upload size is 6MB.' },
          { status: 413 }
        )
      }
    }

    let body: { image?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const result = await analyzeDiseaseImage(body.image)

    return NextResponse.json({ method: 'image', ...result.object })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN'

    if (message === 'NO_API_KEY') {
      return NextResponse.json(
        {
          error:
            'AI analysis is not configured. Set OPENAI_API_KEY in the server environment.',
        },
        { status: 503 }
      )
    }
    if (message === 'INVALID_FORMAT' || message === 'INVALID_BASE64') {
      return NextResponse.json({ error: 'Invalid or unsupported image data' }, { status: 400 })
    }
    if (message === 'PAYLOAD_TOO_LARGE') {
      return NextResponse.json(
        { error: 'Image too large. Please upload a smaller image (max 6MB).' },
        { status: 413 }
      )
    }

    console.error('Disease analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}
