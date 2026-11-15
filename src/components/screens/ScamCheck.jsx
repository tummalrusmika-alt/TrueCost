
import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'

import { checkScamRules } from '../../logic/scamRules'
import { explainScam } from '../../api/ai'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiError, setAiError] = useState('')

  const handleCheck = async () => {
    setError('')
    setAiError('')
    setResult(null)

    if (!message.trim()) {
      setError('Please enter a loan message.')
      return
    }

    if (message.length > 3000) {
      setError('Message cannot exceed 3000 characters.')
      return
    }

    // Run B's rule-based detection first
    let ruleResult

    try {
      ruleResult = checkScamRules(message)

      if (
        !ruleResult ||
        !['Low', 'Medium', 'High'].includes(ruleResult.riskLevel) ||
        !Array.isArray(ruleResult.redFlags) ||
        !Array.isArray(ruleResult.nextSteps)
      ) {
        throw new Error('Invalid scam result.')
      }

      // Display rule result immediately
      setResult(ruleResult)
    } catch (err) {
      console.error('Scam rules error:', err)
      setError('Unable to check this message. Please try again.')
      return
    }

    // Get AI explanation without blocking rule result
    setLoading(true)

    try {
      const aiResult = await explainScam(
        message,
        ruleResult,
        'en'
      )

      if (aiResult?.error) {
        setAiError(aiResult.message)
      } else if (aiResult?.text) {
        setResult({
          ...ruleResult,
          explanation: aiResult.text,
        })
      }
    } catch (err) {
      console.error('AI explanation error:', err)
      setAiError('AI explanation unavailable. Rule-based result is still available.')
    } finally {
      setLoading(false)
    }
  }

  const style = result
    ? riskStyles[result.riskLevel]
    : null

  return (
    <div className="min-h-screen bg-page px-4 py-10 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">

        <Button variant="secondary" onClick={onBack}>
          ← Back to Home
        </Button>

        <h1 className="text-3xl font-bold text-brand mt-8">
          Scam Detection
        </h1>

        <p className="text-muted mt-2">
          Check suspicious loan messages for possible warning signs.
        </p>

        <Card className="mt-8">
          <label className="block font-semibold text-ink mb-3">
            Loan Message
          </label>

          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setResult(null)
              setError('')
              setAiError('')
            }}
            maxLength={3000}
            rows={7}
            placeholder="Paste your loan message here..."
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          <p className="text-right text-sm text-muted mt-2">
            {message.length}/3000 characters
          </p>

          {error && (
            <p className="mt-3 text-sm text-bad-text">
              {error}
            </p>
          )}

          <div className="mt-5">
            <Button
              block
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Message'}
            </Button>
          </div>
        </Card>

        {result && (
          <div className="mt-8 space-y-6">

            {/* Risk assessment */}
            <Card className={`border-2 ${style.box}`}>
              <p className="text-sm font-semibold uppercase">
                Loan Risk Assessment
              </p>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-4xl font-bold">
                  {style.icon}
                </span>

                <h2 className="text-4xl font-bold">
                  {result.riskLevel}
                </h2>
              </div>
            </Card>

            {/* Red flags */}
            <Card>
              <h2 className="text-xl font-bold text-ink">
                Red Flags
              </h2>

              {result.redFlags.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex gap-3 text-muted">
                      <span className="text-bad-text font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mt-3">
                  No specific red flags were identified by the rules.
                  This does not mean the message is safe.
                </p>
              )}
            </Card>

            {/* Next steps */}
            <Card>
              <h2 className="text-xl font-bold text-ink">
                Recommended Next Steps
              </h2>

              <ul className="mt-4 space-y-3">
                {result.nextSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-muted">
                    <span className="text-brand font-bold">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* AI explanation */}
            <Card>
              <h2 className="text-xl font-bold text-brand">
                AI Explanation
              </h2>

              {loading ? (
                <p className="text-muted mt-3">
                  AI is analysing the warning signs...
                </p>
              ) : result.explanation ? (
                <p className="text-muted mt-3">
                  {result.explanation}
                </p>
              ) : (
                <p className="text-muted mt-3">
                  AI explanation is unavailable. The rule-based result is still displayed.
                </p>
              )}

              {aiError && (
                <p className="text-sm text-bad-text mt-3">
                  {aiError}
                </p>
              )}
            </Card>

          </div>
        )}

        <p className="text-center text-sm text-muted mt-10">
          This is a guide, not proof. Always verify with your bank.
        </p>

        <p className="text-center text-xs text-muted mt-2">
          Educational tool, not financial advice.
        </p>

      </div>
    </div>
  )
}

export default ScamCheck
