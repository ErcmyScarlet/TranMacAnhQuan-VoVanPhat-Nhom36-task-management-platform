function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;