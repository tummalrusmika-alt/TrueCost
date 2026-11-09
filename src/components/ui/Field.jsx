
function Field({
  label,
  value,
  onChange,
  error,
  type = 'number',
  placeholder = '',
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
        className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />

      {error && (
        <p className="mt-1 text-sm text-bad-text">
          {error}
        </p>
      )}
    </div>
  )
}

export default Field
