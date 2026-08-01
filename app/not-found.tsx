import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8">
        <Leaf className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-7xl font-heading font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page not found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
        to your crops.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          Back to Home
        </Link>
        <Link
          href="/disease-detection"
          className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold hover:bg-muted transition"
        >
          Analyze a Crop
        </Link>
      </div>
    </div>
  )
}
