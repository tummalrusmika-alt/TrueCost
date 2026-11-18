
import { useState } from 'react';
import { extractTerms, explain } from '../api/ai.js';
import {
  analyzeLoan,
  checkAffordability,
  checkScamRisk,
  extractTermsFromText,
  rupees,
} from './index.js';
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

const DEMO_OFFER =
  'Personal loan of Rs 5,00,000 at 12% annual interest for 36 months. Processing fee Rs 2,500 plus 18% GST and other charges Rs 500.';

// Convert the rule-based risk level into a simple risk score.
function getRiskScore(level, flags = []) {
  const count = flags.length;

  if (level === 'High') {
    return Math.min(100, 80 + count * 5);
  }

  if (level === 'Medium') {
    return Math.min(79, 40 + count * 10);
  }

  return Math.min(39, count * 10);
}

export default function TrueCost({ mode = 'all' }) {
  const [form, setForm] = useState(emptyForm);
  const [pasteText, setPasteText] = useState('');
  const [pasteMsg, setPasteMsg] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);
  const [afford, setAfford] = useState(null);
  const [scamText, setScamText] = useState('');
  const [scam, setScam] = useState(null);

  const [aiExplanation, setAiExplanation] = useState('');
  const [scamExplanation, setScamExplanation] = useState('');
  const [aiStatus, setAiStatus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const setField = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  const handleDemoCredits = () => {
    setForm({
      amount: '500000',
      annualRate: '12',
      months: '36',
      rateType: 'reducing',
      processingFee: '2500',
      gstPct: '18',
      otherCharges: '500',
    });

    setIncome('65000');
    setExpenses('28000');
    setPasteText(DEMO_OFFER);
    setPasteMsg(
      'Demo credits loaded! Review the sample details and click Calculate true cost.'
    );

    setResult(null);
    setAfford(null);
    setAiExplanation('');
    setAiStatus('');
  };

  // AI extraction with local extraction fallback.
  const handleExtract = async () => {
    if (!pasteText.trim()) {
      setPasteMsg('Paste a loan offer first.');
      return;
    }

    setAiLoading(true);
    setAiStatus('AI is reading the offer...');
    setAiExplanation('');

    try {
      const aiFound = await extractTerms(pasteText);
      const fallback = extractTermsFromText(pasteText);

      const updates = {
        amount: aiFound?.error
          ? fallback.amount
          : (aiFound.amount ?? fallback.amount),

        annualRate: aiFound?.error
          ? fallback.annualRate
          : (aiFound.annualRatePercent ?? fallback.annualRate),

        months: aiFound?.error
          ? fallback.months
          : (aiFound.tenureMonths ?? fallback.months),

        processingFee: aiFound?.error
          ? fallback.processingFee
          : (aiFound.processingFee ?? fallback.processingFee),

        gstPct: aiFound?.error
          ? '18'
          : (aiFound.gstOnFeesPercent ?? '18'),

        otherCharges: aiFound?.error
          ? ''
          : (aiFound.otherCharges ?? ''),

        rateType: fallback.rateType || 'reducing',
      };

      setForm((previous) => ({
        ...previous,
        ...Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [
            key,
            value === '' || value === null || value === undefined
              ? previous[key]
              : String(value),
          ])
        ),
      }));

      const worked = !aiFound?.error;

      setPasteMsg(
        worked
          ? 'AI extracted the available terms. Please verify every value before calculating.'
          : 'AI was unavailable. Basic text extraction was used where possible. Please check the fields.'
      );

      setAiStatus(
        worked
          ? 'AI extraction completed.'
          : 'AI unavailable — local extraction used.'
      );
    } catch (error) {
      const fallback = extractTermsFromText(pasteText);

      setForm((previous) => ({
        ...previous,
        amount: fallback.amount !== ''
          ? String(fallback.amount)
          : previous.amount,
        annualRate: fallback.annualRate !== ''
          ? String(fallback.annualRate)
          : previous.annualRate,
        months: fallback.months !== ''
          ? String(fallback.months)
          : previous.months,
        processingFee: fallback.processingFee !== ''
          ? String(fallback.processingFee)
          : previous.processingFee,
        rateType: fallback.rateType || previous.rateType,
      }));

      setPasteMsg(
        'AI could not read the offer. Local extraction was tried; please check or enter details manually.'
      );

      setAiStatus('AI unavailable — local extraction used.');
    } finally {
      setAiLoading(false);
    }
  };

  // Code calculates the loan. AI only explains the result.
  const handleCalculate = async () => {
    const loan = analyzeLoan(form);

    setResult(loan);
    setAiExplanation('');

    if (!loan.ok) {
      setAfford(null);
      return;
    }

    if (income === '' || expenses === '') {
      setAfford(null);
      setAiStatus(
        'Enter monthly income and expenses to get an affordability verdict.'
      );
      return;
    }

    const affordability = checkAffordability({
      income,
      expenses,
      emi: loan.emi,
      effectiveAnnualRate: loan.effectiveAnnualRate,
      hiddenExtra: loan.hiddenExtra,
      amount: loan.principal,
    });

    setAfford(affordability);

    if (!affordability.ok) {
      return;
    }

    const explanationInput = {
      verdict: affordability.verdict,
      reasons: affordability.reasons,
      assumptions: loan.assumptions,
      emi: loan.emi,
      totalInterest: loan.totalInterest,
      fees: loan.processingFee,
      gstAmount: loan.gstOnFee,
      hiddenExtra: loan.hiddenExtra,
      totalPaid: loan.totalPaid,
      moneyReceived: loan.moneyReceived,
      effectiveRatePercent: loan.effectiveAnnualRate,
      moneyLeft: affordability.moneyLeft,
      emiShareOfLeftPercent: affordability.emiShare,
    };

    setAiLoading(true);
    setAiStatus('AI is preparing your explanation...');

    try {
      const response = await explain(explanationInput, 'en');

      if (response?.text) {
        setAiExplanation(response.text);
        setAiStatus('AI explanation ready.');
      } else {
        setAiStatus(
          'AI explanation unavailable. Your code-calculated result is still shown.'
        );
      }
    } catch (error) {
      setAiStatus(
        'AI explanation unavailable. Your code-calculated result is still shown.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Rule-based scam detection.
  const handleScam = () => {
    if (!scamText.trim()) {
      setScam({
        ok: false,
        errors: ['Paste a message first.'],
      });
      return;
    }

    try {
      const scamResult = checkScamRisk(scamText);

      setScam(scamResult);
      setScamExplanation('');
      setAiStatus('Rule-based scam detection completed.');
    } catch (error) {
      console.error('Scam detection error:', error);

      setScam({
        ok: false,
        errors: ['Unable to check this message. Please try again.'],
      });
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setPasteText('');
    setPasteMsg('');
    setIncome('');
    setExpenses('');
    setResult(null);
    setAfford(null);
    setAiExplanation('');
    setScamExplanation('');
    setScamText('');
    setScam(null);
    setAiStatus('');
  };

  const riskScore = scam?.ok
    ? getRiskScore(scam.level, scam.flags)
    : 0;

  return (
    <div className="tc">
      <header className="tc-header">
        <h1>TrueCost</h1>
        <p>Know your money, then check any offer against it.</p>

        {aiStatus && (
          <p className="tc-note">{aiStatus}</p>
        )}
      </header>

      {/* LOAN CALCULATOR */}
      {(mode === 'loan' || mode === 'all') && (
        <>
          <section className="tc-card">
            <h2>1. Enter the offer</h2>

            <label className="tc-label">
              Paste the offer text (optional)
            </label>

            <textarea
              rows={3}
              value={pasteText}
              onChange={(event) => {
                setPasteText(event.target.value);
                setPasteMsg('');
              }}
            />

            <div className="tc-row">
              <button
                className="tc-btn secondary"
                onClick={handleExtract}
                disabled={aiLoading}
              >
                {aiLoading ? 'Please wait...' : 'AI: Fill form from text'}
              </button>

              <button
                className="tc-btn link"
                onClick={() => setPasteText(SAMPLE_OFFER)}
              >
                Use sample offer
              </button>

              <button
                className="tc-btn"
                onClick={handleDemoCredits}
              >
                ✨ Load Demo Credits
              </button>
            </div>

            {pasteMsg && (
              <p className="tc-note">{pasteMsg}</p>
            )}

            <div className="tc-grid">
              <Field label="Loan / purchase amount (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={setField('amount')}
                />
              </Field>

              <Field label="Interest rate (% per year)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.annualRate}
                  onChange={setField('annualRate')}
                />
              </Field>

              <Field label="Tenure (months)">
                <input
                  type="number"
                  min="1"
                  value={form.months}
                  onChange={setField('months')}
                />
              </Field>

              <Field label="Rate type">
                <select
                  value={form.rateType}
                  onChange={setField('rateType')}
                >
                  <option value="reducing">Reducing balance</option>
                  <option value="flat">Flat rate</option>
                </select>
              </Field>

              <Field label="Processing fee (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.processingFee}
                  onChange={setField('processingFee')}
                />
              </Field>

              <Field label="GST on fee (%)">
                <input
                  type="number"
                  min="0"
                  value={form.gstPct}
                  onChange={setField('gstPct')}
                />
              </Field>

              <Field label="Other charges, total (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.otherCharges}
                  onChange={setField('otherCharges')}
                />
              </Field>
            </div>
          </section>

          <section className="tc-card">
            <h2>2. Your money</h2>

            <div className="tc-grid">
              <Field label="Monthly income (₹)">
                <input
                  type="number"
                  min="0"
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                />
              </Field>

              <Field label="Monthly expenses (₹)">
                <input
                  type="number"
                  min="0"
                  value={expenses}
                  onChange={(event) => setExpenses(event.target.value)}
                />
              </Field>
            </div>

            <div className="tc-row">
              <button
                className="tc-btn"
                onClick={handleCalculate}
                disabled={aiLoading}
              >
                Calculate true cost
              </button>

              <button
                className="tc-btn link"
                onClick={reset}
              >
                Clear
              </button>
            </div>
          </section>

          {result && !result.ok && (
            <section className="tc-card error">
              {result.errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </section>
          )}

          {afford && !afford.ok && (
            <section className="tc-card error">
              {afford.errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </section>
          )}

          {afford && afford.ok && (
            <section
              className={`tc-card verdict ${afford.verdict.toLowerCase()}`}
            >
              <h2>Your Loan Verdict: {afford.verdict}</h2>

              <p>
                Money left each month:{' '}
                <strong>{rupees(afford.moneyLeft)}</strong>

                {afford.emiShare !== null && (
                  <>
                    {' '}· EMI takes{' '}
                    <strong>{afford.emiShare.toFixed(0)}%</strong>
                  </>
                )}
              </p>

              <ul>
                {afford.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </section>
          )}

          {aiExplanation && (
            <section className="tc-card">
              <h2>AI explanation</h2>
              <p>{aiExplanation}</p>

              <p className="tc-small">
                The calculator performs the financial calculations.
                AI only explains the result.
              </p>
            </section>
          )}

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
                    <strong>{result.effectiveAnnualRate.toFixed(1)}%</strong>
                  </div>

                  <div>
                    <span>Hidden extra</span>
                    <strong>{rupees(result.hiddenExtra)}</strong>
                  </div>
                </div>

                <table className="tc-table">
                  <tbody>
                    <tr>
                      <td>Principal (loan amount)</td>
                      <td>{rupees(result.principal)}</td>
                    </tr>
                    <tr>
                      <td>Interest</td>
                      <td>{rupees(result.totalInterest)}</td>
                    </tr>
                    <tr>
                      <td>Processing fee</td>
                      <td>{rupees(result.processingFee)}</td>
                    </tr>
                    <tr>
                      <td>GST on fee</td>
                      <td>{rupees(result.gstOnFee)}</td>
                    </tr>
                    <tr>
                      <td>Other charges</td>
                      <td>{rupees(result.otherCharges)}</td>
                    </tr>
                    <tr className="total">
                      <td>Total you pay</td>
                      <td>{rupees(result.totalPaid)}</td>
                    </tr>
                    <tr>
                      <td>Money you actually receive</td>
                      <td>{rupees(result.moneyReceived)}</td>
                    </tr>
                    <tr className="total">
                      <td>Total cost of borrowing</td>
                      <td>{rupees(result.totalCostOfBorrowing)}</td>
                    </tr>
                  </tbody>
                </table>

                {result.warnings.map((warning, index) => (
                  <p key={index} className="tc-warn">
                    ⚠ {warning}
                  </p>
                ))}
              </section>

              <section className="tc-card">
                <h2>Assumptions</h2>

                <ul className="tc-small">
                  {result.assumptions.map((assumption, index) => (
                    <li key={index}>{assumption}</li>
                  ))}
                </ul>

                <p className="tc-small">
                  <strong>Code</strong> calculates every number.
                  <strong> AI</strong> only reads messy text and writes
                  explanations.
                </p>
              </section>
            </>
          )}
        </>
      )}

      {/* SCAM CHECKER */}
      {(mode === 'scam' || mode === 'all') && (
        <section id="scam-check" className="tc-card">
          <h2>Check a loan message for scam signs</h2>

          <textarea
            rows={4}
            value={scamText}
            onChange={(event) => {
              setScamText(event.target.value);
              setScam(null);
              setScamExplanation('');
            }}
            placeholder="Paste a loan SMS / WhatsApp message here"
          />

          <div className="tc-row">
            <button
              className="tc-btn secondary"
              onClick={handleScam}
            >
              Check message
            </button>

            <button
              className="tc-btn link"
              onClick={() => {
                setScamText(SAMPLE_SCAM);
                setScam(null);
                setScamExplanation('');
              }}
            >
              Use sample scam message
            </button>
          </div>

          {scam && !scam.ok && (
            <p className="tc-warn">
              {scam.errors?.[0] || 'Could not check this message.'}
            </p>
          )}

          {scam && scam.ok && (
            <div className={`tc-risk ${scam.level.toLowerCase()}`}>
              <h3>Risk level: {scam.level}</h3>

              {/* Risk score */}
              <div className="tc-risk-score">
                <div className="tc-risk-score-heading">
                  <strong>Scam Risk Score</strong>
                  <strong>{riskScore}/100</strong>
                </div>

                <div
                  className="tc-risk-track"
                  role="progressbar"
                  aria-valuenow={riskScore}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Scam risk score"
                >
                  <div
                    className={`tc-risk-fill ${scam.level.toLowerCase()}`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>

                <p className="tc-small">
                  {riskScore >= 80
                    ? 'Several serious warning signs were detected.'
                    : riskScore >= 40
                      ? 'Some warning signs were detected. Verify carefully.'
                      : 'Few common warning signs were detected. Stay alert.'}
                </p>
              </div>

              <h4>Why was this message flagged?</h4>

              {scam.flags?.length > 0 ? (
                <ul>
                  {scam.flags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No common scam signs found, but stay careful.
                </p>
              )}

              <p className="tc-small">{scam.note}</p>

              {scamExplanation && (
                <div className="tc-ai-explanation">
                  <strong>AI explanation</strong>
                  <p>{scamExplanation}</p>
                </div>
              )}

              <p className="tc-small">
                This is a rule-based screening score, not a guarantee
                that a message is safe or fraudulent.
              </p>
            </div>
          )}
        </section>
      )}

      <footer className="tc-footer">
        Educational tool, not financial advice.
      </footer>
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