function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-soft w-full max-w-md p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink text-sm">
            Đóng
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;