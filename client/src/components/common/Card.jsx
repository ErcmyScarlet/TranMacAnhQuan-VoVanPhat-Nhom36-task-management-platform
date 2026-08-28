function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-2xl shadow-soft p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;