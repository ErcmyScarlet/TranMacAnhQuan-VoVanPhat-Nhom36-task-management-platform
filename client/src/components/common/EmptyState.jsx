function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-accent-soft mb-4" />
      <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;