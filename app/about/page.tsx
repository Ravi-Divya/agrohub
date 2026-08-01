import type { Metadata } from 'next'
import { Leaf, Bug, Sprout, Zap } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about AgroHub — Leaf Disease Detection, Pest Detection, Crop Analysis, and Agricultural Technology powered by AI.',
}

const features = [
  {
    icon: Leaf,
    title: 'Leaf Disease Detection',
    text: 'Upload an image, video, or live stream capture of your leaf and our AI instantly identifies the disease with a confidence score — along with practical prevention and treatment recommendations for your crop.',
    points: [
      'Instant AI diagnosis with confidence score',
      'Prevention and treatment recommendations',
      'Supports image, video, and live stream uploads',
    ],
  },
  {
    icon: Bug,
    title: 'Pest Detection',
    text: 'Identify harmful pests affecting your crops by uploading images, videos, or live captures. Get expert control methods and damage assessments to act before infestations spread.',
    points: [
      'Recognizes common crop pests instantly',
      'Damage symptoms and control methods',
      'Real-time scan with your camera',
    ],
  },
  {
    icon: Sprout,
    title: 'Crop Detection',
    text: 'Analyze your soil type, pH level, and farming season to get personalized crop recommendations — matching your land conditions with the crops most likely to succeed.',
    points: [
      'Soil type and pH matching',
      'Season-aware suggestions',
      'Expected yield estimates',
    ],
  },
  {
    icon: Zap,
    title: 'Agricultural Technology',
    text: 'Explore cutting-edge agri-tech solutions — from precision agriculture and drip irrigation to IoT sensors, solar-powered equipment, and automated harvesting.',
    points: [
      'Precision agriculture insights',
      'IoT sensors and monitoring',
      'Cost and ROI guidance',
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Empowering farmers with AI"
        description="AgroHub brings four AI-powered tools together — so every farmer can detect, analyze, and grow smarter."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl font-bold">{feature.title}</h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">{feature.text}</p>
                <ul className="mt-4 space-y-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
