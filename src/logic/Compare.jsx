import { useState } from 'react';
import { compareLoanOffers, rupees } from './calculate.js';
import {
  LANGUAGE_OPTIONS,
  COMPARE_UI,
  resolveLanguage,
} from './translations.js';
import { canSpeak, speak, stopSpeaking } from './speech.js';
import './TrueCost.css';

const emptyOffer = {
  amount: '',
  annualRatePercent: '',
  tenureMonths: '',
  processingFee: '',
  gstOnFeesPercent: '18',
  otherCharges: '',
};

const SAMPLE_A = {
  amount: '200000',
  annualRatePercent: '12',
  tenureMonths: '24',
  processingFee: '2000',
  gstOnFeesPercent: '18',
  otherCharges: '0',
};

const SAMPLE_B = {
  amount: '200000',
  annualRatePercent: '10.5',
  tenureMonths: '24',
  processingFee: '6000',
  gstOnFeesPercent: '18',
  otherCharges: '1500',
};

const toNumbers = (offer) => ({
  amount: Number(offer.amount),
  annualRatePercent: Number(offer.annualRatePercent || 0),
  tenureMonths: Number(offer.tenureMonths),
  processingFee: Number(offer.processingFee || 0),
  gstOnFeesPercent: offer.gstOnFeesPercent === '' ? 18 : Number(offer.gstOnFeesPercent),
  otherCharges: Number(offer.otherCharges || 0),
});

function OfferForm({ title, offer, onChange, t }) {
  const set = (key) => (event) => onChange({ ...offer, [key]: event.target.value });

  return (
    <section className="tc-card">
      <h2>{title}</h2>

      <div className="tc-grid tc-grid-2">
        <label className="tc-field">
          <span className="tc-label">{t.amount}</span>
          <input type="number" min="0" value={offer.amount} onChange={set('amount')} />
        </label>

        <label className="tc-field">
          <span className="tc-label">{t.rate}</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={offer.annualRatePercent}
            onChange={set('annualRatePercent')}
          />
        </label>

        <label className="tc-field">
          <span className="tc-label">{t.months}</span>
          <input type="number" min="1" value={offer.tenureMonths} onChange={set('tenureMonths')} />
        </label>

        <label className="tc-field">
          <span className="tc-label">{t.fee}</span>
          <input
            type="number"
            min="0"
            value={offer.processingFee}
            onChange={set('processingFee')}
          />
        </label>

        <label className="tc-field">
          <span className="tc-label">{t.gst}</span>
          <input
            type="number"
            min="0"
            value={offer.gstOnFeesPercent}
            onChange={set('gstOnFeesPercent')}
          />
        </label>

        <label className="tc-field">
          <span className="tc-label">{t.other}</span>
          <input
            type="number"
            min="0"
            value={offer.otherCharges}
            onChange={set('otherCharges')}
          />
        </label>
      </div>
    </section>
  );
}

