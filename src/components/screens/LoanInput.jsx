
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { calculateLoan } from '../../logic/calculate'

const initialForm = {
  amount: '50000',
  tenureMonths: '12',
  annualRatePercent: '12',
  processingFee: '1000',
  gstOnFeesPercent: '18',
  otherCharges: '0',
  monthlyIncome: '30000',
  monthlyExpenses: '20000',
}

function LoanInput({ onSubmitSuccess, onBack }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setSubmitError('')
  }

  const validate = () => {
    const newErrors = {}

    Object.entries(form).forEach(([key, value]) => {
      if (value.trim() === '') {
        newErrors[key] = 'This field is required'
      } else if (
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
      ) {
        newErrors[key] = 'Enter a valid non-negative number'
      }
    })

    if (Number(form.amount) <= 0) {
      newErrors.amount = 'Loan amount must be above zero'
    }

    if (
      Number(form.tenureMonths) <= 0 ||
      !Number.isInteger(Number(form.tenureMonths))
    ) {
      newErrors.tenureMonths = 'Enter a whole number of months above zero'
    }

    if (Number(form.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be above zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validate()) return

    const terms = {
      amount: Number(form.amount),
      tenureMonths: Number(form.tenureMonths),
      annualRatePercent: Number(form.annualRatePercent),
      processingFee: Number(form.processingFee),
      gstOnFeesPercent: Number(form.gstOnFeesPercent),
      otherCharges: Number(form.otherCharges),
    }

    const affordability = {
      monthlyIncome: Number(form.monthlyIncome),
      monthlyExpenses: Number(form.monthlyExpenses),
    }

    try {
      const result = calculateLoan(terms, affordability)

      if (typeof onSubmitSuccess === 'function') {
        onSubmitSuccess(result)
      }
    } catch (error) {
      setSubmitError(
        error.message || 'Unable to calculate your loan. Please check your inputs.'
      )
    }
  }

  const loanFields = [
    { name: 'amount', label: 'Loan Amount (₹)', placeholder: '50000' },
    { name: 'tenureMonths', label: 'Loan Tenure (Months)', placeholder: '12' },
    { name: 'annualRatePercent', label: 'Annual Interest Rate (%)', placeholder: '12' },
    { name: 'processingFee', label: 'Processing Fee (₹)', placeholder: '1000' },
    { name: 'gstOnFeesPercent', label: 'GST on Fees (%)', placeholder: '18' },
    { name: 'otherCharges', label: 'Other Charges (₹)', placeholder: '0' },
  ]

  const moneyFields = [
    { name: 'monthlyIncome', label: 'Monthly Income (₹)', placeholder: '30000' },
    { name: 'monthlyExpenses', label: 'Monthly Expenses (₹)', placeholder: '20000' },
  ]

  const renderFields = (fields) =>
    fields.map((field) => (
      <Field
        key={field.name}
        label={field.label}
        value={form[field.name]}
        onChange={(value) => handleChange(field.name, value)}
        error={errors[field.name]}
        placeholder={field.placeholder}
      />
    ))

  return (
    <div className="min-h-screen bg-page text-ink font-sans">

      {/* Header */}
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand">TrueCost</h1>
            <p className="text-sm text-muted">
              Understand your loan before you borrow.
            </p>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold text-brand hover:text-brand-dark"
            >
              ← Home
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <span className="inline-block bg-brand-tint text-brand rounded-full px-4 py-2 text-xs font-bold">
            LOAN ANALYSIS
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold mt-4">
            Enter Your Loan Details
          </h2>

          <p className="text-muted mt-2">
            Provide your loan terms and monthly financial details
            to calculate the true cost.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Loan details */}
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-brand">
                01. Loan Information
              </h3>

              <p className="text-sm text-muted mt-1">
                Enter the terms offered by your lender.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderFields(loanFields)}
            </div>
          </Card>

          {/* Financial details */}
          <Card className="mt-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-brand">
                02. Monthly Financial Details
              </h3>

              <p className="text-sm text-muted mt-1">
                Help us understand whether you can afford this EMI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderFields(moneyFields)}
            </div>
          </Card>

          {/* Error */}
          {submitError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-bad-line bg-bad-bg text-bad-text p-4 text-sm"
            >
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8">
            <Button type="submit" block>
              Calculate My Loan →
            </Button>
          </div>

        </form>

        <div className="bg-brand-tint rounded-xl p-5 mt-8">
          <p className="text-sm text-ink">
            <strong>Privacy reminder:</strong> Use sample data for
            testing. Never enter real bank passwords, OTPs or PINs.
          </p>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </main>
    </div>
  )
}

export default LoanInput
