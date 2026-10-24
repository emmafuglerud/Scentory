import { useMemo, useState } from 'react'
import { availableFamilies, availableNotes, cleanProfile } from '../data/profile'
import './Profile.css'

function toggleChoice(choices, choice) {
  return choices.includes(choice) ? choices.filter((item) => item !== choice) : [...choices, choice]
}

export default function ProfileEditor({ perfumes, profile, onSave, onCancel, headingRef }) {
  const startingProfile = cleanProfile(profile)
  const [favoritePerfumeIds, setFavoritePerfumeIds] = useState(startingProfile.favoritePerfumeIds)
  const [notes, setNotes] = useState(startingProfile.notes)
  const [families, setFamilies] = useState(startingProfile.families)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const selectedPerfumes = perfumes.filter((perfume) => favoritePerfumeIds.includes(perfume.id))
  const matches = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return perfumes
    return perfumes.filter((perfume) => perfume.name.toLocaleLowerCase().includes(query) || perfume.brand.toLocaleLowerCase().includes(query))
  }, [perfumes, search])

  function save(event) {
    event.preventDefault()
    const result = onSave({ favoritePerfumeIds, notes, families })
    if (result) setError(result)
  }

  return (
    <section className="profile-editor" aria-labelledby="page-title">
      <p className="eyebrow">YOUR PERSONAL FRAGRANCE GUIDE</p>
      <h1 id="page-title" ref={headingRef} tabIndex={-1}>Let’s discover your scent.</h1>
      <p className="library-intro">Tell us a little about what you love. We’ll help you discover fragrances that match your taste.</p>
      <p className="profile-optional-note">Everything is optional. Start wherever you like.</p>

      <form onSubmit={save} noValidate>
        <section className="profile-section profile-favourites" aria-labelledby="favourites-heading">
          <div className="profile-section-heading">
            <span className="profile-step" aria-hidden="true">01</span>
            <div><h2 id="favourites-heading">Perfumes you love</h2><p>Choose any perfume from the Scentory catalogue. One is enough to get started.</p></div>
          </div>
          {selectedPerfumes.length > 0 && (
            <ul className="selected-perfumes" aria-label="Selected favourite perfumes">
              {selectedPerfumes.map((perfume) => <li key={perfume.id}><span>{perfume.brand} · <strong>{perfume.name}</strong></span><button type="button" onClick={() => setFavoritePerfumeIds((ids) => ids.filter((id) => id !== perfume.id))} aria-label={`Remove ${perfume.name}`}>×</button></li>)}
            </ul>
          )}
          <label className="profile-search-label" htmlFor="profile-perfume-search">Search the perfume catalogue</label>
          <input id="profile-perfume-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by perfume or brand…" />
          <ul className="profile-perfume-results" aria-label="Perfume search results">
            {matches.map((perfume) => {
              const selected = favoritePerfumeIds.includes(perfume.id)
              return <li key={perfume.id}><button type="button" aria-pressed={selected} onClick={() => setFavoritePerfumeIds((ids) => toggleChoice(ids, perfume.id))}><img src={perfume.imagePath || '/images/perfume-placeholder.svg'} alt="" /><span><small>{perfume.brand}</small><strong>{perfume.name}</strong></span><span className="profile-choice-indicator" aria-hidden="true">{selected ? '✓' : '+'}</span></button></li>
            })}
          </ul>
        </section>

        <section className="profile-section" aria-labelledby="notes-heading">
          <div className="profile-section-heading"><span className="profile-step" aria-hidden="true">02</span><div><h2 id="notes-heading">Explore fragrance notes <span>(optional)</span></h2><p>Know which notes you love? Select them to refine your recommendations.</p></div></div>
          <div className="profile-chips" aria-label="Fragrance notes">
            {availableNotes.map((note) => <button key={note} type="button" aria-pressed={notes.includes(note)} onClick={() => setNotes((choices) => toggleChoice(choices, note))}>{note}</button>)}
          </div>
        </section>

        <section className="profile-section" aria-labelledby="families-heading">
          <div className="profile-section-heading"><span className="profile-step" aria-hidden="true">03</span><div><h2 id="families-heading">Choose scent families <span>(optional)</span></h2><p>Choose the fragrance families you are drawn to. This is another way to refine your profile.</p></div></div>
          <div className="profile-chips profile-family-chips" aria-label="Fragrance families">
            {availableFamilies.map((family) => <button key={family} type="button" aria-pressed={families.includes(family)} onClick={() => setFamilies((choices) => toggleChoice(choices, family))}>{family}</button>)}
          </div>
        </section>

        {error && <p className="collection-error" role="alert">{error}</p>}
        <div className="profile-actions"><button className="text-button" type="button" onClick={onCancel}>Back to Home</button><button className="primary-button" type="submit">Discover my scent <span aria-hidden="true">✧</span></button></div>
      </form>
    </section>
  )
}
