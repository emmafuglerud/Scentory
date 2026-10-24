import { useEffect, useRef, useState } from 'react'
import { perfumes } from '../data/perfumes'
import Discover from './Discover'
import PerfumeModal from './PerfumeModal'
import Collection from './Collection'
import CollectionEditor from './CollectionEditor'
import { categories, loadCollection, resetCollection, saveCollection } from '../data/collection'
import { loadProfile, resetProfile, saveProfile } from '../data/profile'
import HomeDashboard from './HomeDashboard'
import ProfileEditor from './ProfileEditor'
import './ScentoryApp.css'
import './Collection.css'

// Demo navigation and a collection stored only in this browser.
export default function ScentoryApp({ onLogOut }) {
  const [page, setPage] = useState('home')
  const [search, setSearch] = useState('')
  const [selectedPerfumeId, setSelectedPerfumeId] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [collectionState, setCollectionState] = useState(loadCollection)
  const [profileState, setProfileState] = useState(loadProfile)
  const [editingPerfumeId, setEditingPerfumeId] = useState(null)
  const [notice, setNotice] = useState('')
  const headingRef = useRef(null)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const logoutButtonRef = useRef(null)
  const perfumeTriggerRef = useRef(null)
  const editorTriggerRef = useRef(null)
  const selectedPerfume = perfumes.find((perfume) => perfume.id === selectedPerfumeId)
  const editingPerfume = perfumes.find((perfume) => perfume.id === editingPerfumeId)
  const collection = collectionState.entries
  const profile = profileState.profile

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    if (!menuOpen) return

    logoutButtonRef.current?.focus({ preventScroll: true })

    function dismissOutside(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }

    function dismissWithEscape(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        menuButtonRef.current?.focus({ preventScroll: true })
      }
    }

    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissWithEscape)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('keydown', dismissWithEscape)
    }
  }, [menuOpen])

  function navigate(nextPage) {
    setEditingPerfumeId(null)
    setNotice('')
    setMenuOpen(false)
    setSelectedPerfumeId(null)
    setPage(nextPage)
  }

  function openPerfume(id, trigger) {
    setNotice('')
    setMenuOpen(false)
    perfumeTriggerRef.current = trigger
    setSelectedPerfumeId(id)
  }

  function logOut() {
    setEditingPerfumeId(null)
    setMenuOpen(false)
    setSelectedPerfumeId(null)
    onLogOut()
  }

  function resetApp() {
    const shouldReset = window.confirm('Reset your local Scentory demo data? This will remove your saved collection and scent profile from this browser.')
    if (!shouldReset) return

    const collectionError = resetCollection()
    const profileError = resetProfile()
    if (!collectionError) setCollectionState({ entries: [], error: '' })
    if (!profileError) setProfileState({ profile: null, error: '' })

    setEditingPerfumeId(null)
    setSelectedPerfumeId(null)
    setSearch('')
    setMenuOpen(false)
    setPage('home')
    setNotice(collectionError || profileError || 'Your local Scentory demo data has been reset.')
  }

  function resetScentProfile() {
    const shouldReset = window.confirm('Reset your scent profile? Your saved perfume collection will stay as it is.')
    if (!shouldReset) return

    const error = resetProfile()
    if (error) {
      setProfileState((previous) => ({ ...previous, error }))
      setNotice(error)
      return
    }

    setProfileState({ profile: null, error: '' })
    setNotice('Your scent profile has been reset. You can create a new one whenever you are ready.')
  }

  function saveScentProfile(nextProfile) {
    const error = saveProfile(nextProfile)
    if (error) {
      setProfileState((previous) => ({ ...previous, error }))
      return error
    }
    setProfileState({ profile: nextProfile, error: '' })
    setNotice('Your scent profile is saved in this browser. Your suggestions have been updated.')
    setPage('home')
    return ''
  }

  function openEditor(id, trigger) {
    setNotice('')
    setMenuOpen(false)
    editorTriggerRef.current = trigger
    setEditingPerfumeId(id)
  }

  function persistCollection(nextEntries) {
    const error = saveCollection(nextEntries)
    if (error) {
      setCollectionState((previous) => ({ ...previous, error }))
    } else {
      setCollectionState({ entries: nextEntries, error: '' })
    }
    return error
  }

  function saveEntry(entry) {
    const alreadySaved = collection.some((item) => item.perfumeId === entry.perfumeId)
    const error = persistCollection([...collection.filter((item) => item.perfumeId !== entry.perfumeId), entry])
    if (error) return error
    const category = categories.find((item) => item.id === entry.category)
    setNotice(`${alreadySaved ? 'Updated' : 'Added'} ${editingPerfume.name} in ${category.label}. Saved in this browser.`)
    setEditingPerfumeId(null)
    return ''
  }

  function removeEntry(id) {
    setNotice('')
    const error = persistCollection(collection.filter((entry) => entry.perfumeId !== id))
    if (error) return false
    setNotice(`Removed ${perfumes.find((perfume) => perfume.id === id).name} from your local collection.`)
    return true
  }

  const navigation = [
    { id: 'home', label: 'Home', path: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9' },
    { id: 'discover', label: 'Discover', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16 8l-2 6-6 2 2-6 6-2Z' },
    { id: 'collection', label: 'Collection', path: 'M6 3h12v18l-6-4-6 4V3Z' },
  ]

  return (
    <div className="scentory-app">
      <header className="library-header">
        <div className="library-header-inner">
          <div className="header-menu" ref={menuRef} onBlur={(event) => {
            // Tab can leave this simple disclosure menu without getting trapped.
            if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false)
          }}>
            <button className="menu-toggle" ref={menuButtonRef} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="account-menu" onClick={() => setMenuOpen(!menuOpen)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {menuOpen && (
              <div className="account-menu" id="account-menu" role="group" aria-label="Account">
                <button onClick={resetApp}>Reset app <span aria-hidden="true">↺</span></button>
                <button ref={logoutButtonRef} onClick={logOut}>Log out <span aria-hidden="true">↗</span></button>
              </div>
            )}
          </div>
          <span className="wordmark">Scentory<span aria-hidden="true">✧</span></span>
          <span className="library-motto">YOUR SCENT STORY</span>
        </div>
      </header>

      <main className="library-main" aria-labelledby="page-title">
        {notice && !selectedPerfumeId && <p className="collection-notice" role="status">{notice}</p>}
        {page === 'collection' && collectionState.error && <p className="collection-error" role="alert">{collectionState.error}</p>}
        {page === 'home' && <>
          {profileState.error && <p className="collection-error" role="alert">{profileState.error}</p>}
          <HomeDashboard perfumes={perfumes} profile={profile} collection={collection} onCreateProfile={() => navigate('profile')} onEditProfile={() => navigate('profile')} onResetProfile={resetScentProfile} onDiscover={() => navigate('discover')} onSelect={openPerfume} headingRef={headingRef} />
        </>}

        {page === 'profile' && <ProfileEditor perfumes={perfumes} profile={profile} onSave={saveScentProfile} onCancel={() => navigate('home')} headingRef={headingRef} />}

        {page === 'discover' && (
          <Discover perfumes={perfumes} search={search} onSearchChange={setSearch} onSelect={openPerfume} headingRef={headingRef} />
        )}

        {page === 'collection' && (
          <Collection perfumes={perfumes} entries={collection} onSelect={openPerfume} onEdit={openEditor} onRemove={removeEntry} onDiscover={() => navigate('discover')} headingRef={headingRef} />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        {navigation.map(({ id, label, path }) => (
          <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {selectedPerfumeId && (
        <PerfumeModal perfume={selectedPerfume} onClose={() => setSelectedPerfumeId(null)} returnFocusRef={perfumeTriggerRef} collectionEntry={collection.find((entry) => entry.perfumeId === selectedPerfumeId)} onAddToCollection={(trigger) => openEditor(selectedPerfumeId, trigger)} collectionNotice={notice} />
      )}
      {editingPerfume && (
        <CollectionEditor key={editingPerfumeId} perfume={editingPerfume} entry={collection.find((entry) => entry.perfumeId === editingPerfumeId)} onSave={saveEntry} onClose={() => setEditingPerfumeId(null)} returnFocusRef={editorTriggerRef} fallbackFocusRef={headingRef} />
      )}
    </div>
  )
}
