import { useState } from 'react';
import {
  analyzeLoan,
  checkAffordability,
  checkScamRisk,
  extractTermsFromText,
  rupees,
} from './logic';
import './TrueCost.css';

const emptyForm = {
  amount: '',
  annualRate: '',
  months: '',
  rateType: 'reducing',
  processingFee: '',
  gstPct: '18',
  otherCharges: '',
};

const SAMPLE_OFFER =
  'No-cost EMI! Buy phone worth Rs 60,000 for 12 months at 0% interest. Processing fee Rs 1,999 + GST.';
const SAMPLE_SCAM =
  'URGENT! Your loan of Rs 50,000 is pre-approved. Pay Rs 1,500 processing fee within 2 hours and share OTP to receive money: bit.ly/loan-now';

export default function TrueCost() {
  const [form, setForm] = useState(emptyForm);
  const [pasteText, setPasteText] = useState('');
  const [pasteMsg, setPasteMsg] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);
  const [afford, setAfford] = useState(null);
  const [scamText, setScamText] = useState('');
  const [scam, setScam] = useState(null);

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Step 1a: fill the form from pasted text (rule-based here; plug AI in later)
  const handleExtract = () => {
    const found = extractTermsFromText(pasteText);
    const filled = Object.entries(found).filter(([, v]) => v !== '').length;
    setForm((f) => ({
      ...f,
      amount: found.amount !== '' ? String(found.amount) : f.amount,
      annualRate: found.annualRate !== '' ? String(found.annualRate) : f.annualRate,
      months: found.months !== '' ? String(found.months) : f.months,
      processingFee: found.processingFee !== '' ? String(found.processingFee) : f.processingFee,
      rateType: found.rateType || f.rateType,
    }));
    setPasteMsg(
      filled > 1
        ? 'Terms filled in. Please check them below and correct anything wrong.'
        : 'Could not find many terms. Please fill the form manually.'
    );
  };

  // Step 2 + 3: calculate and check affordability
  const handleCalculate = () => {
    const loan = analyzeLoan(form);
    setResult(loan);
    if (loan.ok && income !== '' && expenses !== '') {
      setAfford(
        checkAffordability({
          income,
          expenses,
          emi: loan.emi,
          effectiveAnnualRate: loan.effectiveAnnualRate,
          hiddenExtra: loan.hiddenExtra,
          amount: loan.principal,
        })
      );
    } else {
      setAfford(null);
    }
  };

  const handleScam = () => setScam(checkScamRisk(scamText));

  const reset = () => {
    setForm(emptyForm);
    setResult(null);
    setAfford(null);
    setPasteMsg('');
  };

  return (
    <div className="tc">
      <header className="tc-header">
        <h1>TrueCost</h1>
        <p>Know your money, then check any offer against it.</p>
      </header>

      {/* ---------- 1. Loan terms ---------- */}
      <section className="tc-card">
        <h2>1. Enter the offer</h2>

        <label className="tc-label">Paste the offer text (optional)</label>
        <textarea
          rows={3}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste an EMI / loan / BNPL offer message here"
        />
        <div className="tc-row">
          <button className="tc-btn secondary" onClick={handleExtract}>
            Fill form from text
          </button>
          <button className="tc-btn link" onClick={() => setPasteText(SAMPLE_OFFER)}>
            Use sample offer
          </button>
        </div>
        {pasteMsg && <p className="tc-note">{pasteMsg}</p>}

        <div className="tc-grid">
          <Field label="Loan / purchase amount (₹)">
            <input type="number" min="0" value={form.amount} onChange={setField('amount')} />
          </Field>
          <Field label="Interest rate (% per year)">
            <input type="number" min="0" step="0.01" value={form.annualRate} onChange={setField('annualRate')} />
          </Field>
          <Field label="Tenure (months)">
            <input type="number" min="1" value={form.months} onChange={setField('months')} />
          </Field>
          <Field label="Rate type">
            <select value={form.rateType} onChange={setField('rateType')}>
              <option value="reducing">Reducing balance</option>
              <option value="flat">Flat rate</option>
            </select>
          </Field>
          <Field label="Processing fee (₹)">
            <input type="number" min="0" value={form.processingFee} onChange={setField('processingFee')} />
          </Field>
          <Field label="GST on fee (%)">
            <input type="number" min="0" value={form.gstPct} onChange={setField('gstPct')} />
          </Field>
          <Field label="Other charges, total (₹)">
            <input type="number" min="0" value={form.otherCharges} onChange={setField('otherCharges')} />
          </Field>
        </div>
      </section>

      {/* ---------- 2. Affordability inputs ---------- */}
      <section className="tc-card">
        <h2>2. Your money</h2>
        <div className="tc-grid">
          <Field label="Monthly income (₹)">
            <input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} />
          </Field>
          <Field label="Monthly expenses (₹)">
            <input type="number" min="0" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
          </Field>
        </div>
        <div className="tc-row">
          <button className="tc-btn" onClick={handleCalculate}>
            Calculate true cost
          </button>
          <button className="tc-btn link" onClick={reset}>
            Clear
          </button>
        </div>
      </section>

      {/* ---------- Errors ---------- */}
      {result && !result.ok && (
        <section className="tc-card error">
          {result.errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </section>
      )}

      {/* ---------- Verdict ---------- */}
      {afford && !afford.ok && (
        <section className="tc-card error">
          {afford.errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </section>
      )}
      {afford && afford.ok && (
        <section className={`tc-card verdict ${afford.verdict.toLowerCase()}`}>
          <h2>Verdict: {afford.verdict}</h2>
          <p>
            Money left each month: <strong>{rupees(afford.moneyLeft)}</strong>
            {afford.emiShare !== null && (
              <>
                {' '}
                · EMI takes <strong>{afford.emiShare.toFixed(0)}%</strong> of it
              </>
            )}
          </p>
          <ul>
            {afford.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Breakdown ---------- */}
      {result && result.ok && (
        <>
          <section className="tc-card">
            <h2>What it really costs</h2>
            <div className="tc-big">
              <div>
                <span>Monthly EMI</span>
                <strong>{rupees(result.emi)}</strong>
              </div>
              <div>
                <span>Stated rate</span>
                <strong>{result.statedAnnualRate}%</strong>
              </div>
              <div>
                <span>Effective rate</span>
                <strong className={result.effectiveAnnualRate - result.statedAnnualRate > 5 ? 'bad' : ''}>
                  {result.effectiveAnnualRate.toFixed(1)}%
                </strong>
              </div>
              <div>
                <span>Hidden extra</span>
                <strong>{rupees(result.hiddenExtra)}</strong>
              </div>
            </div>

            <table className="tc-table">
              <tbody>
                <tr><td>Principal (loan amount)</td><td>{rupees(result.principal)}</td></tr>
                <tr><td>Interest</td><td>{rupees(result.totalInterest)}</td></tr>
                <tr><td>Processing fee</td><td>{rupees(result.processingFee)}</td></tr>
                <tr><td>GST on fee</td><td>{rupees(result.gstOnFee)}</td></tr>
                <tr><td>Other charges</td><td>{rupees(result.otherCharges)}</td></tr>
                <tr className="total"><td>Total you pay</td><td>{rupees(result.totalPaid)}</td></tr>
                <tr><td>Money you actually receive</td><td>{rupees(result.moneyReceived)}</td></tr>
                <tr className="total"><td>Total cost of borrowing</td><td>{rupees(result.totalCostOfBorrowing)}</td></tr>
              </tbody>
            </table>

            {result.warnings.map((w) => (
              <p key={w} className="tc-warn">⚠ {w}</p>
            ))}
          </section>

          <section className="tc-card">
            <h2>Assumptions</h2>
            <ul className="tc-small">
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p className="tc-small">
              <strong>Code</strong> calculates every number. <strong>AI</strong> only reads messy text and writes
              explanations.
            </p>
          </section>
        </>
      )}

      {/* ---------- Scam check ---------- */}
      <section className="tc-card">
        <h2>Check a loan message for scam signs</h2>
        <textarea
          rows={3}
          value={scamText}
          onChange={(e) => setScamText(e.target.value)}
          placeholder="Paste a loan SMS / WhatsApp message here"
        />
        <div className="tc-row">
          <button className="tc-btn secondary" onClick={handleScam}>
            Check message
          </button>
          <button className="tc-btn link" onClick={() => setScamText(SAMPLE_SCAM)}>
            Use sample scam message
          </button>
        </div>

        {scam && !scam.ok && <p className="tc-warn">{scam.errors[0]}</p>}
        {scam && scam.ok && (
          <div className={`tc-risk ${scam.level.toLowerCase()}`}>
            <h3>Risk level: {scam.level}</h3>
            {scam.flags.length > 0 ? (
              <ul>
                {scam.flags.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : (
              <p>No common scam signs found, but stay careful.</p>
            )}
            <p className="tc-small">{scam.note}</p>
          </div>
        )}
      </section>

      <footer className="tc-footer">Educational tool, not financial advice.</footer>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="tc-field">
      <span className="tc-label">{label}</span>
      {children}
    </label>
  );
}