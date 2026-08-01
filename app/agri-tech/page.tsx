import type { Metadata } from 'next'
import { Zap, Droplets, Cpu, Radio, Sun, Leaf } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Agri-Tech Insights',
  description:
    'Explore cutting-edge agricultural technologies transforming modern farming — from precision agriculture to sustainable practices.',
}

const technologies = [
  {
    icon: Cpu,
    title: 'Precision Agriculture',
    description: 'AI-powered systems for targeted crop management',
    benefits: ['Variable rate application', 'Reduce input costs', 'Increase yields', 'Environmental benefits'],
    cost: 'Medium-High',
  },
  {
    icon: Droplets,
    title: 'Drip Irrigation Systems',
    description: 'Efficient water delivery with minimal waste',
    benefits: ['Water savings 30-60%', 'Better crop quality', 'Reduced disease', 'Labor efficient'],
    cost: 'Medium',
  },
  {
    icon: Radio,
    title: 'IoT Sensors & Monitoring',
    description: 'Real-time soil and weather monitoring',
    benefits: ['Soil moisture tracking', 'Weather alerts', 'Data-driven decisions', 'Disease early warning'],
    cost: 'Low-Medium',
  },
  {
    icon: Sun,
    title: 'Solar-Powered Equipment',
    description: 'Renewable energy for farm operations',
    benefits: ['Reduce fuel costs', 'Eco-friendly', 'Long-term savings', 'Government incentives'],
    cost: 'High',
  },
  {
    icon: Leaf,
    title: 'Organic Farming Methods',
    description: 'Sustainable cultivation without chemicals',
    benefits: ['Premium market price', 'Soil health', 'Biodiversity', 'Better nutrition'],
    cost: 'Low',
  },
  {
    icon: Zap,
    title: 'Automated Harvesting',
    description: 'Robotic and drone-based harvesting',
    benefits: ['Reduce labor', 'Faster harvest', 'Less crop damage', 'Night harvesting'],
    cost: 'Very High',
  },
]

export default function AgriTechPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Agricultural Technology"
        description="Explore cutting-edge technologies transforming modern agriculture. From precision farming to sustainable practices."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.title}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold">{tech.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{tech.description}</p>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-primary">Key Benefits</p>
                  <ul className="space-y-1.5">
                    {tech.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 font-bold text-primary">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                  <span className="text-muted-foreground">
                    Cost: <span className="font-semibold text-foreground">{tech.cost}</span>
                  </span>
                  <span className="font-bold text-primary">→</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
