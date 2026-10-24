export default function Discover({ perfumes, search, onSearchChange, onSelect, headingRef }) {
  // Filter the original database on each keystroke. No second copy of the data.
  const query = search.trim().toLocaleLowerCase()
  const matchingPerfumes = perfumes.filter((perfume) =>
    perfume.name.toLocaleLowerCase().includes(query) ||
    perfume.brand.toLocaleLowerCase().includes(query),
  )

  return (
    <section>
      <div className="discover-heading">
        <div>
          <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
          <h1 id="page-title" ref={headingRef} tabIndex={-1}>A world of scent</h1>
          <p className="library-intro">From soft florals to warm vanilla, find a little something that feels like you.</p>
        </div>
        <span className="library-edition">THE FRAGRANCE LIBRARY <span aria-hidden="true">✧</span></span>
      </div>

      <div className="search-area">
        <label htmlFor="perfume-search">Search perfumes</label>
        <input id="perfume-search" type="search" placeholder="Search by perfume or brand…" value={search} onChange={(event) => onSearchChange(event.target.value)} />
      </div>
      <p className="results-count" role="status">{matchingPerfumes.length} of {perfumes.length} perfumes</p>

      {matchingPerfumes.length ? (
        <ul className="perfume-grid">
          {matchingPerfumes.map((perfume) => (
            <li key={perfume.id}>
              <button className="perfume-card" onClick={(event) => onSelect(perfume.id, event.currentTarget)} aria-label={`View ${perfume.name} by ${perfume.brand}`}>
                <span className="card-image"><img src={perfume.imagePath || '/images/perfume-placeholder.svg'} alt="" loading="lazy" width="400" height="480" /></span>
                <span className="card-copy">
                  <span className="card-brand">{perfume.brand}</span>
                  <span className="card-name">{perfume.name}</span>
                  <span className="card-concentration">{perfume.concentration}</span>
                  <span className="card-link">Explore scent <span aria-hidden="true">↗</span></span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="search-empty">
          <span aria-hidden="true">✧</span>
          <h2>No perfumes found</h2>
          <p>Try another perfume name or brand.</p>
          <button className="text-button" onClick={() => onSearchChange('')}>Clear search</button>
        </div>
      )}
    </section>
  )
}
