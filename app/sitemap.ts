import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agrohub.onrender.com'
  const lastModified = new Date()

  const paths = [
    '',
    '/disease-detection',
    '/pest-detection',
    '/crop-suggestions',
    '/livestream',
    '/agri-tech',
    '/gallery',
    '/about',
    '/contact',
  ]

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))
}
