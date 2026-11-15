
import { useState } from 'react'

import LoanInput from './components/screens/LoanInput'
import Results from './components/screens/Results'
import Verdict from './components/screens/Verdict'
import ScamCheck from './components/screens/ScamCheck'

import { calculateLoan } from './logic/calculate'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [calculationResult, setCalculationResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Calculate actual loan details
  const handleCalculationSuccess = (data) => {
    try {
      setErrorMessage('')

      if (!data?.terms || !data?.affordability) {
        throw new Error('Loan details are missing.')
      }

      const result = calculateLoan(
        data.terms,
        data.affordability
      )

      const requiredFields = [
        'emi',
        'totalInterest',
        'fees',
        'gstAmount',
        'hiddenExtra',
        'totalPaid',
        'moneyReceived',
        'effectiveRatePercent',
        'moneyLeft'
      ]

      for (const field of requiredFields) {
        if (!Number.isFinite(result[field])) {
          throw new Error(`Invalid result: ${field}`)
        }
      }

      setCalculationResult(result)
      setCurrentScreen('results')

    } catch (error) {
      console.error('Calculation error:', error)
      setErrorMessage(error.message)
    }
  }

  // Reusable background decoration
  const Background = () => (
    <>
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
    </>
  )

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">

        <Background />

        {/* NAVBAR */}
        <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-700/20">
                <span className="text-white text-2xl font-bold">₹</span>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-teal-800 tracking-tight">
                  TrueCost
                </h1>
                <p className="text-xs text-slate-500">
                  Smart Loan Analysis
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('loan')}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition"
            >
              Get Started
            </button>

          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">

          {/* HERO */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">

            <div>

              <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 border border-teal-100 rounded-full px-4 py-2 text-sm font-semibold">
                <span className="w-2 h-2 bg-teal-600 rounded-full" />
                Make smarter borrowing decisions
              </span>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mt-7 tracking-tight">
                Know the
                <span className="text-teal-700"> true cost </span>
                of your loan.
              </h2>

              <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-xl">
                Don't just look at the EMI. Understand interest,
                hidden charges, affordability and suspicious loan
                offers before you borrow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-teal-700/20 transition"
                >
                  Calculate My Loan →
                </button>

                <button
                  onClick={() => setCurrentScreen('scam')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-8 py-4 rounded-xl font-bold transition"
                >
                  Check Loan Scam
                </button>

              </div>

              <p className="text-sm text-slate-500 mt-6">
                Free educational tool · Simple · Easy to understand
              </p>

            </div>

            {/* HERO VISUAL */}
            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-br from-teal-300/30 to-amber-200/30 rounded-[2rem] blur-2xl" />

              <div className="relative bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-900 rounded-[2rem] p-7 sm:p-10 shadow-2xl shadow-teal-900/20 text-white overflow-hidden">

                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-white/10" />
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full border border-white/10" />

                <div className="relative">

                  <div className="flex items-center justify-between">
                    <span className="text-teal-100 font-medium">
                      Your Loan Overview
                    </span>

                    <span className="bg-white/15 rounded-lg px-3 py-1 text-xs">
                      TrueCost
                    </span>
                  </div>

                  <div className="mt-10">
                    <p className="text-teal-100 text-sm">
                      Understand your monthly EMI
                    </p>

                    <h3 className="text-4xl sm:text-5xl font-extrabold mt-3">
                      ₹4,489.36
                    </h3>

                    <p className="text-teal-100 text-sm mt-2">
                      Illustrative example only
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-10">

                    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                      <p className="text-teal-100 text-xs">
                        Loan Amount
                      </p>
                      <p className="text-xl font-bold mt-2">
                        ₹50,000
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                      <p className="text-teal-100 text-xs">
                        Loan Period
                      </p>
                      <p className="text-xl font-bold mt-2">
                        12 Months
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 bg-amber-400 rounded-xl p-4 text-slate-900">
                    <p className="text-xs font-semibold">
                      REMEMBER
                    </p>
                    <p className="font-bold mt-1">
                      EMI is not the whole cost of a loan.
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </section>

          {/* FEATURES */}
          <section className="py-16">

            <div className="text-center max-w-2xl mx-auto">
              <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">
                What We Offer
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
                Everything you need before borrowing
              </h2>

              <p className="text-slate-600 mt-4">
                Make informed decisions with simple loan analysis tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

              {/* FEATURE 1 */}
              <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">

                <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center text-3xl">
                  ₹
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Loan Calculator
                </h3>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  Calculate your monthly EMI, total interest,
                  processing fees and actual money received.
                </p>

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="text-teal-700 font-bold mt-6 hover:text-teal-900"
                >
                  Calculate now →
                </button>

              </div>

              {/* FEATURE 2 */}
              <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">

                <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-3xl">
                  ✓
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Affordability Check
                </h3>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  Understand how much money remains after expenses
                  and whether the EMI fits your budget.
                </p>

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="text-teal-700 font-bold mt-6 hover:text-teal-900"
                >
                  Check affordability →
                </button>

              </div>

              {/* FEATURE 3 */}
              <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">

                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl">
                  !
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Scam Detection
                </h3>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  Check suspicious loan messages and identify
                  possible fraud warning signs.
                </p>

                <button
                  onClick={() => setCurrentScreen('scam')}
                  className="text-teal-700 font-bold mt-6 hover:text-teal-900"
                >
                  Check a message →
                </button>

              </div>

            </div>
          </section>

          {/* CTA */}
          <section className="pb-20">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">

              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Borrow with confidence.
              </h2>

              <p className="text-teal-100 mt-4 max-w-xl mx-auto">
                Understand your loan before making a financial commitment.
              </p>

              <button
                onClick={() => setCurrentScreen('loan')}
                className="mt-8 bg-white text-teal-800 hover:bg-teal-50 px-8 py-4 rounded-xl font-bold transition"
              >
                Start Loan Analysis →
              </button>

            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col sm:flex-row justify-between items-center gap-3">

            <h3 className="font-extrabold text-teal-800 text-xl">
              TrueCost
            </h3>

            <p className="text-sm text-slate-500 text-center">
              Educational tool, not financial advice.
            </p>

            <p className="text-sm text-slate-500">
              © 2026 TrueCost
            </p>

          </div>
        </footer>

      </div>
    )
  }

  // LOAN INPUT SCREEN
  if (currentScreen === 'loan') {
    return (
      <div className="min-h-screen bg-slate-50">

        <button
          onClick={() => {
            setErrorMessage('')
            setCurrentScreen('home')
          }}
          className="m-4 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-teal-800 font-semibold hover:bg-teal-50"
        >
          ← Back to Home
        </button>

        {errorMessage && (
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <strong>Calculation Error</strong>
              <p className="mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <LoanInput
          onSubmitSuccess={handleCalculationSuccess}
        />

      </div>
    )
  }

  // RESULTS SCREEN
  if (currentScreen === 'results') {
    if (!calculationResult) {
      return (
        <div className="min-h-screen bg-slate-50 p-8">
          <p>No calculation result available.</p>
          <button onClick={() => setCurrentScreen('loan')}>
            Back to Loan Input
          </button>
        </div>
      )
    }

    return (
      <Results
        result={calculationResult}
        onBack={() => setCurrentScreen('loan')}
        onShowVerdict={() => setCurrentScreen('verdict')}
      />
    )
  }

  // VERDICT SCREEN
  if (currentScreen === 'verdict') {
    if (!calculationResult) {
      return (
        <div className="min-h-screen bg-slate-50 p-8">
          <p>No calculation result available.</p>
          <button onClick={() => setCurrentScreen('loan')}>
            Back to Loan Input
          </button>
        </div>
      )
    }

    return (
      <Verdict
        result={calculationResult}
        onBack={() => setCurrentScreen('results')}
      />
    )
  }

  // SCAM CHECK SCREEN
  if (currentScreen === 'scam') {
    return (
      <div className="min-h-screen bg-slate-50">
        <ScamCheck
          onBack={() => setCurrentScreen('home')}
        />
      </div>
    )
  }

  return null
}

export default App
