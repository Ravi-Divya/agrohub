'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Radio,
  UploadCloud,
  X,
  CheckCircle2,
  Camera,
  ScanLine,
} from 'lucide-react'
import CameraStream from './camera-stream'
import { extractVideoFrame, imageToJpeg } from '@/lib/media'
import { cn } from '@/lib/utils'

type Tab = 'image' | 'video' | 'livestream'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 200 * 1024 * 1024

const tabs: { id: Tab; icon: typeof ImageIcon; label: string; hint: string }[] = [
  { id: 'image', icon: ImageIcon, label: 'Image', hint: 'Photo of the affected crop' },
  { id: 'video', icon: Video, label: 'Video', hint: 'Walkthrough of your crop' },
  { id: 'livestream', icon: Radio, label: 'Live Stream', hint: 'Scan in real time' },
]

interface DiseaseResult {
  disease?: string
  confidence?: string
  symptoms?: string
  prevention?: string
  treatment?: string
}

export default function DiseaseDetector() {
  const [activeTab, setActiveTab] = useState<Tab>('image')
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [analysisImage, setAnalysisImage] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setPreview(null)
    setFileName('')
    setAnalysisImage(null)
    setError('')
    setResult(null)
  }, [])

  useEffect(() => {
    const handleLivestreamCapture = (event: Event) => {
      const customEvent = event as CustomEvent<{ imageData: string; fileName: string }>
      setPreview(customEvent.detail.imageData)
      setFileName(customEvent.detail.fileName)
      setAnalysisImage(customEvent.detail.imageData)
      setIsVideo(false)
      setError('')
      setResult(null)
    }
    window.addEventListener('livestreamCapture', handleLivestreamCapture)
    return () => window.removeEventListener('livestreamCapture', handleLivestreamCapture)
  }, [])

  const handleFile = async (file: File) => {
    if (!file) return
    setError('')

    const isImageFile = file.type.startsWith('image/')
    const isVideoFile = file.type.startsWith('video/')

    if (!isImageFile && !isVideoFile) {
      setError('Unsupported file type. Please upload an image or video.')
      return
    }

    if (isImageFile && file.size > MAX_IMAGE_SIZE) {
      setError('Image size must be less than 10MB')
      return
    }
    if (isVideoFile && file.size > MAX_VIDEO_SIZE) {
      setError('Video size must be less than 200MB')
      return
    }

    if (activeTab === 'video') {
      setPreview(URL.createObjectURL(file))
      setIsVideo(true)
      setFileName(file.name)
      setResult(null)
      try {
        setLoading(true)
        const frame = await extractVideoFrame(file, 1)
        setAnalysisImage(frame.dataUrl)
      } catch {
        setError('Could not read this video. Try a different file.')
        setAnalysisImage(null)
      } finally {
        setLoading(false)
      }
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsVideo(false)
    setFileName(file.name)
    setResult(null)

    try {
      setLoading(true)
      const jpeg = await imageToJpeg(file)
      setAnalysisImage(jpeg)
    } catch {
      setAnalysisImage(null)
      setError('Could not read this image. Try a different file.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const analyze = async () => {
    if (!analysisImage) {
      setError('Please upload a file first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/analyze-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: analysisImage, type: activeTab }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to analyze')
      }
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analyzing file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                reset()
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition sm:p-5',
                isActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span
                className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {tab.label}
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">{tab.hint}</span>
            </button>
          )
        })}
      </div>

      {/* Image / Video upload */}
      {(activeTab === 'image' || activeTab === 'video') && (
        <div className="space-y-6">
          {!preview ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition',
                dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-primary/[0.03]'
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                {activeTab === 'video' ? (
                  <Video className="h-8 w-8 text-primary" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-primary" />
                )}
              </div>
              <p className="mt-5 font-heading text-lg font-semibold">
                Click to upload or drag and drop
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {activeTab === 'video'
                  ? 'MP4, MOV, WebM — up to 200MB. We analyze a frame for you.'
                  : 'JPG, PNG, WebP — up to 10MB'}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Choose {activeTab === 'video' ? 'video' : 'image'}
              </span>
              <input
                ref={inputRef}
                type="file"
                accept={activeTab === 'video' ? 'video/*' : 'image/*'}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative">
                {isVideo ? (
                  <video src={preview} controls className="max-h-96 w-full bg-black object-contain" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Uploaded crop" className="max-h-96 w-full object-contain" />
                )}
                <button
                  onClick={reset}
                  aria-label="Remove file"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
                {loading && !analysisImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isVideo ? 'Extracting frame...' : 'Processing...'}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-muted-foreground">
                <span className="truncate font-medium">{fileName}</span>
                {isVideo && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <ScanLine className="h-3.5 w-3.5" />
                    Frame extracted for analysis
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={analyze}
            disabled={!analysisImage || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <ScanLine className="h-5 w-5" />
                Analyze {activeTab === 'video' ? 'Video Frame' : 'Image'}
              </>
            )}
          </button>
        </div>
      )}

      {/* Live stream */}
      {activeTab === 'livestream' && (
        <div className="space-y-6">
          <CameraStream />
          {error && (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button
            onClick={analyze}
            disabled={!analysisImage || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing captured frame...
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                Analyze Captured Frame
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h2 className="font-heading text-2xl font-bold">Analysis Results</h2>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-background/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-heading text-xl font-bold">
                  Prediction: {result.disease || 'Unknown'}
                </h3>
                {result.confidence && <ConfidenceBadge confidence={result.confidence} />}
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                {result.symptoms && <ResultRow label="Symptoms" value={result.symptoms} />}
                {result.prevention && <ResultRow label="Prevention" value={result.prevention} />}
                {result.treatment && <ResultRow label="Treatment" value={result.treatment} />}
              </dl>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700">
              <strong>Heads up:</strong> this is an AI-assisted estimate. For serious or
              spreading outbreaks, confirm with a local agricultural expert.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const normalized = confidence.toLowerCase()
  const tone = normalized.includes('high')
    ? 'bg-green-100 text-green-700'
    : normalized.includes('medium')
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      Confidence: {confidence}
    </span>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-semibold text-primary">{label}</dt>
      <dd className="leading-relaxed text-muted-foreground">{value}</dd>
    </div>
  )
}
