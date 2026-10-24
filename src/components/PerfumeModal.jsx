import Modal from './Modal'
import PerfumeDetails from './PerfumeDetails'

export default function PerfumeModal({ perfume, onClose, returnFocusRef, collectionEntry, onAddToCollection, collectionNotice }) {
  return (
    <Modal titleId="perfume-title" closeLabel="Close perfume details" onClose={onClose} returnFocusRef={returnFocusRef}>
      <PerfumeDetails perfume={perfume} collectionEntry={collectionEntry} onAddToCollection={onAddToCollection} collectionNotice={collectionNotice} />
    </Modal>
  )
}
