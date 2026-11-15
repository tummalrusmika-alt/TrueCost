
import { useState } from 'react'

import LoanInput from './components/screens/LoanInput'
import Results from './components/screens/Results'
import Verdict from './components/screens/Verdict'
import ScamCheck from './components/screens/ScamCheck'

import { sampleCalculationResult } from './data/sampleData'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-page text-ink font-sans">

        <header className="bg-white border-b border-line">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <h1 className="text-2xl font-bold text-brand">
              TrueCost
            </h1>
            <p className="text-sm text-muted mt-1">
              Understand your loan before you borrow.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">

          <section className="text-center">

            <span className="inline-block bg-brand-tint text-brand rounded-full px-4 py-2 text-sm font-semibold">
              Smart Loan Analysis
            </span>

            <h2 className="text-4xl font-bold mt-6">
              Know the true cost of your loan.
            </h2>

            <p className="text-muted mt-4 text-lg">
              Calculate your EMI, understand hidden charges,
              check affordability and identify suspicious loan offers.
            </p>

            <button
              onClick={() => setCurrentScreen('loan')}
              className="mt-8 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl"
            >
              Get Started
            </button>

          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">

            <div className="bg-white border border-line rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-brand">
                Loan Calculator
              </h3>
              <p className="text-muted mt-3 text-sm">
                Calculate EMI, interest, fees and the actual amount you receive.
              </p>
            </div>

            <div className="bg-white border border-line rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-brand">
                Affordability Check
              </h3>
              <p className="text-muted mt-3 text-sm">
                Understand whether your monthly income can comfortably support the loan.
              </p>
            </div>

            <div className="bg-white border border-line rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-brand">
                Scam Detection
              </h3>
              <p className="text-muted mt-3 text-sm">
                Identify suspicious loan messages and potential red flags.
              </p>
            </div>

          </section>

          <section className="text-center mt-12">
            <h2 className="text-2xl font-bold text-brand">
              Worried about a loan offer?
            </h2>

            <p className="text-muted mt-3">
              Check suspicious loan messages for possible warning signs.
            </p>

            <button
              onClick={() => setCurrentScreen('scam')}
              className="mt-6 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl"
            >
              Check Loan Message →
            </button>
          </section>

          <p className="text-center text-sm text-muted mt-16">
            Educational tool, not financial advice.
          </p>

        </main>
      </div>
    )
  }

  // LOAN INPUT
  if (currentScreen === 'loan') {
    return (
      <div className="min-h-screen bg-page">
        <button
          onClick={() => setCurrentScreen('home')}
          className="m-4 px-4 py-2 rounded-lg border border-line bg-white text-brand"
        >
          ← Back to Home
        </button>

        <LoanInput
          onSubmitSuccess={() => setCurrentScreen('results')}
        />
      </div>
    )
  }

  // RESULTS
  if (currentScreen === 'results') {
    return (
      <Results
        result={sampleCalculationResult}
        onBack={() => setCurrentScreen('loan')}
        onShowVerdict={() => setCurrentScreen('verdict')}
      />
    )
  }

  // VERDICT
  if (currentScreen === 'verdict') {
    return (
      <Verdict
        result={sampleCalculationResult}
        onBack={() => setCurrentScreen('results')}
      />
    )
  }

  // SCAM DETECTION
  if (currentScreen === 'scam') {
    return (
      <ScamCheck
        onBack={() => setCurrentScreen('home')}
      />
    )
  }

  return null
}

export default App
