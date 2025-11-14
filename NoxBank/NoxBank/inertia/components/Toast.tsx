import { useEffect, useRef } from 'react'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

type ToastProps = {
  show: boolean
  message: string
  type?: ToastType
  duration?: number // ms
  onClose?: () => void
  progressDirection?: 'ltr' | 'rtl'
}

export default function Toast({
  show,
  message,
  type = 'error',
  duration = 4000,
  onClose,
  progressDirection = 'ltr',
}: ToastProps) {
  const timer = useRef<number | null>(null)
  const animationKey = useRef(Date.now())

  useEffect(() => {
    if (!show) return
    // Gera nova key para forçar remontagem da progress bar
    animationKey.current = Date.now()
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      onClose?.()
    }, duration)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [show, duration, onClose])

  const palette = {
    info: { bg: '#2563EB', ring: '#93C5FD' },
    success: { bg: '#16A34A', ring: '#86EFAC' },
    warning: { bg: '#D97706', ring: '#FCD34D' },
    error: { bg: '#DC2626', ring: '#FCA5A5' },
  }[type]

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      className={`toast-wrapper ${show ? 'toast-in' : 'toast-out'}`}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="toast-card"
        style={{
          background: palette.bg,
          boxShadow: `0 10px 25px rgba(0,0,0,.25), 0 0 0 2px ${palette.ring}33 inset`,
        }}
      >
        <div className="toast-content">
          <span className="toast-icon" aria-hidden>
            {type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM9 9h2v6H9V9zm0-4h2v2H9V5z" />
              </svg>
            )}
            {type === 'warning' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2v-6z" />
              </svg>
            )}
          </span>
          <span className="toast-text">{message}</span>
        </div>
        <div className="toast-progress">
          <div
            key={animationKey.current}
            className="toast-progress-bar"
            data-direction={progressDirection}
            style={{
              animationDuration: `${duration}ms`,
              animationDelay: '220ms',
            }}
          />
        </div>
      </div>
    </div>
  )
}
