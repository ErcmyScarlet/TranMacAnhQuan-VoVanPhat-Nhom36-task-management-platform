function Input({ className = "", error, ...props }) {
  const base = "w-full px-3.5 py-2.5 rounded-xl border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors";
  const border = error ? "border-danger" : "border-border focus:border-accent";
  return <input className={`${base} ${border} ${className}`} {...props} />;
}

export default Input;