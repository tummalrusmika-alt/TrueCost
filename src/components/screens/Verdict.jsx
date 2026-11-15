
import Card from '../ui/Card'
import Button from '../ui/Button'
import { verdictStyles } from '../ui/verdictStyles'

function formatRupees(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) return '—'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

function formatPercent(value) {
  if (value === null || value === undefined) return null

  const number = Number(value)
  return Number.isFinite(number) ? `${number.toFixed(2)}%` : '—'
}

function Verdict({ result, onBack }) {
  if (!result) {
    return <div className="min-h-screen bg-page p-8">No verdict available.</div>
  }

  const style = verdictStyles[result.verdict] || verdictStyles.Avoid

  return (
    <div className="min-h-screen bg-page font-sans text-ink">

      <header className="bg-white border-b border-line">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <h1 className="text-2xl font-bold text-brand">TrueCost</h1>
          <p className="text-sm text-muted">Loan affordability analysis</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <p className="text-sm font-semibold text-brand uppercase tracking-wider">
          Final Analysis
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mt-2">
          Your Loan Verdict
        </h2>

        <p className="text-muted mt-2 mb-8">
          Here is what your loan calculation tells you.
        </p>

        {/* Verdict card */}
        <div className={`rounded-2xl border-2 p-7 sm:p-10 ${style.box}`}>
          <p className="text-sm font-semibold uppercase tracking-wider">
            Our Assessment
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl font-bold">
              {style.icon}
            </span>

            <h3 className="text-4xl sm:text-5xl font-extrabold">
              {result.verdict}
            </h3>
          </div>

          <p className="mt-4">
            Based on your income, expenses and monthly EMI.
          </p>
        </div>

        {/* Affordability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">

          <Card>
            <p className="text-sm text-muted">Money Left Monthly</p>
            <h3 className="text-2xl font-bold mt-3">
              {formatRupees(result.moneyLeft)}
            </h3>
          </Card>

          <Card>
            <p className="text-sm text-muted">EMI Share of Money Left</p>

            <h3 className="text-2xl font-bold mt-3">
              {result.emiShareOfLeftPercent === null
                ? 'Not available'
                : formatPercent(result.emiShareOfLeftPercent)}
            </h3>

            {result.emiShareOfLeftPercent === null && (
              <p className="text-sm text-muted mt-2">
                No money left after expenses.
              </p>
            )}
          </Card>

        </div>

        {/* Reasons */}
        <Card className="mt-8">
          <h3 className="text-xl font-bold text-ink">
            Why this verdict?
          </h3>

          <ul className="mt-5 space-y-4">
            {(Array.isArray(result.reasons) ? result.reasons : []).map(
              (reason, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="text-brand font-bold">✓</span>
                  <span>{reason}</span>
                </li>
              )
            )}
          </ul>
        </Card>

        {/* Disclaimer */}
        <div className="bg-brand-tint rounded-xl p-5 mt-8">
          <p className="text-sm text-ink">
            <strong>Important:</strong> This is an educational guide,
            not financial advice. Consider your other financial
            commitments before taking a loan.
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={onBack} variant="secondary" block>
            ← Back to Loan Results
          </Button>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </main>
    </div>
  )
}

export default Verdict
