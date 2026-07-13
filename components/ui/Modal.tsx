'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  body: string
  cancelLabel?: string
  confirmLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

export function Modal({
  open,
  onClose,
  onConfirm,
  title,
  body,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${open ? styles.dialogOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
