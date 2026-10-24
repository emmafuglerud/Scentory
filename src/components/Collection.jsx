import { useState } from 'react'
import { categories, ratings } from '../data/collection'
import CollectionIcon from './CollectionIcon'

export default function Collection({ perfumes, entries, onSelect, onEdit, onRemove, onDiscover, headingRef }) {
  const [activeCategory, setActiveCategory] = useState('owned')
  const visibleEntries = entries.filter((entry) => entry.category === activeCategory)

  return (
    <section className="my-collection">
      <p className="eyebrow">YOUR PERSONAL FRAGRANCE LIBRARY</p>
      <h1 id="page-title" ref={headingRef} tabIndex={-1}>My Collection</h1>
      <p className="library-intro">Every scent tells a story. Here's yours.</p>
      <p className="local-collection-note">Saved only in this browser. This demo collection is shared across demo logins on this device.</p>

      <div className="collection-filters" role="group" aria-label="Filter collection by category">
        {categories.map((category) => (
          <button key={category.id} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>
            <CollectionIcon name={category.icon} /><span>{category.label}</span>
            <span className="category-count">{entries.filter((entry) => entry.category === category.id).length}</span>
          </button>
        ))}
      </div>
      <p className="results-count" role="status">{visibleEntries.length} {visibleEntries.length === 1 ? 'perfume' : 'perfumes'} in {categories.find((category) => category.id === activeCategory).label}</p>

      {visibleEntries.length ? (
        <ul className="perfume-grid collection-grid">
          {visibleEntries.map((entry) => {
            const perfume = perfumes.find((item) => item.id === entry.perfumeId)
            const rating = ratings.find((item) => item.id === entry.rating)
            return (
              <li className="collection-card" key={entry.perfumeId}>
                <button className="perfume-card" aria-label={`View ${perfume.name} by ${perfume.brand}`} onClick={(event) => onSelect(perfume.id, event.currentTarget)}>
                  <span className="card-image"><img src={perfume.imagePath || '/images/perfume-placeholder.svg'} alt="" loading="lazy" width="400" height="480" /></span>
                  <span className="card-copy">
                    <span className="card-brand">{perfume.brand}</span>
                    <span className="card-name">{perfume.name}</span>
                    <span className="card-concentration">{perfume.concentration}</span>
                    {rating && <span className="saved-rating"><CollectionIcon name={rating.icon} />{rating.label}</span>}
                  </span>
                </button>
                <div className="collection-card-actions">
                  <button aria-label={`Edit ${perfume.name} in collection`} onClick={(event) => onEdit(perfume.id, event.currentTarget)}><CollectionIcon name="edit" />Edit</button>
                  <button aria-label={`Remove ${perfume.name} from collection`} onClick={() => { if (onRemove(perfume.id)) headingRef.current?.focus({ preventScroll: true }) }}>Remove</button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="search-empty collection-empty">
          <CollectionIcon name={categories.find((category) => category.id === activeCategory).icon} />
          <h2>Your next scent story awaits</h2>
          <p>No perfumes in this category yet. Find a scent that catches your curiosity.</p>
          <button className="primary-button" onClick={onDiscover}>Explore Discover <span aria-hidden="true">↗</span></button>
        </div>
      )}
    </section>
  )
}
