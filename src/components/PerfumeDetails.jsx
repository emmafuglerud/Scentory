import { categories, ratings } from '../data/collection'
import CollectionIcon from './CollectionIcon'

function NoteList({ notes }) {
  if (!notes?.length) return <p className="unavailable">Notes not available.</p>

  return <ul className="note-list">{notes.map((note) => <li key={note}>{note}</li>)}</ul>
}

export default function PerfumeDetails({ perfume, collectionEntry, onAddToCollection, collectionNotice }) {
  if (!perfume) {
    return <section><h1 id="perfume-title">Perfume not available</h1><p>Please close this window and choose another perfume.</p></section>
  }

  const hasPrice = Number.isFinite(perfume.priceNok) && perfume.priceNok > 0
  const hasSize = Number.isFinite(perfume.bottleSizeMl) && perfume.bottleSizeMl > 0
  const price = hasPrice ? `${new Intl.NumberFormat('nb-NO').format(perfume.priceNok)} NOK` : 'Price not available.'
  const savedCategory = categories.find((category) => category.id === collectionEntry?.category)
  const savedRating = ratings.find((rating) => rating.id === collectionEntry?.rating)

  return (
    <section className="perfume-information">
      <header className="detail-header">
        <p className="eyebrow">{perfume.brand || 'Brand not available'}</p>
        <h1 id="perfume-title">{perfume.name || 'Name not available'}</h1>
        <p className="detail-concentration">{perfume.concentration || 'Concentration not available.'}</p>
      </header>

      <div className="perfume-details">
        <div className="perfume-summary">
          <figure className="detail-illustration">
            <img src={perfume.imagePath || '/images/perfume-placeholder.svg'} alt="" width="400" height="480" />
            <figcaption>Illustration · Product photo unavailable</figcaption>
          </figure>
          <dl className="perfume-facts">
            <div><dt>Fragrance family</dt><dd className="family-value">{perfume.fragranceFamily || 'Fragrance family not available.'}</dd></div>
            <div><dt>Bottle size</dt><dd>{hasSize ? `${perfume.bottleSizeMl} ml` : 'Bottle size not available.'}</dd></div>
            <div><dt>Approximate retail price</dt><dd>{price}</dd></div>
          </dl>
        </div>
        <div className="fragrance-notes">
          <h2>Fragrance Notes</h2>
          <section aria-label="Top notes"><h3>Top Notes</h3><NoteList notes={perfume.topNotes} /></section>
          <section aria-label="Heart notes"><h3>Heart Notes</h3><NoteList notes={perfume.heartNotes} /></section>
          <section aria-label="Base notes"><h3>Base Notes</h3><NoteList notes={perfume.baseNotes} /></section>
          {perfume.otherNotes?.length > 0 && <section aria-label="Other verified notes"><h3>Other Notes</h3><NoteList notes={perfume.otherNotes} /><p className="notes-caption">The source does not specify a top, heart, or base tier.</p></section>}
        </div>
      </div>

      <footer className="detail-footer">
        <div className="collection-action">
          <button className="primary-button" onClick={(event) => onAddToCollection(event.currentTarget)}>
            {collectionEntry ? <CollectionIcon name="edit" /> : <span aria-hidden="true">+</span>}
            {collectionEntry ? 'Edit Collection' : 'Add to Collection'}
          </button>
          <p>{savedCategory ? `Saved in ${savedCategory.label}${savedRating ? ` · ${savedRating.label}` : ''}` : 'Save to your local demo collection.'}</p>
          {collectionNotice && <p className="collection-notice" role="status">{collectionNotice}</p>}
        </div>
        <p className="price-caption">{perfume.priceRetailer || 'Retailer not available'} · {perfume.checkedAt ? `Checked ${perfume.checkedAt}` : 'Check date not available'}. Prices may change.</p>
      </footer>
    </section>
  )
}
