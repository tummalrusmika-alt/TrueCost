import { useState } from 'react';
import TrueCost from './logic/TrueCost.jsx';
import Compare from './logic/Compare.jsx';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');

  if (page === 'loan' || page === 'scam' || page === 'compare') {
    return (
      <>
        <header className="tc-nav">
          <div>
            <h1>₹ TrueCost</h1>
            <p>Smart Loan Analysis</p>
          </div>

          <button onClick={() => setPage('home')}>
            ← Back to Home
          </button>
        </header>

        {page === 'compare' ? (
          <Compare key={page} />
        ) : (
          <TrueCost key={page} mode={page} />
        )}
      </>
    );
  }

  return (
    <div className="tc-home">
      <header className="tc-nav">
        <div>
          <h1>₹ TrueCost</h1>
          <p>Smart Loan Analysis</p>
        </div>

        <button onClick={() => setPage('loan')}>
          Get Started
        </button>
      </header>

      <main>
        <section className="tc-hero">
          <div className="tc-hero-content">
            <span className="tc-tag">
              Make smarter borrowing decisions
            </span>

            <h2>
              Know the <span>true cost</span> of your loan.
            </h2>

            <p>
              Don't just look at the EMI. Understand interest, hidden
              charges, affordability and suspicious loan offers before
              you borrow.
            </p>

            <div className="tc-home-buttons">
              <button onClick={() => setPage('loan')}>
                Calculate My Loan →
              </button>

              <button
                className="tc-outline"
                onClick={() => setPage('compare')}
              >
                Compare Offers
              </button>

              <button
                className="tc-outline"
                onClick={() => setPage('scam')}
              >
                Check Loan Scam
              </button>
            </div>

            <p className="tc-caption">
              Free educational tool · Simple · Easy to understand
            </p>
          </div>

          <div className="tc-preview">
            <div className="tc-preview-top">
              <span>Your Loan Overview</span>
              <span className="tc-preview-badge">TrueCost</span>
            </div>

            <p>Illustrative monthly EMI</p>
            <h3>₹4,489.36</h3>
            <small>Example only</small>

            <div className="tc-preview-grid">
              <div>
                <span>Loan Amount</span>
                <strong>₹50,000</strong>
              </div>

              <div>
                <span>Loan Period</span>
                <strong>12 Months</strong>
              </div>
            </div>

            <div className="tc-reminder">
              <strong>REMEMBER</strong>
              <p>EMI is not the whole cost of a loan.</p>
            </div>
          </div>
        </section>

        <section className="tc-features">
          <h2>Make better borrowing decisions</h2>

          <div className="tc-feature-grid">
            <article>
              <h3>Loan Calculator</h3>
              <p>
                Calculate EMI, interest, processing fees and the real
                cost of borrowing.
              </p>
              <button onClick={() => setPage('loan')}>
                Calculate now →
              </button>
            </article>

            <article>
              <h3>Affordability Check</h3>
              <p>
                Understand whether a loan fits your income and monthly
                expenses.
              </p>
              <button onClick={() => setPage('loan')}>
                Check affordability →
              </button>
            </article>

            <article>
              <h3>Compare Two Offers</h3>
              <p>
                See which loan offer really costs less once fees, GST and
                other charges are counted.
              </p>
              <button onClick={() => setPage('compare')}>
                Compare now →
              </button>
            </article>

            <article>
              <h3>Scam Detection</h3>
              <p>
                Identify warning signs in suspicious loan SMS and
                WhatsApp messages.
              </p>
              <button onClick={() => setPage('scam')}>
                Check a message →
              </button>
            </article>
          </div>
        </section>
      </main>

      <footer className="tc-home-footer">
        TrueCost · Understand Before You Borrow.
      </footer>
    </div>
  );
}