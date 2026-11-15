
function Field({
  label,
  value,
  onChange,
  error,
  type = 'number',
  placeholder = '',
  step = 'any',
  min = '0',
  max,
}) {
  return (
    <div className="w-full">

      <label className="block text-sm font-medium text-ink mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-ink outline-none transition-colors focus:ring-2 focus:ring-brand/20 ${
          error
            ? 'border-bad-line focus:border-bad-line'
            : 'border-line focus:border-brand'
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-bad-text" role="alert">
          {error}
        </p>
      )}

    </div>
  )
}

export default Field
