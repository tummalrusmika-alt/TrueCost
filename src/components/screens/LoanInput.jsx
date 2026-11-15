
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Field from '../ui/Field'

function LoanInput({ onSubmitSuccess }) {
  const [form, setForm] = useState({
    amount: '50000',
    tenureMonths: '12',
    annualRatePercent: '12',
    processingFee: '1000',
    gstOnFeesPercent: '18',
    otherCharges: '0',
    monthlyIncome: '',
    monthlyExpenses: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
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

    if (form.amount !== '' && Number(form.amount) <= 0) {
      newErrors.amount = 'Loan amount must be above 0'
    }

    if (form.tenureMonths !== '' && Number(form.tenureMonths) <= 0) {
      newErrors.tenureMonths = 'Tenure must be above 0'
    }

    if (form.monthlyIncome !== '' && Number(form.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be above 0'
    }

    if (
      form.monthlyIncome !== '' &&
      form.monthlyExpenses !== '' &&
      Number(form.monthlyExpenses) > Number(form.monthlyIncome)
    ) {
      newErrors.monthlyExpenses =
        'Monthly expenses cannot exceed monthly income'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    // Calculation integration will be connected here.
    // Do not show sample results as if they were calculated results.
    console.log('Validated loan details:', form)

    if (typeof onSubmitSuccess === 'function') {
      onSubmitSuccess({
        terms: {
          amount: Number(form.amount),
          tenureMonths: Number(form.tenureMonths),
          annualRatePercent: Number(form.annualRatePercent),
          processingFee: Number(form.processingFee),
          gstOnFeesPercent: Number(form.gstOnFeesPercent),
          otherCharges: Number(form.otherCharges),
        },
        affordability: {
          monthlyIncome: Number(form.monthlyIncome),
          monthlyExpenses: Number(form.monthlyExpenses),
        },
      })
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

  const financeFields = [
    { name: 'monthlyIncome', label: 'Monthly Income (₹)', placeholder: '30000' },
    { name: 'monthlyExpenses', label: 'Monthly Expenses (₹)', placeholder: '20000' },
  ]

  const renderFields = (fields) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          value={form[field.name]}
          onChange={(value) => handleChange(field.name, value)}
          error={errors[field.name]}
          placeholder={field.placeholder}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-page px-4 sm:px-6 py-10 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* PAGE HEADING */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-brand">
            LOAN ANALYSIS
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mt-2">
            Enter your loan details
          </h1>

          <p className="text-muted mt-3 leading-relaxed">
            Provide your loan terms and monthly financial details
            to understand the actual cost and affordability.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* LOAN INFORMATION */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-brand-tint flex items-center justify-center text-brand text-xl">
                ₹
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink">
                  Loan Information
                </h2>
                <p className="text-sm text-muted">
                  Enter the details provided by your lender.
                </p>
              </div>
            </div>

            {renderFields(loanFields)}
          </Card>

          {/* FINANCIAL INFORMATION */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                📊
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink">
                  Monthly Financial Details
                </h2>
                <p className="text-sm text-muted">
                  Help us understand your loan affordability.
                </p>
              </div>
            </div>

            {renderFields(financeFields)}
          </Card>

          {/* INFORMATION NOTE */}
          <div className="bg-brand-tint border border-brand/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand leading-relaxed">
              <strong>Note:</strong> Please enter accurate values.
              Your financial information is used to assess affordability.
            </p>
          </div>

          {/* SUBMIT */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" block>
              Calculate My Loan →
            </Button>
          </div>

        </form>

        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default LoanInput
