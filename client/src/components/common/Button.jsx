function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90",
    secondary: "bg-surface border border-border text-ink hover:bg-bg",
    danger: "bg-danger text-white hover:bg-danger/90",
    ghost: "text-muted hover:text-ink hover:bg-bg",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;