
import Card from '../ui/Card'
import Button from '../ui/Button'

function Results({ result, onBack, onShowVerdict }) {

  if (!result) {
    return (
      <div className="min-h-screen bg-page p-6">
        <h1 className="text-xl font-bold text-bad-text">
          No calculation result available.
        </h1>
        <Button onClick={onBack}>Back to Loan Details</Button>
      </div>
    )
  }

  const formatRupees = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

  const formatPercent = (value) =>
    `${Number(value).toFixed(2)}%`

  const resultFields = [
    { label: 'Monthly EMI', value: formatRupees(result.emi) },
    { label: 'Total Interest', value: formatRupees(result.totalInterest) },
    { label: 'Processing Fees and Charges', value: formatRupees(result.fees) },
    { label: 'GST on Fees', value: formatRupees(result.gstAmount) },
    { label: 'Hidden Extra Cost', value: formatRupees(result.hiddenExtra) },
    { label: 'Total Amount Paid', value: formatRupees(result.totalPaid) },
    { label: 'Money Received', value: formatRupees(result.moneyReceived) },
    {
      label: 'Effective Annual Rate',
      value: formatPercent(result.effectiveRatePercent),
    },
  ]

  return (
    <div className="min-h-screen bg-page px-4 py-10 sm:px-6 font-sans">

      <div className="max-w-3xl mx-auto">

        <Button variant="secondary" onClick={onBack}>
          ← Back to Loan Details
        </Button>

        <h1 className="text-3xl font-bold text-brand mt-8">
          Loan Results
        </h1>

        <p className="text-muted mt-2">
          Here is the breakdown of your loan.
        </p>

        {/* Result fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">

          {resultFields.map((item) => (
            <Card key={item.label}>
              <p className="text-sm text-muted">
                {item.label}
              </p>

              <p className="text-xl font-bold text-ink mt-3">
                {item.value}
              </p>

              {item.label === 'Effective Annual Rate' && (
                <p className="text-xs text-muted mt-2">
                  {result.annualizationMethod}
                </p>
              )}
            </Card>
          ))}

        </div>

        {/* Assumptions */}
        <Card className="mt-6 bg-brand-tint">
          <h2 className="text-xl font-bold text-brand">
            Calculation Assumptions
          </h2>

          <ul className="mt-4 space-y-2">
            {(result.assumptions || []).map((item, index) => (
              <li key={index} className="text-sm text-ink">
                • {item}
              </li>
            ))}
          </ul>
        </Card>

        {/* Verdict navigation */}
        <div className="mt-8">
          <Button
            block
            onClick={onShowVerdict}
          >
            View Loan Verdict →
          </Button>
        </div>

        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default Results
