// Small outline icons, using the same approach as the existing navigation.
export default function CollectionIcon({ name }) {
  const paths = {
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    history: 'M3 11a9 9 0 1 1 2.6 7M3 4v7h7M12 7v5l3 2',
    bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
    'thumbs-up': 'M7 10v11H3V10h4Zm0 0 5-8c2 0 3 1 2 5l-1 3h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7',
    'thumbs-down': 'M7 14V3H3v11h4Zm0 0 5 8c2 0 3-1 2-5l-1-3h6a2 2 0 0 0 2-2l-2-7a2 2 0 0 0-2-2H7',
    edit: 'm15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}
