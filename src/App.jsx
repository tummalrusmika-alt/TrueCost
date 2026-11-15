
import { useState } from 'react'

import LoanInput from './components/screens/LoanInput'
import Results from './components/screens/Results'
import Verdict from './components/screens/Verdict'
import ScamCheck from './components/screens/ScamCheck'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [calculationResult, setCalculationResult] = useState(null)

  const handleCalculationSuccess = (result) => {
    if (!result) return

    setCalculationResult(result)
    setCurrentScreen('results')
  }

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-page text-ink font-sans">

        {/* NAVIGATION */}
        <header className="bg-white border-b border-line sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-white text-2xl font-bold">
                ₹
              </div>

              <div className="text-left">
                <h1 className="text-2xl font-bold text-brand tracking-tight">
                  TrueCost
                </h1>
                <p className="text-xs text-muted">
                  Smarter borrowing starts here
                </p>
              </div>
            </button>

            <button
              onClick={() => setCurrentScreen('scam')}
              className="text-sm font-semibold text-brand border border-line rounded-xl px-4 py-2 hover:bg-brand-tint transition"
            >
              Scam Check
            </button>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* HERO SECTION */}
          <section className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div>
              <span className="inline-flex items-center gap-2 bg-brand-tint text-brand rounded-full px-4 py-2 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand"></span>
                Smart Loan Analysis
              </span>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-7 tracking-tight">
                Know the
                <span className="text-brand"> true cost </span>
                before you borrow.
              </h2>

              <p className="text-muted text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
                Don't let hidden charges and confusing loan offers
                surprise you. Calculate your EMI, understand the
                real cost and make informed borrowing decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-xl shadow-md transition"
                >
                  Calculate My Loan →
                </button>

                <button
                  onClick={() => setCurrentScreen('scam')}
                  className="bg-white border border-line hover:bg-brand-tint text-brand font-semibold px-8 py-4 rounded-xl transition"
                >
                  Check Loan Scam
                </button>

              </div>

              <p className="text-sm text-muted mt-6">
                ✓ Simple calculations · ✓ Hidden fee analysis
              </p>
            </div>

            {/* HERO VISUAL */}
            <div className="bg-brand rounded-3xl p-7 sm:p-10 text-white shadow-xl relative overflow-hidden">

              <div className="absolute w-64 h-64 bg-white opacity-5 rounded-full -right-20 -top-20"></div>
              <div className="absolute w-48 h-48 bg-white opacity-5 rounded-full -left-16 -bottom-20"></div>

              <div className="relative">

                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/80 font-medium">
                    Your loan clarity dashboard
                  </p>
                  <span className="text-2xl">₹</span>
                </div>

                <div className="mt-10">
                  <p className="text-white/70 text-sm">
                    Understand more than just EMI
                  </p>

                  <h3 className="text-3xl sm:text-4xl font-bold mt-3">
                    Every rupee matters.
                  </h3>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mt-9">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/80">
                      Loan Analysis
                    </span>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      TrueCost
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <div>
                      <p className="text-xs text-white/70">
                        EMI
                      </p>
                      <p className="text-xl font-bold mt-1">
                        Monthly
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/70">
                        Hidden Charges
                      </p>
                      <p className="text-xl font-bold mt-1">
                        Revealed
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/70">
                        Affordability
                      </p>
                      <p className="text-xl font-bold mt-1">
                        Checked
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/70">
                        Loan Safety
                      </p>
                      <p className="text-xl font-bold mt-1">
                        Reviewed
                      </p>
                    </div>

                  </div>
                </div>

                <p className="text-xs text-white/70 mt-6">
                  Make informed financial decisions with TrueCost.
                </p>

              </div>
            </div>

          </section>

          {/* FEATURES */}
          <section className="py-12">

            <div className="text-center max-w-2xl mx-auto">
              <span className="text-brand font-semibold text-sm">
                WHAT WE OFFER
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Everything you need to understand your loan
              </h2>

              <p className="text-muted mt-4">
                Three simple tools to help you borrow more confidently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

              {/* LOAN CALCULATOR */}
              <div className="bg-white border border-line rounded-2xl p-7 shadow-sm hover:shadow-lg transition">

                <div className="w-14 h-14 rounded-2xl bg-brand-tint flex items-center justify-center text-3xl">
                  ₹
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Loan Calculator
                </h3>

                <p className="text-muted text-sm leading-relaxed mt-3">
                  Calculate your monthly EMI, total interest,
                  processing fees, GST and actual amount received.
                </p>

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="text-brand font-semibold text-sm mt-7 hover:underline"
                >
                  Calculate Loan →
                </button>

              </div>

              {/* AFFORDABILITY */}
              <div className="bg-white border border-line rounded-2xl p-7 shadow-sm hover:shadow-lg transition">

                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl">
                  📊
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Affordability Check
                </h3>

                <p className="text-muted text-sm leading-relaxed mt-3">
                  Compare your monthly income, expenses and EMI
                  to understand whether the loan is affordable.
                </p>

                <button
                  onClick={() => setCurrentScreen('loan')}
                  className="text-brand font-semibold text-sm mt-7 hover:underline"
                >
                  Check Affordability →
                </button>

              </div>

              {/* SCAM DETECTION */}
              <div className="bg-white border border-line rounded-2xl p-7 shadow-sm hover:shadow-lg transition">

                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">
                  🛡️
                </div>

                <h3 className="text-xl font-bold mt-6">
                  Scam Detection
                </h3>

                <p className="text-muted text-sm leading-relaxed mt-3">
                  Check suspicious loan messages for warning signs,
                  advance payment requests and risky instructions.
                </p>

                <button
                  onClick={() => setCurrentScreen('scam')}
                  className="text-brand font-semibold text-sm mt-7 hover:underline"
                >
                  Check Loan Message →
                </button>

              </div>

            </div>
          </section>

          {/* CALL TO ACTION */}
          <section className="my-16 bg-brand-tint rounded-3xl p-8 sm:p-12 text-center">

            <h2 className="text-3xl font-bold text-ink">
              Before you accept a loan, know what it really costs.
            </h2>

            <p className="text-muted mt-4 max-w-2xl mx-auto">
              Take a moment to understand your loan details
              and identify possible hidden charges.
            </p>

            <button
              onClick={() => setCurrentScreen('loan')}
              className="mt-7 bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-semibold shadow-md transition"
            >
              Start Loan Analysis →
            </button>

          </section>

          {/* DISCLAIMER */}
          <footer className="border-t border-line py-8 text-center">

            <h3 className="text-brand font-bold text-lg">
              TrueCost
            </h3>

            <p className="text-muted text-sm mt-2">
              Understand your loan before you borrow.
            </p>

            <p className="text-xs text-muted mt-5">
              Educational tool, not financial advice.
            </p>

            <p className="text-xs text-muted mt-2">
              © {new Date().getFullYear()} TrueCost. All rights reserved.
            </p>

          </footer>

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
          className="m-4 px-4 py-2 rounded-lg border border-line bg-white text-brand hover:bg-brand-tint"
        >
          ← Back to Home
        </button>

        <LoanInput onSubmitSuccess={handleCalculationSuccess} />
      </div>
    )
  }

  // RESULTS
  if (currentScreen === 'results') {
    if (!calculationResult) {
      return (
        <div className="min-h-screen bg-page p-8">
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

  // VERDICT
  if (currentScreen === 'verdict') {
    if (!calculationResult) {
      return (
        <div className="min-h-screen bg-page p-8">
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

  // SCAM CHECK
  if (currentScreen === 'scam') {
    return (
      <ScamCheck onBack={() => setCurrentScreen('home')} />
    )
  }

  return null
}

export default App
