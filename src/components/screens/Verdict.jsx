
import Card from '../ui/Card'
import Button from '../ui/Button'

const verdictStyles = {
  Good: {
    box: 'bg-good-bg text-good-text border-good-line',
    icon: '✓',
  },
  Okay: {
    box: 'bg-okay-bg text-okay-text border-okay-line',
    icon: '!',
  },
  Avoid: {
    box: 'bg-bad-bg text-bad-text border-bad-line',
    icon: '✕',
  },
}

function Verdict({ result, onBack, explanation = '' }) {
  if (!result) {
    return <p className="p-6">No verdict data available.</p>
  }

  const style = verdictStyles[result.verdict] || verdictStyles.Okay

  const formatRupees = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

  return (
    <div className="min-h-screen bg-page px-4 py-8 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        <Button variant="secondary" onClick={onBack}>
          ← Back to Results
        </Button>

        <h1 className="text-3xl font-bold text-brand mt-8">
          Loan Verdict
        </h1>

        <p className="text-muted mt-2">
          Understand what this loan means for your monthly finances.
        </p>

        {/* Verdict card */}
        <Card className={`mt-8 border-2 ${style.box}`}>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Loan assessment
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-4xl font-bold">
              {style.icon}
            </span>

            <h2 className="text-4xl font-bold">
              {result.verdict}
            </h2>
          </div>
        </Card>

        {/* Money left */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">

          <Card>
            <p className="text-sm text-muted">
              Money left after expenses
            </p>

            <p className="text-2xl font-bold text-brand mt-3">
              {formatRupees(result.moneyLeft)}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-muted">
              EMI share of money left
            </p>

            <p className="text-2xl font-bold text-brand mt-3">
              {result.emiShareOfLeftPercent == null
                ? 'N/A'
                : `${result.emiShareOfLeftPercent.toFixed(2)}%`}
            </p>

            {result.emiShareOfLeftPercent == null && (
              <p className="text-sm text-muted mt-2">
                No money left after expenses.
              </p>
            )}
          </Card>

        </div>

        {/* Reasons */}
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-ink">
            Reasons for this verdict
          </h2>

          <ul className="mt-4 space-y-3">
            {(result.reasons || []).map((reason, index) => (
              <li key={index} className="flex gap-3 text-muted">
                <span className="text-brand font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* AI Explanation */}
        {explanation && (
          <Card className="mt-6">
            <h2 className="text-xl font-bold text-brand">
              Explanation
            </h2>

            <p className="text-muted mt-3 leading-relaxed">
              {explanation}
            </p>
          </Card>
        )}

        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default Verdict
