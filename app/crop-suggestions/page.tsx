'use client'

import { useState } from 'react'
import { Loader2, AlertCircle, Sprout, Droplets, Thermometer, Ruler, Calendar } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'

interface Crop {
  name: string
  category: string
  soilPH: string
  soilType: string
  water: string
  season: string
  temp: string
  yield: string
  soilKeywords: string[]
}

const cropDatabase: Crop[] = [
  {
    name: 'Wheat',
    category: 'Cereals',
    soilPH: '6.0-7.5',
    soilType: 'Well-drained loamy soil',
    water: '400-500mm annual',
    season: 'Winter (Oct-Mar)',
    temp: '15-25°C',
    yield: '3-5 tons/hectare',
    soilKeywords: ['loam', 'well-drained'],
  },
  {
    name: 'Rice',
    category: 'Cereals',
    soilPH: '5.5-7.0',
    soilType: 'Clayey loam, waterlogged',
    water: '800-1500mm',
    season: 'Summer (May-Oct)',
    temp: '20-30°C',
    yield: '4-6 tons/hectare',
    soilKeywords: ['clay', 'loam'],
  },
  {
    name: 'Tomato',
    category: 'Vegetables',
    soilPH: '6.0-6.8',
    soilType: 'Well-drained fertile soil',
    water: '400-600mm',
    season: 'Year-round (spring/fall best)',
    temp: '20-27°C',
    yield: '30-50 tons/hectare',
    soilKeywords: ['well-drained', 'fertile', 'loam'],
  },
  {
    name: 'Potato',
    category: 'Vegetables',
    soilPH: '5.0-7.0',
    soilType: 'Loose, well-drained soil',
    water: '400-600mm',
    season: 'Winter-Spring',
    temp: '15-21°C',
    yield: '20-30 tons/hectare',
    soilKeywords: ['loose', 'well-drained', 'sandy'],
  },
  {
    name: 'Corn',
    category: 'Cereals',
    soilPH: '6.0-7.5',
    soilType: 'Loamy, fertile soil',
    water: '500-800mm',
    season: 'Summer (Apr-Oct)',
    temp: '20-30°C',
    yield: '5-8 tons/hectare',
    soilKeywords: ['loam', 'fertile'],
  },
  {
    name: 'Apple',
    category: 'Fruits',
    soilPH: '6.0-7.0',
    soilType: 'Well-drained loam',
    water: '600-1000mm',
    season: 'Year-round (perennial)',
    temp: '10-20°C',
    yield: '20-40 tons/hectare',
    soilKeywords: ['loam', 'well-drained'],
  },
]

export default function CropSuggestionsPage() {
  const [soilPH, setSoilPH] = useState('')
  const [soilType, setSoilType] = useState('')
  const [climate, setClimate] = useState('')
  const [season, setSeason] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Crop[]>([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')

  const handleSuggest = () => {
    if (!soilPH && !soilType && !climate && !season) {
      setError('Fill in at least one field to get personalized suggestions.')
      return
    }
    setError('')
    setLoading(true)

    setTimeout(() => {
      const ph = parseFloat(soilPH)
      const filtered = cropDatabase.filter((crop) => {
        const [min, max] = crop.soilPH.split('-').map((v) => parseFloat(v.replace(/\D/g, '')))
        let match = true

        if (!Number.isNaN(ph) && (ph < min - 0.5 || ph > max + 0.5)) match = false
        if (
          soilType &&
          !crop.soilKeywords.some((k) => soilType.toLowerCase().includes(k))
        ) {
          match = false
        }
        if (season && !crop.season.toLowerCase().includes(season.toLowerCase())) {
          if (season === 'Spring' && !crop.season.toLowerCase().includes('year-round')) {
            match = false
          }
          if (season === 'Fall' && !crop.season.toLowerCase().includes('year-round')) {
            match = false
          }
          if (season === 'Summer' && !crop.season.toLowerCase().includes('summer') && !crop.season.toLowerCase().includes('year-round')) {
            match = false
          }
          if (season === 'Winter' && !crop.season.toLowerCase().includes('winter') && !crop.season.toLowerCase().includes('year-round')) {
            match = false
          }
        }

        return match
      })

      setSuggestions(filtered.length > 0 ? filtered : cropDatabase.slice(0, 3))
      setShowResults(true)
      setLoading(false)
    }, 1000)
  }

  const inputClass =
    'w-full rounded-xl border border-input bg-background p-3 text-foreground outline-none transition focus:ring-2 focus:ring-primary'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Crop Suggestions"
        description="Get personalized crop recommendations based on your soil conditions, climate, and farming season."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="mb-6 font-heading text-2xl font-bold">Describe Your Farming Conditions</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Soil Type</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className={inputClass}>
                <option value="">Select soil type...</option>
                <option value="loamy">Loamy soil</option>
                <option value="clayey">Clayey soil</option>
                <option value="sandy">Sandy soil</option>
                <option value="well-drained">Well-drained soil</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Soil pH Level</label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="10"
                value={soilPH}
                onChange={(e) => setSoilPH(e.target.value)}
                placeholder="e.g., 6.5"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Season</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className={inputClass}>
                <option value="">Select season...</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Fall">Fall</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Climate</label>
              <select value={climate} onChange={(e) => setClimate(e.target.value)} className={inputClass}>
                <option value="">Select climate...</option>
                <option value="tropical">Tropical</option>
                <option value="subtropical">Subtropical</option>
                <option value="temperate">Temperate</option>
                <option value="arid">Arid</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSuggest}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Matching crops to your conditions...
              </>
            ) : (
              <>
                <Sprout className="h-5 w-5" />
                Get Crop Suggestions
              </>
            )}
          </button>
        </div>

        {showResults && (
          <div className="mt-12 space-y-6">
            <h2 className="font-heading text-2xl font-bold">Recommended Crops</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((crop) => (
                <div
                  key={crop.name}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold">{crop.name}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {crop.category}
                    </span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <span className="font-semibold">Soil: </span>
                        <span className="text-muted-foreground">{crop.soilType} (pH {crop.soilPH})</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <span className="font-semibold">Season: </span>
                        <span className="text-muted-foreground">{crop.season}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Thermometer className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <span className="font-semibold">Temperature: </span>
                        <span className="text-muted-foreground">{crop.temp}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <span className="font-semibold">Water: </span>
                        <span className="text-muted-foreground">{crop.water}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <span className="text-sm font-semibold text-primary">
                      Expected yield: {crop.yield}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
