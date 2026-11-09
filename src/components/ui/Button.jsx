
function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}) {
  const base =
    'px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const styles = {
    primary: 'bg-brand hover:bg-brand-dark text-white',
    secondary: 'bg-white border border-line text-ink hover:bg-page',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant] || styles.primary}`}
    >
      {children}
    </button>
  )
}

export default Button
