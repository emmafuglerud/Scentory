import { perfumes } from './perfumes.js'

export const PROFILE_KEY = 'scentory.scent-profile.v1'

function allNotes() {
  return perfumes.flatMap((perfume) => [
    ...(perfume.topNotes || []),
    ...(perfume.heartNotes || []),
    ...(perfume.baseNotes || []),
    ...(perfume.otherNotes || []),
  ])
}

export const availableNotes = [...new Set(allNotes())].sort((first, second) => first.localeCompare(second))
export const availableFamilies = [...new Set(perfumes.map((perfume) => perfume.fragranceFamily).filter(Boolean))]
  .sort((first, second) => first.localeCompare(second))

function uniqueKnown(values, knownValues) {
  if (!Array.isArray(values)) return []
  return [...new Set(values.filter((value) => knownValues.includes(value)))]
}

// Store only choices and perfume IDs, so the catalogue remains the single source of perfume data.
export function cleanProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return { favoritePerfumeIds: [], notes: [], families: [] }
  }

  return {
    favoritePerfumeIds: uniqueKnown(profile.favoritePerfumeIds, perfumes.map((perfume) => perfume.id)),
    notes: uniqueKnown(profile.notes, availableNotes),
    families: uniqueKnown(profile.families, availableFamilies),
  }
}

export function hasProfilePreferences(profile) {
  const clean = cleanProfile(profile)
  return clean.favoritePerfumeIds.length + clean.notes.length + clean.families.length > 0
}

export function loadProfile() {
  try {
    const stored = window.localStorage.getItem(PROFILE_KEY)
    if (stored === null) return { profile: null, error: '' }
    const parsed = JSON.parse(stored)
    const profile = cleanProfile(parsed)
    if (!hasProfilePreferences(profile)) return { profile: null, error: '' }
    return { profile, error: '' }
  } catch {
    return { profile: null, error: 'Your scent profile could not be read. Browser storage may be unavailable or the saved data may be damaged.' }
  }
}

export function saveProfile(profile) {
  try {
    const clean = cleanProfile(profile)
    if (!hasProfilePreferences(clean)) return 'Choose at least one perfume, note, or fragrance family to create your scent profile.'
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(clean))
    return ''
  } catch {
    return 'Could not save your scent profile in this browser. Check that browser storage is available and try again.'
  }
}

export function resetProfile() {
  try {
    window.localStorage.removeItem(PROFILE_KEY)
    return ''
  } catch {
    return 'Could not reset your scent profile in this browser. Check that browser storage is available and try again.'
  }
}