export default function Compare() {
  const [language, setLanguage] = useState('en');
  const [offerA, setOfferA] = useState(emptyOffer);
  const [offerB, setOfferB] = useState(emptyOffer);
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  const lang = resolveLanguage(language, '');
  const t = COMPARE_UI[lang];

  const handleCompare = () => {
    stopSpeaking();
    setSpeaking(false);
    setErrors([]);
    setResult(null);

    try {
      const money = {
        monthlyIncome: income === '' ? 0 : Number(income),
        monthlyExpenses: expenses === '' ? 0 : Number(expenses),
      };

      const comparison = compareLoanOffers(
        toNumbers(offerA),
        toNumbers(offerB),
        money
      );

      setResult({ ...comparison, hasMoney: income !== '' && expenses !== '' });
    } catch (error) {
      setErrors([error.message || 'Unable to compare these offers.']);
    }
  };

  const clearAll = () => {
    stopSpeaking();
    setSpeaking(false);
    setOfferA(emptyOffer);
    setOfferB(emptyOffer);
    setIncome('');
    setExpenses('');
    setResult(null);
    setErrors([]);
  };

  const loadSamples = () => {
    setOfferA(SAMPLE_A);
    setOfferB(SAMPLE_B);
    setIncome('65000');
    setExpenses('28000');
    setResult(null);
    setErrors([]);
  };

  const winnerKey =
    result?.betterOffer === 'Offer A'
      ? 'A'
      : result?.betterOffer === 'Offer B'
        ? 'B'
        : null;

  const winnerName = winnerKey === 'A' ? t.offerA : t.offerB;

  const verdictText = !result
    ? ''
    : winnerKey
      ? t.cheaper(winnerName, rupees(result.savings))
      : t.equal;

  const handleListen = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    speak(verdictText, lang, { onEnd: () => setSpeaking(false) });
  };

  const rows = result
    ? [
        [t.emi, (o) => rupees(o.emi)],
        [t.effective, (o) => `${o.effectiveAnnualRate.toFixed(1)}%`],
        [t.hidden, (o) => rupees(o.hiddenExtra)],
        [t.received, (o) => rupees(o.moneyReceived)],
        [t.totalPaid, (o) => rupees(o.totalPaid)],
        [t.cost, (o) => rupees(o.totalCostOfBorrowing)],
      ]
    : [];

  return (
    <div className="tc">
      <header className="tc-header">
        <h1>{t.title}</h1>
        <p>{t.intro}</p>

        <label className="tc-label tc-lang">
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {LANGUAGE_OPTIONS.filter((option) => option.value !== 'auto').map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="tc-compare-forms">
        <OfferForm title={t.offerA} offer={offerA} onChange={setOfferA} t={t} />
        <OfferForm title={t.offerB} offer={offerB} onChange={setOfferB} t={t} />
      </div>

      <section className="tc-card">
        <div className="tc-grid tc-grid-2">
          <label className="tc-field">
            <span className="tc-label">{t.income}</span>
            <input
              type="number"
              min="0"
              value={income}
              onChange={(event) => setIncome(event.target.value)}
            />
          </label>

          <label className="tc-field">
            <span className="tc-label">{t.expenses}</span>
            <input
              type="number"
              min="0"
              value={expenses}
              onChange={(event) => setExpenses(event.target.value)}
            />
          </label>
        </div>

        <div className="tc-row">
          <button className="tc-btn" onClick={handleCompare}>
            {t.compareButton}
          </button>

          <button className="tc-btn link" onClick={loadSamples}>
            {t.sampleButton}
          </button>

          <button className="tc-btn link" onClick={clearAll}>
            {t.clearButton}
          </button>
        </div>
      </section>

      {errors.length > 0 && (
        <section className="tc-card error">
          <p>{t.fixErrors}</p>
          {errors.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </section>
      )}

      {result && (
        <>
          <section className={`tc-card tc-winner ${winnerKey ? 'win' : 'tie'}`}>
            <h2>{verdictText}</h2>

            {canSpeak() && (
              <button className="tc-btn secondary" onClick={handleListen}>
                {speaking ? '⏹' : '🔊'}
              </button>
            )}
          </section>

          <section className="tc-card">
            <table className="tc-table tc-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th className={winnerKey === 'A' ? 'tc-best' : ''}>
                    {t.offerA} {winnerKey === 'A' && `✓ ${t.better}`}
                  </th>
                  <th className={winnerKey === 'B' ? 'tc-best' : ''}>
                    {t.offerB} {winnerKey === 'B' && `✓ ${t.better}`}
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map(([label, format]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{format(result.offerA)}</td>
                    <td>{format(result.offerB)}</td>
                  </tr>
                ))}

                {result.hasMoney && (
                  <tr>
                    <td>{t.verdictLabel}</td>
                    <td>{t.verdicts[result.offerA.verdict]}</td>
                    <td>{t.verdicts[result.offerB.verdict]}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <p className="tc-small">{t.note}</p>
          </section>
        </>
      )}

      <footer className="tc-footer">Educational tool, not financial advice.</footer>
    </div>
  );
}