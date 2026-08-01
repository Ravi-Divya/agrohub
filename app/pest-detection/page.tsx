import type { Metadata } from 'next'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'
import PestDetector from '@/components/detectors/pest-detector'

export const metadata: Metadata = {
  title: 'Pest Detection & Management',
  description:
    'Identify harmful pests with image, video, or live stream uploads and get expert control methods.',
}

export default function PestDetectionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <PageHeader
        title="Pest Detection & Management"
        description="Upload an image, video, or live stream capture and get an instant AI pest identification with control recommendations."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <PestDetector />
      </main>

      <Footer />
    </div>
  )
}
