
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { checkScamRules } from '../../logic/scamRules'

const riskStyles = {
  Low: {
    box: 'bg-good-bg text-good-text border-good-line',
    icon: '✓',
  },
  Medium: {
    box: 'bg-okay-bg text-okay-text border-okay-line',
    icon: '!',
  },
  High: {
    box: 'bg-bad-bg text-bad-text border-bad-line',
    icon: '✕',
  },
}

function ScamCheck({ onBack }) {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCheck = () => {
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
      setError('Unable to check this message. Please try again.')
      console.error(err)
    }
  }

  const style = result
    ? riskStyles[result.riskLevel] || riskStyles.Medium
    : null

  return (
    <div className="min-h-screen bg-page px-4 py-10 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>

        <h1 className="text-3xl font-bold text-brand mt-8">
          Scam Detection
        </h1>

        <p className="text-muted mt-2">
          Paste a suspicious loan message to identify possible warning signs.
        </p>

        <Card className="mt-8">
          <label className="block font-semibold text-ink mb-3">
            Loan Message
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={3000}
            rows={7}
            placeholder="Paste your loan offer or suspicious message here..."
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <p className="text-right text-sm text-muted mt-2">
            {message.length}/3000 characters
          </p>

          {error && (
            <p className="text-sm text-bad-text mt-2">
              {error}
            </p>
          )}

          <div className="mt-5">
            <Button block onClick={handleCheck}>
              Check Message
            </Button>
          </div>
        </Card>

        {result && (
          <>
            <Card className={`mt-8 border-2 ${style.box}`}>
              <p className="text-sm font-semibold uppercase">
                Risk Assessment
              </p>

              <div className="flex items-center gap-4 mt-3">
                <span className="text-4xl font-bold">
                  {style.icon}
                </span>

                <h2 className="text-4xl font-bold">
                  {result.riskLevel}
                </h2>
              </div>
            </Card>

            <Card className="mt-6">
              <h2 className="text-xl font-bold text-ink">
                Red Flags
              </h2>

              {result.redFlags?.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="text-muted flex gap-3">
                      <span className="text-bad-text font-bold">•</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mt-3">
                  No specific red flags were identified by the rules.
                </p>
              )}
            </Card>

            <Card className="mt-6">
              <h2 className="text-xl font-bold text-ink">
                What should you do?
              </h2>

              <ul className="mt-4 space-y-3">
                {(result.nextSteps || []).map((step, index) => (
                  <li key={index} className="text-muted flex gap-3">
                    <span className="text-brand font-bold">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </Card>

            {result.explanation && (
              <Card className="mt-6">
                <h2 className="text-xl font-bold text-brand">
                  Explanation
                </h2>

                <p className="text-muted mt-3">
                  {result.explanation}
                </p>
              </Card>
            )}
          </>
        )}

        <p className="text-center text-sm text-muted mt-8">
          This is a guide, not proof. Always verify with your bank.
        </p>

      </div>
    </div>
  )
}

export default ScamCheck
