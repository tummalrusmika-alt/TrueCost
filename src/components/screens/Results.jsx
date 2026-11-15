
import Card from '../ui/Card'
import Button from '../ui/Button'

function Results({ result, onBack }) {
  if (!result) {
    return (
      <div className="min-h-screen bg-page p-6 font-sans">
        <Card>
          <p className="text-ink">
            No calculation results available.
          </p>
          <Button onClick={onBack} className="mt-4">
            Back to Loan Details
          </Button>
        </Card>
      </div>
    )
  }

  // Format values for display only
  const formatRupees = (value) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return '—'
    }

    return `₹${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`
  }

  const formatPercent = (value) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return '—'
    }

    return `${value.toFixed(2)}%`
  }

  const resultItems = [
    {
      label: 'Monthly EMI',
      value: formatRupees(result.emi),
    },
    {
      label: 'Total Interest',
      value: formatRupees(result.totalInterest),
    },
    {
      label: 'Fees',
      value: formatRupees(result.fees),
    },
    {
      label: 'GST on Fees',
      value: formatRupees(result.gstAmount),
    },
    {
      label: 'Total Amount Paid',
      value: formatRupees(result.totalPaid),
    },
    {
      label: 'Actual Money Received',
      value: formatRupees(result.moneyReceived),
    },
    {
      label: 'Effective Annual Rate',
      value: formatPercent(result.effectiveRatePercent),
    },
  ]

  return (
    <div className="min-h-screen bg-page px-4 sm:px-6 py-10 font-sans">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand">
            Your Loan Results
          </h1>

          <p className="text-muted mt-2">
            Understand what your loan actually costs.
          </p>
        </div>

        {/* Hidden extra highlight */}
        <Card className="mb-6">
          <p className="text-sm font-semibold text-muted">
            Hidden Extra Cost
          </p>

          <div className="w-12 h-1 bg-accent rounded-full mt-3 mb-4" />

          <h2 className="text-4xl sm:text-5xl font-bold text-ink">
            {formatRupees(result.hiddenExtra)}
          </h2>

          <p className="text-sm text-muted mt-3">
            Additional amount paid beyond the advertised interest.
          </p>
        </Card>

        {/* Main results */}
        <Card className="mb-6">

          <h2 className="text-xl font-bold text-ink mb-6">
            Loan Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {resultItems.map((item) => (
              <div
                key={item.label}
                className="bg-page rounded-lg p-4"
              >
                <p className="text-sm text-muted">
                  {item.label}
                </p>

                <p className="text-xl font-bold text-ink mt-2 break-words">
                  {item.value}
                </p>
              </div>
            ))}

          </div>

          {/* Annualization method */}
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm text-muted">
              Annualization Method
            </p>

            <p className="font-medium text-ink mt-1">
              {result.annualizationMethod || 'Not provided'}
            </p>

            <p className="text-xs text-muted mt-2">
              Effective annual rate (monthly IRR × 12)
            </p>
          </div>

        </Card>

        {/* Assumptions */}
        <Card className="mb-6 bg-brand-tint">

          <h2 className="text-xl font-bold text-brand mb-4">
            Calculation Assumptions
          </h2>

          {Array.isArray(result.assumptions) &&
          result.assumptions.length > 0 ? (
            <ul className="space-y-3">
              {result.assumptions.map((assumption, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm text-ink"
                >
                  <span className="text-brand font-bold">
                    ✓
                  </span>

                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              No assumptions provided.
            </p>
          )}

        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">

          <Button
            variant="secondary"
            onClick={onBack}
            block
          >
            Back to Loan Details
          </Button>

        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default Results
