
import { useState } from 'react'
import { calculateLoan } from '../../logic/calculate'

const initialForm = {
  amount: '50000',
  tenureMonths: '12',
  annualRatePercent: '14',
  processingFee: '999',
  gstOnFeesPercent: '18',
  otherCharges: '0',
  monthlyIncome: '30000',
  monthlyExpenses: '20000'
}

function LoanInput({ onSubmitSuccess, onBack }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))

    setError('')
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
      newErrors.tenureMonths = 'Enter a valid whole number of months'
    }

    if (Number(form.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be above zero'
    }

    if (
      Number(form.monthlyExpenses) > Number(form.monthlyIncome)
    ) {
      newErrors.monthlyExpenses =
        'Expenses cannot exceed monthly income'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (loading) return

    setError('')

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const terms = {
        amount: Number(form.amount),
        tenureMonths: Number(form.tenureMonths),
        annualRatePercent: Number(form.annualRatePercent),
        processingFee: Number(form.processingFee),
        gstOnFeesPercent: Number(form.gstOnFeesPercent),
        otherCharges: Number(form.otherCharges)
      }

      const affordability = {
        monthlyIncome: Number(form.monthlyIncome),
        monthlyExpenses: Number(form.monthlyExpenses)
      }

      const result = calculateLoan(terms, affordability)

      if (!result || !Number.isFinite(result.emi)) {
        throw new Error('Calculation returned an invalid result.')
      }

      console.log('Calculated loan result:', result)

      if (typeof onSubmitSuccess === 'function') {
        onSubmitSuccess(result)
      } else {
        throw new Error('Results screen connection is missing.')
      }

    } catch (err) {
      console.error('Loan calculation error:', err)
      setError(err.message || 'Unable to calculate your loan.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    {
      name: 'amount',
      label: 'Loan Amount',
      suffix: '₹',
      placeholder: '50000'
    },
    {
      name: 'tenureMonths',
      label: 'Loan Tenure',
      suffix: 'Months',
      placeholder: '12'
    },
    {
      name: 'annualRatePercent',
      label: 'Annual Interest Rate',
      suffix: '%',
      placeholder: '14'
    },
    {
      name: 'processingFee',
      label: 'Processing Fee',
      suffix: '₹',
      placeholder: '999'
    },
    {
      name: 'gstOnFeesPercent',
      label: 'GST on Fees',
      suffix: '%',
      placeholder: '18'
    },
    {
      name: 'otherCharges',
      label: 'Other Charges',
      suffix: '₹',
      placeholder: '0'
    },
    {
      name: 'monthlyIncome',
      label: 'Monthly Income',
      suffix: '₹',
      placeholder: '30000'
    },
    {
      name: 'monthlyExpenses',
      label: 'Monthly Expenses',
      suffix: '₹',
      placeholder: '20000'
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans">

      {/* BACKGROUND DESIGN */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />

      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-900 cursor-pointer"
        >
          ← Back to Home
        </button>

        {/* PAGE HEADER */}
        <div className="mb-8">

          <span className="inline-block bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-xs font-bold tracking-wider">
            SMART LOAN ANALYSIS
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-5">
            Calculate Your Loan
          </h1>

          <p className="text-slate-500 mt-3 text-base sm:text-lg">
            Understand your EMI, hidden charges and actual loan cost
            before making a financial decision.
          </p>

        </div>

        {/* FORM CARD */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-5 sm:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              Loan Information
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Enter the details provided by your lender.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* INPUT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

              {fields.map((field, index) => (
                <div key={field.name}>

                  <label
                    htmlFor={field.name}
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    {field.label}
                  </label>

                  <div className="relative">

                    <input
                      id={field.name}
                      type="number"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      min="0"
                      step="any"
                      required
                      className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-14 text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                        errors[field.name]
                          ? 'border-red-400'
                          : 'border-slate-200'
                      }`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                      {field.suffix}
                    </span>

                  </div>

                  {errors[field.name] && (
                    <p className="text-red-600 text-xs mt-2">
                      {errors[field.name]}
                    </p>
                  )}

                </div>
              ))}

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <strong>Calculation Error:</strong> {error}
              </div>
            )}

            {/* CALCULATE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="relative z-20 pointer-events-auto w-full mt-8 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-700/20 transition cursor-pointer"
            >
              {loading ? 'Calculating...' : 'Calculate My Loan →'}
            </button>

          </form>

        </div>

        {/* INFORMATION CARD */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="bg-white/80 border border-slate-200 rounded-2xl p-5">
            <div className="text-teal-700 text-2xl mb-2">₹</div>
            <h3 className="font-bold text-slate-800">
              Transparent Costs
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Understand interest, fees and GST separately.
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200 rounded-2xl p-5">
            <div className="text-teal-700 text-2xl mb-2">✓</div>
            <h3 className="font-bold text-slate-800">
              Affordability Analysis
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Check how your EMI compares with your available monthly money.
            </p>
          </div>

        </div>

        {/* DISCLAIMER */}
        <p className="text-center text-xs text-slate-500 mt-10">
          TrueCost is an educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default LoanInput
