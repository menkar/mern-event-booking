import { useEffect } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Button from './Button';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const iconStyles = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    primary: 'bg-indigo-100 text-indigo-600',
  };

  const confirmVariant = variant === 'primary' ? 'primary' : 'danger';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-slate-900/60 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={loading ? undefined : onCancel}
        disabled={loading}
      />

      <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconStyles[variant] || iconStyles.danger}`}
            >
              <FaExclamationTriangle className="text-lg" />
            </div>
            <div>
              <h2
                id="confirm-modal-title"
                className="text-lg font-bold text-slate-900 sm:text-xl"
              >
                {title}
              </h2>
              {message && (
                <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {message}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {description && (
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-700">{description}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
