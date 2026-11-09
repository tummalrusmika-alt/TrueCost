
import { useState } from 'react'
import LoanInput from './components/screens/LoanInput'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')

  if (currentScreen === 'loan') {
    return <LoanInput />
  }

  return (
    <div className="min-h-screen bg-page text-ink font-sans">
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-brand">TrueCost</h1>
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
            className="mt-8 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            type="button"
          >
            Get Started
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white border border-line rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-brand">Loan Calculator</h3>
            <p className="text-muted mt-3 text-sm">
              Calculate EMI, interest, fees and the actual amount you receive.
            </p>
          </div>

          <div className="bg-white border border-line rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-brand">Affordability Check</h3>
            <p className="text-muted mt-3 text-sm">
              Understand whether your monthly income can comfortably support the loan.
            </p>
          </div>

          <div className="bg-white border border-line rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-brand">Scam Detection</h3>
            <p className="text-muted mt-3 text-sm">
              Identify suspicious loan messages and potential red flags.
            </p>
          </div>
        </section>

        <p className="text-center text-sm text-muted mt-16">
          Educational tool, not financial advice.
        </p>
      </main>
    </div>
  )
}

export default App
