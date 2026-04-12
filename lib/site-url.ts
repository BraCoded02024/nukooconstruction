/** Canonical public site URL (no trailing slash). Used for SEO metadata and sitemap. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || ''
  if (raw) return raw.replace(/\/$/, '')
  return 'https://nukooconstructionandproperties.com'
}
