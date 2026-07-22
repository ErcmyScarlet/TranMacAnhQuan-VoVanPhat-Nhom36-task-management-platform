const styles = {
  todo: "bg-bg text-muted border-border",
  doing: "bg-warning/10 text-warning border-warning/20",
  done: "bg-success/10 text-success border-success/20",
  low: "bg-bg text-muted border-border",
  medium: "bg-accent-soft text-accent border-accent/20",
  high: "bg-danger/10 text-danger border-danger/20",
};

function Badge({ children, tone = "todo" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[tone]}`}>
      {children}
    </span>
  );
}

export default Badge;