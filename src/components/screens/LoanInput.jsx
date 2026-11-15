
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
  const [success, setSuccess] = useState(false)

  // Handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setSuccess(false)
  }

  // Validate all loan details
  const validate = () => {
    const newErrors = {}

    // Check empty and negative values
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

    // Loan amount must be greater than zero
    if (
      form.amount !== '' &&
      Number(form.amount) <= 0
    ) {
      newErrors.amount = 'Loan amount must be above 0'
    }

    // Tenure must be greater than zero
    if (
      form.tenureMonths !== '' &&
      Number(form.tenureMonths) <= 0
    ) {
      newErrors.tenureMonths = 'Tenure must be above 0'
    }

    // Monthly income must be greater than zero
    if (
      form.monthlyIncome !== '' &&
      Number(form.monthlyIncome) <= 0
    ) {
      newErrors.monthlyIncome =
        'Monthly income must be above 0'
    }

    // Monthly expenses cannot exceed monthly income
    if (
      form.monthlyIncome !== '' &&
      form.monthlyExpenses !== '' &&
      Number.isFinite(Number(form.monthlyIncome)) &&
      Number.isFinite(Number(form.monthlyExpenses)) &&
      Number(form.monthlyExpenses) > Number(form.monthlyIncome)
    ) {
      newErrors.monthlyExpenses =
        'Monthly expenses cannot be greater than monthly income'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    setSuccess(false)

    if (validate()) {
      setSuccess(true)

      console.log('Validated loan details:', form)
    }
  }

  // Form fields
  const fields = [
    {
      name: 'amount',
      label: 'Loan Amount (₹)',
      placeholder: 'Example: 50000',
    },
    {
      name: 'tenureMonths',
      label: 'Loan Tenure (Months)',
      placeholder: 'Example: 12',
    },
    {
      name: 'annualRatePercent',
      label: 'Annual Interest Rate (%)',
      placeholder: 'Example: 12',
    },
    {
      name: 'processingFee',
      label: 'Processing Fee (₹)',
      placeholder: 'Example: 1000',
    },
    {
      name: 'gstOnFeesPercent',
      label: 'GST on Fees (%)',
      placeholder: 'Example: 18',
    },
    {
      name: 'otherCharges',
      label: 'Other Charges (₹)',
      placeholder: 'Example: 0',
    },
    {
      name: 'monthlyIncome',
      label: 'Monthly Income (₹)',
      placeholder: 'Enter monthly income',
    },
    {
      name: 'monthlyExpenses',
      label: 'Monthly Expenses (₹)',
      placeholder: 'Enter monthly expenses',
    },
  ]

  return (
    <div className="min-h-screen bg-page px-4 sm:px-6 py-10 font-sans">

      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-brand">
          Loan Details
        </h1>

        <p className="text-muted mt-2">
          Enter your loan details to understand its true cost.
        </p>

        {/* Loan form */}
        <form onSubmit={handleSubmit} noValidate>

          <Card className="mt-8">

            <h2 className="text-xl font-semibold text-ink mb-6">
              Loan Information
            </h2>

            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {fields.map((field) => (
                <Field
                  key={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={(value) =>
                    handleChange(field.name, value)
                  }
                  error={errors[field.name]}
                  placeholder={field.placeholder}
                  type="number"
                  step="any"
                  min="0"
                />
              ))}

            </div>

            {/* Submit button */}
            <div className="mt-8">
              <Button type="submit" block>
                Validate Loan Details
              </Button>
            </div>

            {/* Success message */}
            {success && (
              <div className="mt-5 p-4 rounded-lg bg-good-bg border border-good-line text-good-text">
                <p className="font-semibold">
                  Loan details validated successfully!
                </p>

                <p className="text-sm mt-1">
                  Your information is ready for calculation integration.
                </p>
              </div>
            )}

          </Card>

        </form>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default LoanInput
