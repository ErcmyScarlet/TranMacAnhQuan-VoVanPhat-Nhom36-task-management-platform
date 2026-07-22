function FormField({ label, error, helper, children, id }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : helper ? (
        <p className="text-sm text-muted">{helper}</p>
      ) : null}
    </div>
  );
}

export default FormField;