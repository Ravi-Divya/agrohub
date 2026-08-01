import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY ?? '' })

export const GROQ_MODEL = process.env.GROQ_MODEL ?? 'qwen/qwen3.6-27b'
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

function getVisionModel() {
  if (process.env.GROQ_API_KEY) {
    return groq(GROQ_MODEL)
  }
  return openai(OPENAI_MODEL)
}

export const DISEASE_SCHEMA = z.object({
  disease: z.string().describe('The name of the identified crop disease'),
  confidence: z
    .string()
    .describe('Confidence level: High, Medium, or Low'),
  symptoms: z.string().describe('Description of disease symptoms visible in the image'),
  prevention: z.string().describe('Prevention methods for this disease'),
  treatment: z.string().describe('Treatment recommendations for this disease'),
})

export const PEST_SCHEMA = z.object({
  pest: z.string().describe('The name of the identified pest'),
  confidence: z
    .string()
    .describe('Confidence level: High, Medium, or Low'),
  symptoms: z.string().describe('Damage symptoms caused by this pest'),
  control: z.string().describe('Recommended control and management methods'),
})

export interface AnalysisResult {
  object: Record<string, unknown>
}

export function hasApiKey(): boolean {
  return Boolean(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY)
}

function validateDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(dataUrl)
  if (!match) {
    throw new Error('INVALID_FORMAT')
  }
  const [, mimeType, base64] = match
  if (!base64 || base64.length < 32) {
    throw new Error('INVALID_FORMAT')
  }
  if (base64.length > 6 * 1024 * 1024) {
    throw new Error('PAYLOAD_TOO_LARGE')
  }
  const decoded = Buffer.from(base64, 'base64')
  if (decoded.length < 32) {
    throw new Error('INVALID_BASE64')
  }
  return { mimeType, data: base64 }
}

function parseJsonResponse(text: string, schema: z.ZodType): Record<string, unknown> {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('INVALID_AI_RESPONSE')
  }
  const json = cleaned.slice(start, end + 1)
  const parsed = JSON.parse(json)
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new Error('INVALID_AI_RESPONSE')
  }
  return result.data as Record<string, unknown>
}

async function analyzeImage(
  imageDataUrl: string,
  schema: z.ZodType,
  prompt: string
): Promise<AnalysisResult> {
  const { mimeType, data } = validateDataUrl(imageDataUrl)
  if (!hasApiKey()) {
    throw new Error('NO_API_KEY')
  }
  const result = await generateText({
    model: getVisionModel(),
    messages: [
      {
        role: 'user' as const,
        content: [
          { type: 'file' as const, data, mediaType: mimeType },
          {
            type: 'text' as const,
            text: prompt,
          },
        ],
      },
    ],
  })
  return { object: parseJsonResponse(result.text, schema) }
}

export async function analyzeDiseaseImage(imageDataUrl: string): Promise<AnalysisResult> {
  return analyzeImage(
    imageDataUrl,
    DISEASE_SCHEMA,
    `You are an expert agricultural pathologist. Analyze this crop/leaf image and identify any diseases present.
Provide:
1. The specific disease name
2. Your confidence level (High, Medium, Low)
3. Visible symptoms you observe
4. Prevention methods
5. Treatment recommendations

If no disease is clearly visible, describe the most likely causes of any visible damage or stress.
Respond with ONLY a valid JSON object (no markdown, no extra text) with exactly these keys: disease, confidence, symptoms, prevention, treatment.`
  )
}

export async function analyzePestImage(imageDataUrl: string): Promise<AnalysisResult> {
  return analyzeImage(
    imageDataUrl,
    PEST_SCHEMA,
    `You are an expert agricultural entomologist. Analyze this crop image and identify any pests present.
Provide:
1. The specific pest name
2. Your confidence level (High, Medium, Low)
3. Damage symptoms caused by this pest
4. Recommended control and management methods

If no pest is clearly visible, describe the most likely causes of any visible damage.
Respond with ONLY a valid JSON object (no markdown, no extra text) with exactly these keys: pest, confidence, symptoms, control.`
  )
}
