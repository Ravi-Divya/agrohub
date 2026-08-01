import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Link from 'next/link'
import { Leaf, Bug, Sprout, Zap, ArrowRight } from 'lucide-react'

const analyses = [
  {
    icon: Leaf,
    title: 'Leaf Detection',
    description: 'Leaf Disease Detection — identify diseases and get treatment recommendations',
    href: '/disease-detection',
  },
  {
    icon: Bug,
    title: 'Pest Detection',
    description: 'Identify and count pests affecting your crops',
    href: '/pest-detection',
  },
  {
    icon: Sprout,
    title: 'Crop Detection',
    description: 'Analyze soil conditions and get crop recommendations',
    href: '/crop-suggestions',
  },
  {
    icon: Zap,
    title: 'Agricultural Technology',
    description: 'Explore modern agri-tech solutions for smarter farming',
    href: '/agri-tech',
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
              Agricultural Analysis
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              AI-powered crop intelligence to help you detect diseases, identify pests, and
              grow smarter.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {analyses.map((analysis) => {
              const Icon = analysis.icon
              return (
                <Link
                  key={analysis.href}
                  href={analysis.href}
                  className="group flex h-full flex-col items-center rounded-xl border border-gray-300 bg-white p-8 text-center shadow-md transition-shadow hover:border-primary hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-gray-800">{analysis.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {analysis.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
