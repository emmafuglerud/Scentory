import { perfumes } from './perfumes.js'

export const COLLECTION_KEY = 'scentory.collection.v1'

export const categories = [
  { id: 'owned', label: 'I own this', description: 'Perfumes in my current collection', icon: 'heart' },
  { id: 'previously-owned', label: 'Previously owned', description: "Perfumes I've had before", icon: 'history' },
  { id: 'wishlist', label: 'Wishlist', description: "Perfumes I'd love to try or buy", icon: 'bookmark' },
  { id: 'not-for-me', label: 'Not for me', description: "Perfumes I don't enjoy", icon: 'thumbs-down' },
]

export const ratings = [
  { id: 'love', label: 'Love it', icon: 'heart' },
  { id: 'like', label: 'Like it', icon: 'thumbs-up' },
  { id: 'not-for-me', label: 'Not for me', icon: 'thumbs-down' },
]

// Keep only known IDs and choices. Never copy full perfume objects into storage.
export function cleanCollection(entries) {
  const uniqueEntries = new Map()
  for (const entry of entries) {
    if (!entry || !perfumes.some((perfume) => perfume.id === entry.perfumeId) ||
        !categories.some((category) => category.id === entry.category)) continue

    uniqueEntries.set(entry.perfumeId, {
      perfumeId: entry.perfumeId,
      category: entry.category,
      rating: ratings.some((rating) => rating.id === entry.rating) ? entry.rating : null,
    })
  }
  return [...uniqueEntries.values()]
}

export function loadCollection() {
  try {
    const stored = window.localStorage.getItem(COLLECTION_KEY)
    if (stored === null) return { entries: [], error: '' }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) throw new Error('Invalid collection')
    const entries = cleanCollection(parsed)
    return { entries, error: entries.length < parsed.length ? 'Some saved entries were invalid or duplicated and could not be loaded separately.' : '' }
  } catch {
    return { entries: [], error: 'Your local collection could not be read. Browser storage may be unavailable or the saved data may be damaged.' }
  }
}

// Return an error instead of showing a successful save if storage is blocked/full.
export function saveCollection(entries) {
  try {
    window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(cleanCollection(entries)))
    return ''
  } catch {
    return 'Could not save your collection in this browser. Check that browser storage is available and try again.'
  }
}

export function resetCollection() {
  try {
    window.localStorage.removeItem(COLLECTION_KEY)
    return ''
  } catch {
    return 'Could not reset your collection in this browser. Check that browser storage is available and try again.'
  }
}
