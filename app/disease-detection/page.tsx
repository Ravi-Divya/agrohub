import type { Metadata } from 'next'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'
import DiseaseDetector from '@/components/detectors/disease-detector'

export const metadata: Metadata = {
  title: 'Leaf Disease Detection',
  description:
    'Upload an image, video, or live stream capture of your leaf to detect diseases with AI and get treatment recommendations.',
}

export default function DiseaseDetectionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <PageHeader
        title="Leaf Disease Detection"
        description="Upload an image, video, or live stream capture of your leaf and get an instant AI diagnosis with treatment recommendations."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <DiseaseDetector />
      </main>

      <Footer />
    </div>
  )
}
