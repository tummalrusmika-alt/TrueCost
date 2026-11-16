// Rule-based extraction of loan terms from pasted text (code, not AI).
const toNumber = (s, unit) => {
  let n = parseFloat(s);
  if (!Number.isFinite(n)) return '';
  const u = (unit || '').toLowerCase();
  if (u === 'lakh' || u === 'lac') n *= 100000;
  if (u === 'k') n *= 1000;
  return n;
};

export function extractTermsFromText(text) {
  const t = String(text || '').replace(/,/g, '');
  const out = { amount: '', annualRate: '', months: '', processingFee: '', rateType: 'reducing' };
  if (!t.trim()) return out;

  // Loan amount
  let m = t.match(/(?:loan|amount|price|worth|purchase|cost)[^\d₹]{0,30}(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|k)?/i);
  if (!m) m = t.match(/(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(lakh|lac|k)?/i);
  if (m) out.amount = toNumber(m[1], m[2]);

  // Interest rate
  const rate = t.match(/(\d+(?:\.\d+)?)\s*%\s*(?:p\.?a\.?|per\s*annum|pa|interest|flat|reducing|roi)?/i);
  if (rate) out.annualRate = parseFloat(rate[1]);
  if (/no[\s-]*cost\s*emi|0\s*%\s*(interest|emi)/i.test(t) && out.annualRate === '') out.annualRate = 0;
  if (/flat/i.test(t)) out.rateType = 'flat';

  // Tenure
  const ten = t.match(/(\d+)\s*(months?|mos?|yrs?|years?)/i);
  if (ten) {
    const n = parseInt(ten[1], 10);
    out.months = /^y/i.test(ten[2]) ? n * 12 : n;
  }

  // Processing fee (rupees or percent)
  const feeRs = t.match(/processing\s*fees?[^\d₹%]{0,20}(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)/i);
  const feePct = t.match(/processing\s*fees?[^\d]{0,15}(\d+(?:\.\d+)?)\s*%/i);
  if (feeRs) out.processingFee = parseFloat(feeRs[1]);
  else if (feePct && out.amount) out.processingFee = Math.round((out.amount * parseFloat(feePct[1])) / 100);

  return out;
}