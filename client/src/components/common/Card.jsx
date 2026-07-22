function Card({ children, className = "" }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-soft p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;