'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Loader2,
  Pause,
  Play,
  StopCircle,
  Camera as CameraIcon,
  CameraOff,
  SwitchCamera,
} from 'lucide-react'

type FacingMode = 'user' | 'environment'

export default function CameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('user')
  const [streaming, setStreaming] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const attachStream = (video: HTMLVideoElement) => {
    if (streamRef.current && video.srcObject !== streamRef.current) {
      video.srcObject = streamRef.current
    }
    video.play().catch(() => {})
  }

  const requestStream = async (mode: FacingMode) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    })
    streamRef.current = stream
    setFacingMode(mode)
  }

  const startStream = async (mode: FacingMode = facingMode) => {
    try {
      setLoading(true)
      setError('')
      try {
        await requestStream(mode)
      } catch {
        await requestStream(mode === 'user' ? 'environment' : 'user')
      }
      const video = videoRef.current
      if (video) {
        attachStream(video)
      }
      setStreaming(true)
    } catch {
      setError(
        'Failed to access the camera. Make sure you have allowed camera access in your browser settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStreaming(false)
    setPaused(false)
  }

  const switchCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user'
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    startStream(next)
  }

  const togglePause = () => {
    if (!videoRef.current) return
    if (paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
    setPaused(!paused)
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setLoading(true)
    try {
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.85)

      window.dispatchEvent(
        new CustomEvent('livestreamCapture', {
          detail: { imageData, fileName: 'live-stream-capture.jpg' },
        })
      )
    } catch {
      setError('Failed to capture the current frame. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-black aspect-video">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />

        {!streaming && (
          <button
            onClick={() => startStream()}
            disabled={loading}
            className="absolute inset-0 flex w-full flex-col items-center justify-center gap-3 bg-card px-6 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="font-semibold text-muted-foreground">Initializing camera...</span>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <CameraOff className="h-8 w-8 text-primary" />
                </div>
                <span className="font-heading text-lg font-semibold">Start Live Stream</span>
                <span className="max-w-sm text-sm text-muted-foreground">
                  Point your camera at the crop, then capture a frame when you see the affected
                  area clearly.
                </span>
                <span className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                  <CameraIcon className="h-4 w-4" />
                  Enable Camera
                </span>
              </>
            )}
          </button>
        )}

        {streaming && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </div>
        )}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
              Paused
            </span>
          </div>
        )}
      </div>

      {streaming && (
        <>
          <div className="flex gap-3">
            <button
              onClick={togglePause}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-semibold transition hover:bg-muted"
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={switchCamera}
              disabled={loading}
              title="Switch camera"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SwitchCamera className="h-4 w-4" />
              Switch
            </button>
            <button
              onClick={stopStream}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive py-3 font-semibold text-white transition hover:opacity-90"
            >
              <StopCircle className="h-4 w-4" />
              Stop
            </button>
          </div>

          <button
            onClick={captureAndAnalyze}
            disabled={loading || paused}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Capturing frame...
              </>
            ) : (
              <>
                <CameraIcon className="h-5 w-5" />
                Capture & Analyze Current Frame
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
