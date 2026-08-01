'use client'

import { useState } from 'react'
import { Radio, Users, MapPin, Clock, CalendarClock, PlayCircle } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import PageHeader from '@/components/layout/page-header'

interface Stream {
  id: number
  title: string
  location: string
  viewers: number
  startTime: string
  status: 'live' | 'upcoming'
  duration: string
  host: string
}

const initialStreams: Stream[] = [
  {
    id: 1,
    title: 'Morning Farm Tour — Wheat Field',
    location: 'Punjab, India',
    viewers: 234,
    startTime: '08:00 AM',
    status: 'live',
    duration: '45 min',
    host: 'AgroHub Field Team',
  },
  {
    id: 2,
    title: 'Organic Farming Techniques Demo',
    location: 'Karnataka, India',
    viewers: 156,
    startTime: '10:30 AM',
    status: 'live',
    duration: '60 min',
    host: 'Dr. Meera Nair',
  },
  {
    id: 3,
    title: 'Pest Management Workshop',
    location: 'Haryana, India',
    viewers: 89,
    startTime: '02:00 PM',
    status: 'upcoming',
    duration: '90 min',
    host: 'Agronomist Panel',
  },
]

export default function LiveStreamPage() {
  const [streams] = useState(initialStreams)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)

  const joinStream = (stream: Stream) => {
    setSelectedStream(stream)
  }

  const liveStreams = streams.filter((s) => s.status === 'live')
  const upcomingStreams = streams.filter((s) => s.status === 'upcoming')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="Live Streams"
        description="Watch live broadcasts from farms across the country. Learn from experts and farmers in real time."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {selectedStream ? (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#3b2a17] via-[#7a4b1a] to-[#c07a1e]">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
                <div className="relative flex flex-col items-center px-6 text-center">
                  <Radio className="h-14 w-14 animate-pulse text-white/90" />
                  <p className="mt-4 text-xl font-bold text-white">{selectedStream.title}</p>
                  <p className="mt-1 text-sm text-amber-100">
                    {selectedStream.status === 'live' ? 'Now broadcasting' : 'Session starting soon'}
                  </p>
                </div>
                {selectedStream.status === 'live' && (
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    LIVE
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-heading text-2xl font-bold">{selectedStream.title}</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {selectedStream.status}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <InfoItem icon={MapPin} text={selectedStream.location} />
                  <InfoItem
                    icon={Users}
                    text={`${selectedStream.viewers} watching`}
                  />
                  <InfoItem icon={Clock} text={selectedStream.duration} />
                  <InfoItem icon={CalendarClock} text={selectedStream.startTime} />
                </div>
                <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold">About this stream</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Hosted by {selectedStream.host}. Join for a live tour and demonstration —
                    learn farming techniques, ask questions in real time, and connect with our
                    farming community.
                  </p>
                </div>
                {selectedStream.status === 'upcoming' && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700">
                    This stream hasn&apos;t started yet. Check back at the scheduled time to
                    join live.
                  </div>
                )}
                <button
                  onClick={() => setSelectedStream(null)}
                  className="mt-6 rounded-xl border border-border px-6 py-3 font-semibold transition hover:bg-muted"
                >
                  Back to Streams
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="mb-6 font-heading text-2xl font-bold">Current Streams</h2>
              {liveStreams.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <Radio className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-semibold">No live streams right now</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check the upcoming schedule below for the next broadcast.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {liveStreams.map((stream) => (
                    <div
                      key={stream.id}
                      onClick={() => joinStream(stream)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                    >
                      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#3b2a17] to-[#c07a1e]">
                        <Radio className="h-12 w-12 text-white/80 transition-transform group-hover:scale-110" />
                        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                          LIVE
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs text-white">
                          <PlayCircle className="h-4 w-4" />
                          Click to join
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-2 font-heading font-bold">{stream.title}</h3>
                        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {stream.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            {stream.viewers} viewers
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-12">
              <h2 className="mb-6 font-heading text-2xl font-bold">Upcoming Streams</h2>
              <div className="space-y-4">
                {upcomingStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-heading text-lg font-bold">{stream.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Hosted by {stream.host}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-primary" />
                          {stream.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          {stream.startTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarClock className="h-4 w-4 text-primary" />
                          {stream.duration}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => joinStream(stream)}
                      className="shrink-0 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

function InfoItem({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="truncate">{text}</span>
    </div>
  )
}
