
import Card from '../ui/Card'
import Button from '../ui/Button'

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
  const number = Number(value)

  if (!Number.isFinite(number)) return '—'

  return `${number.toFixed(2)}%`
}

function Results({ result, onBack, onShowVerdict }) {
  if (!result) {
    return (
      <div className="min-h-screen bg-page p-8">
        <p className="text-ink">No calculation result available.</p>
        <Button onClick={onBack}>Back</Button>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Monthly EMI',
      value: formatRupees(result.emi),
      description: 'Your monthly instalment',
    },
    {
      label: 'Total Interest',
      value: formatRupees(result.totalInterest),
      description: 'Interest over the loan tenure',
    },
    {
      label: 'Processing Fees & Charges',
      value: formatRupees(result.fees),
      description: 'Upfront loan charges',
    },
    {
      label: 'GST on Fees',
      value: formatRupees(result.gstAmount),
      description: 'GST applied to processing fee',
    },
    {
      label: 'Total Amount Paid',
      value: formatRupees(result.totalPaid),
      description: 'Your total repayment',
    },
    {
      label: 'Money Received',
      value: formatRupees(result.moneyReceived),
      description: 'Amount received after upfront deductions',
    },
    {
      label: 'Effective Annual Rate',
      value: formatPercent(result.effectiveRatePercent),
      description: result.annualizationMethod || 'Monthly IRR × 12',
    },
  ]

  return (
    <div className="min-h-screen bg-page text-ink font-sans">

      {/* Header */}
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand">
            TrueCost
          </h1>

          <span className="text-sm text-muted">
            Loan Analysis
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Title */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand uppercase tracking-wider">
            Your Loan Report
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Loan Results
          </h2>

          <p className="text-muted mt-2">
            Here is the complete breakdown of your loan.
          </p>
        </div>

        {/* Highlight */}
        <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <p className="text-sm text-white/80">
            Hidden Extra Cost
          </p>

          <h3 className="text-3xl sm:text-4xl font-bold mt-2">
            {formatRupees(result.hiddenExtra)}
          </h3>

          <p className="text-sm text-white/80 mt-3">
            Additional charges beyond the advertised interest.
          </p>

          <div className="h-1 w-16 bg-accent rounded-full mt-5" />
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {metrics.map((item) => (
            <Card key={item.label}>
              <p className="text-sm text-muted">
                {item.label}
              </p>

              <h3 className="text-xl sm:text-2xl font-bold text-ink mt-3 break-words">
                {item.value}
              </h3>

              <p className="text-xs text-muted mt-2">
                {item.description}
              </p>
            </Card>
          ))}

        </div>

        {/* Assumptions */}
        <div className="bg-brand-tint border border-brand/20 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-brand">
            Calculation Assumptions
          </h3>

          <ul className="mt-4 space-y-3">
            {(Array.isArray(result.assumptions)
              ? result.assumptions
              : []
            ).map((item, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm text-ink"
              >
                <span className="text-brand font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted mt-8">
          Educational tool, not financial advice.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={onBack}
            variant="secondary"
            block
          >
            ← Edit Loan Details
          </Button>

          <Button
            onClick={onShowVerdict}
            block
          >
            View Loan Verdict →
          </Button>
        </div>

      </main>
    </div>
  )
}

export default Results
