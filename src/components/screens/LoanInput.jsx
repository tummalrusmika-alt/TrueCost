
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Field from '../ui/Field'

function LoanInput() {
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
  }

  const validate = () => {
    const newErrors = {}

    Object.entries(form).forEach(([key, value]) => {
      if (value.trim() === '') {
        newErrors[key] = 'This field is required'
      } else if (!Number.isFinite(Number(value)) || Number(value) < 0) {
        newErrors[key] = 'Enter a valid non-negative number'
      }
    })

    if (Number(form.amount) <= 0) {
      newErrors.amount = 'Loan amount must be above 0'
    }

    if (Number(form.tenureMonths) <= 0) {
      newErrors.tenureMonths = 'Tenure must be above 0'
    }

    if (Number(form.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be above 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      alert('All loan details are valid! Calculation integration comes next.')
    }
  }

  const fields = [
    { name: 'amount', label: 'Loan Amount (₹)' },
    { name: 'tenureMonths', label: 'Loan Tenure (Months)' },
    { name: 'annualRatePercent', label: 'Annual Interest Rate (%)' },
    { name: 'processingFee', label: 'Processing Fee (₹)' },
    { name: 'gstOnFeesPercent', label: 'GST on Fees (%)' },
    { name: 'otherCharges', label: 'Other Charges (₹)' },
    { name: 'monthlyIncome', label: 'Monthly Income (₹)' },
    { name: 'monthlyExpenses', label: 'Monthly Expenses (₹)' },
  ]

  return (
    <div className="min-h-screen bg-page px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand">
          Loan Details
        </h1>

        <p className="text-muted mt-2">
          Enter your loan details to understand its true cost.
        </p>

        <form onSubmit={handleSubmit}>
          <Card className="mt-8">
            <h2 className="text-xl font-semibold mb-6">
              Loan Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map((field) => (
                <Field
                  key={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={(value) => handleChange(field.name, value)}
                  error={errors[field.name]}
                  placeholder="Enter amount"
                />
              ))}
            </div>

            <div className="mt-8">
              <Button type="submit" block>
                Validate Loan Details
              </Button>
            </div>
          </Card>
        </form>

        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>
      </div>
    </div>
  )
}

export default LoanInput
