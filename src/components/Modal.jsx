import { useEffect, useRef } from 'react'

// Shared native dialog for perfume details and the collection editor.
export default function Modal({ children, titleId, closeLabel, className = '', onClose, returnFocusRef, fallbackFocusRef }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = returnFocusRef.current
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const body = document.body
    // A second dialog must not replace the first dialog's background scroll lock.
    const locksBackground = !document.querySelector('dialog[open]')
    const previousStyle = {
      position: body.style.position, top: body.style.top, left: body.style.left,
      width: body.style.width, overflow: body.style.overflow, paddingRight: body.style.paddingRight,
    }

    if (locksBackground) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${(parseFloat(window.getComputedStyle(body).paddingRight) || 0) + scrollbarWidth}px`
      }
      Object.assign(body.style, {
        position: 'fixed', top: `-${scrollY}px`, left: `-${scrollX}px`,
        width: '100%', overflow: 'hidden',
      })
    }

    // The browser traps keyboard focus in the topmost dialog.
    dialog.showModal()
    closeButtonRef.current.focus({ preventScroll: true })

    return () => {
      dialog.close()
      if (locksBackground) {
        Object.assign(body.style, previousStyle)
        window.scrollTo(scrollX, scrollY)
      }
      // Moving an entry to another category can remove its original Edit button.
      const focusTarget = trigger?.isConnected ? trigger : fallbackFocusRef?.current
      focusTarget?.focus({ preventScroll: true })
    }
  }, [returnFocusRef, fallbackFocusRef])

  function closeOutside(event) {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
  }

  return (
    <dialog className={`perfume-modal ${className}`} ref={dialogRef} aria-labelledby={titleId} aria-modal="true" onClick={closeOutside} onCancel={(event) => {
      event.preventDefault()
      onClose()
    }}>
      <div className="modal-toolbar">
        <button className="modal-close" ref={closeButtonRef} aria-label={closeLabel} onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="modal-content">{children}</div>
    </dialog>
  )
}
