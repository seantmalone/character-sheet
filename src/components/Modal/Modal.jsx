import styles from './Modal.module.css'

export default function Modal({ open, title, onClose, children, size = 'md' }) {
  if (!open) return null
  return (
    <div className={styles.backdrop} data-testid="modal-backdrop" onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {onClose && (
            <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
