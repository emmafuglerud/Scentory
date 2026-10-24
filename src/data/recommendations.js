function perfumeNotes(perfume) {
  return [...new Set([
    ...(perfume.topNotes || []),
    ...(perfume.heartNotes || []),
    ...(perfume.baseNotes || []),
    ...(perfume.otherNotes || []),
  ])]
}

function intersect(first, second) {
  const secondSet = new Set(second)
  return first.filter((item) => secondSet.has(item))
}

function describeNotes(notes) {
  if (notes.length === 1) return notes[0]
  if (notes.length === 2) return `${notes[0]} and ${notes[1]}`
  return `${notes.slice(0, 2).join(', ')}, and ${notes[2]}`
}

export function getRecommendations(perfumes, profile, collection) {
  const favorites = perfumes.filter((perfume) => profile.favoritePerfumeIds.includes(perfume.id))
  const favoriteNotes = [...new Set(favorites.flatMap(perfumeNotes))]
  const notForMeIds = new Set(collection.filter((entry) => entry.category === 'not-for-me').map((entry) => entry.perfumeId))

  return perfumes
    .filter((candidate) => !profile.favoritePerfumeIds.includes(candidate.id) && !notForMeIds.has(candidate.id))
    .map((candidate) => {
      const notes = perfumeNotes(candidate)
      const selectedNoteMatches = intersect(notes, profile.notes)
      const favoriteMatches = intersect(notes, favoriteNotes)
      const familyMatches = profile.families.includes(candidate.fragranceFamily)
      const favouriteFamilyMatches = favorites.some((perfume) => perfume.fragranceFamily === candidate.fragranceFamily)
      const score = selectedNoteMatches.length * 3 + favoriteMatches.length * 2 + (familyMatches ? 4 : 0) + (favouriteFamilyMatches ? 1 : 0)

      let reason = ''
      if (selectedNoteMatches.length) {
        reason = `Matches notes you selected: ${describeNotes(selectedNoteMatches.slice(0, 3))}.`
      } else if (favoriteMatches.length) {
        const closestFavorite = favorites
          .map((perfume) => ({ perfume, matches: intersect(notes, perfumeNotes(perfume)) }))
          .sort((first, second) => second.matches.length - first.matches.length)[0]
        reason = `Shares ${describeNotes(closestFavorite.matches.slice(0, 3))} notes with ${closestFavorite.perfume.name}.`
      } else if (familyMatches) {
        reason = `Matches the ${candidate.fragranceFamily} fragrance family you selected.`
      } else if (favouriteFamilyMatches) {
        reason = `Shares the ${candidate.fragranceFamily} fragrance family of one of your favourite perfumes.`
      }

      return { perfume: candidate, score, reason }
    })
    .filter((result) => result.score > 0)
    .sort((first, second) => second.score - first.score || first.perfume.name.localeCompare(second.perfume.name))
    .slice(0, 4)
}

export function getProfileSummary(perfumes, profile) {
  const favorites = perfumes.filter((perfume) => profile.favoritePerfumeIds.includes(perfume.id))
  const pieces = []

  if (favorites.length) pieces.push(`Your profile starts with ${favorites.map((perfume) => perfume.name).join(' and ')}.`)
  if (profile.notes.length) pieces.push(`You selected notes such as ${describeNotes(profile.notes.slice(0, 3))}.`)
  if (profile.families.length) pieces.push(`You are drawn to ${profile.families.map((family) => `${family} fragrances`).join(' and ')}.`)
  if (!profile.notes.length && !profile.families.length && favorites.length) {
    pieces.push('We use its notes and fragrance family as a starting point for your suggestions.')
  }

  return pieces.join(' ')
}

export function isSparseProfile(profile) {
  return profile.favoritePerfumeIds.length + profile.notes.length + profile.families.length <= 1
}
