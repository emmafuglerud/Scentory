import { useRef, useState } from 'react'
import { categories, ratings } from '../data/collection'
import CollectionIcon from './CollectionIcon'
import Modal from './Modal'

export default function CollectionEditor({ perfume, entry, onSave, onClose, returnFocusRef, fallbackFocusRef }) {
  const [category, setCategory] = useState(entry?.category || '')
  const [rating, setRating] = useState(entry?.rating || null)
  const [error, setError] = useState('')
  const firstCategoryRef = useRef(null)

  function submit(event) {
    event.preventDefault()
    if (!category) {
      setError('Please choose a category before saving.')
      firstCategoryRef.current?.focus()
      return
    }
    // Rating stays optional and is never inferred from the category.
    setError(onSave({ perfumeId: perfume.id, category, rating }))
  }

  return (
    <Modal titleId="collection-editor-title" closeLabel="Close collection editor" className="collection-editor" onClose={onClose} returnFocusRef={returnFocusRef} fallbackFocusRef={fallbackFocusRef}>
      <header className="detail-header">
        <p className="eyebrow">{entry ? 'EDIT COLLECTION' : 'ADD TO COLLECTION'}</p>
        <h1 id="collection-editor-title">{perfume.name}</h1>
        <p className="detail-concentration">{perfume.brand}</p>
      </header>
      <form className="collection-form" onSubmit={submit} noValidate>
        <fieldset className="category-choices" aria-describedby={error ? 'collection-editor-error' : undefined}>
          <legend>Choose a category <span>Required</span></legend>
          {categories.map((choice, index) => (
            <label className="category-choice" key={choice.id}>
              <input ref={index === 0 ? firstCategoryRef : undefined} type="radio" name="collection-category" value={choice.id} checked={category === choice.id} required onChange={() => { setCategory(choice.id); setError('') }} />
              <span className="category-choice-content">
                <CollectionIcon name={choice.icon} />
                <span className="category-choice-text"><strong>{choice.label}</strong><small>{choice.description}</small></span>
                <span className="category-indicator" aria-hidden="true">{category === choice.id ? '✓' : ''}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className="rating-choices">
          <legend>How do you feel about this scent?</legend>
          <p className="rating-hint">Optional · Select again to clear.</p>
          <div className="rating-buttons">
            {ratings.map((choice) => (
              <button key={choice.id} type="button" aria-pressed={rating === choice.id} onClick={() => setRating(rating === choice.id ? null : choice.id)}>
                <CollectionIcon name={choice.icon} /><span>{choice.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
        {error && <p className="collection-error" id="collection-editor-error" role="alert">{error}</p>}
        <button className="primary-button collection-save" type="submit"><span aria-hidden="true">{entry ? '✓' : '+'}</span> {entry ? 'Save changes' : 'Add to Collection'}</button>
        <p className="local-collection-note">Local demo data · Saved in this browser, not a personal account.</p>
      </form>
    </Modal>
  )
}
