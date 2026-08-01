'use client'

import { useState } from 'react'
import { Upload, Loader2, Image as ImageIcon, Film, AlertCircle } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'

interface GalleryItem {
  id: number
  title: string
  type: 'image' | 'video'
  url: string
  date: string
}

const MAX_SIZE = 10 * 1024 * 1024

export default function GalleryPage() {
  const [uploads, setUploads] = useState<GalleryItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only image and video files are supported.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('File size must be less than 10MB.')
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim()) {
      setError('Please select a file and enter a title.')
      return
    }
    setUploading(true)
    setError('')

    await new Promise((resolve) => setTimeout(resolve, 800))

    const type: 'image' | 'video' = selectedFile.type.startsWith('video/') ? 'video' : 'image'
    const newUpload: GalleryItem = {
      id: Date.now(),
      title: uploadTitle.trim(),
      type,
      url: URL.createObjectURL(selectedFile),
      date: new Date().toLocaleDateString(),
    }
    setUploads((prev) => [newUpload, ...prev])
    setUploadTitle('')
    setSelectedFile(null)
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Gallery"
        description="Share and browse farming photos, crop images, and agricultural practices from the AgroHub community."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="mb-6 font-heading text-2xl font-bold">Upload to the Gallery</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., My cotton field in June"
                className="w-full rounded-xl border border-input bg-background p-3 outline-none transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Select image or video</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>

          {selectedFile && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selected: <span className="font-semibold text-foreground">{selectedFile.name}</span>
            </p>
          )}

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile || !uploadTitle.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload to Gallery
              </>
            )}
          </button>
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Community Gallery</h2>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {uploads.length} {uploads.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {uploads.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-14 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-semibold">The gallery is empty — be the first to share</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Upload a photo or short video of your farm to start building the community
                gallery.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {upload.type === 'video' ? (
                      <video src={upload.url} controls className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={upload.url}
                        alt={upload.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    {upload.type === 'video' && (
                      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                        <Film className="h-3.5 w-3.5" />
                        Video
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="truncate font-heading font-bold">{upload.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Shared {upload.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
