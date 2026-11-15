
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { checkScamRules } from '../../logic/scamRules'
import { riskStyles } from '../ui/verdictStyles'

function ScamCheck({ onBack }) {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCheck = (e) => {
    e.preventDefault()

    setError('')
    setResult(null)

    if (!message.trim()) {
      setError('Please enter a loan message.')
      return
    }

    if (message.length > 3000) {
      setError('Message cannot exceed 3000 characters.')
      return
    }

    try {
      const scamResult = checkScamRules(message)
      setResult(scamResult)
    } catch (err) {
      setError(err.message || 'Unable to check this message.')
    }
  }

  const styles = result
    ? riskStyles[result.riskLevel]
    : null

  return (
    <div className="min-h-screen bg-page text-ink font-sans">

      {/* Header */}
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand">
              TrueCost
            </h1>
            <p className="text-sm text-muted">
              Protect yourself from suspicious loan offers.
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← Home
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <span className="inline-block bg-brand-tint text-brand rounded-full px-4 py-2 text-xs font-bold">
            SCAM PROTECTION
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold mt-4">
            Check a Loan Message
          </h2>

          <p className="text-muted mt-3">
            Paste a suspicious loan message below. TrueCost
            will look for common warning signs.
          </p>
        </div>

        {/* Input */}
        <Card>
          <form onSubmit={handleCheck}>
            <label className="block font-semibold mb-3">
              Paste your loan message
            </label>

            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setResult(null)
                setError('')
              }}
              maxLength={3000}
              rows={7}
              placeholder="Example: Congratulations! Your loan is approved. Pay a processing fee immediately to receive your loan..."
              className="w-full border border-line rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand resize-y"
            />

            <div className="flex justify-between text-xs text-muted mt-2">
              <span>Do not include passwords or OTPs.</span>
              <span>{message.length}/3000</span>
            </div>

            {error && (
              <p role="alert" className="text-bad-text text-sm mt-3">
                {error}
              </p>
            )}

            <div className="mt-6">
              <Button type="submit" block>
                Check Message →
              </Button>
            </div>
          </form>
        </Card>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Risk result */}
            <Card>
              <p className="text-sm text-muted font-medium">
                SCAM RISK ASSESSMENT
              </p>

              <div className={`mt-4 rounded-xl border p-6 ${styles?.box || ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">
                    {styles?.icon}
                  </span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Risk Level
                    </p>

                    <h3 className="text-3xl font-bold">
                      {result.riskLevel} Risk
                    </h3>
                  </div>
                </div>
              </div>
            </Card>

            {/* Red flags */}
            <Card>
              <h3 className="text-xl font-bold text-ink">
                Detected Warning Signs
              </h3>

              {result.redFlags.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="text-bad-text font-bold">!</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-good-text mt-4">
                  No warning signs detected by the current rules.
                </p>
              )}
            </Card>

            {/* Explanation */}
            {result.explanation && (
              <Card>
                <h3 className="text-xl font-bold text-brand">
                  Explanation
                </h3>
                <p className="text-muted mt-3 leading-relaxed">
                  {result.explanation}
                </p>
              </Card>
            )}

            {/* Next steps */}
            <Card>
              <h3 className="text-xl font-bold text-brand">
                What Should You Do?
              </h3>

              <ul className="mt-4 space-y-3">
                {result.nextSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="text-brand font-bold">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <button
              onClick={() => {
                setMessage('')
                setResult(null)
                setError('')
              }}
              className="w-full border border-line bg-white rounded-xl py-3 font-semibold text-brand hover:bg-brand-tint"
            >
              Check Another Message
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-okay-bg rounded-xl p-5 mt-8">
          <p className="text-sm text-okay-text">
            <strong>Important:</strong> This is a guide, not proof.
            Always verify with your bank.
          </p>
        </div>

        <p className="text-center text-xs text-muted mt-8">
          Educational tool, not financial advice.
        </p>

      </main>
    </div>
  )
}

export default ScamCheck
