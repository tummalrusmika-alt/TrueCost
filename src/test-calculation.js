import { calcEMI, analyzeLoan } from './calc.js';
import { checkScamRisk } from './scamCheck.js';

const approx = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;
let failed = 0;
const check = (name, cond) => {
  console.log((cond ? 'PASS ' : 'FAIL ') + name);
  if (!cond) failed++;
};

// Known calculator result: 1,00,000 @ 12% for 12 months => EMI 8884.88
check('EMI 100000 @12% 12m', approx(calcEMI(100000, 12, 12), 8884.88));
check('Zero interest', approx(calcEMI(12000, 0, 12), 1000));
check('Bad input returns 0', calcEMI('', 12, 0) === 0);

const r = analyzeLoan({ amount: 100000, annualRate: 12, months: 12 });
check('No fees: effective ~ (1+0.01)^12-1 = 12.68%', approx(r.effectiveAnnualRate, 12.68, 0.05));

const f = analyzeLoan({ amount: 100000, annualRate: 12, months: 12, processingFee: 2000 });
check('GST = 360', approx(f.gstOnFee, 360));
check('Received = 97640', approx(f.moneyReceived, 97640));
check('Fees raise effective rate', f.effectiveAnnualRate > r.effectiveAnnualRate);

const flat = analyzeLoan({ amount: 100000, annualRate: 10, months: 12, rateType: 'flat' });
check('Flat 10%: interest 10000', approx(flat.totalInterest, 10000));
check('Flat effective > 10%', flat.effectiveAnnualRate > 17);

check('Invalid input handled', analyzeLoan({ amount: 0, months: 0 }).ok === false);

const s = checkScamRisk('URGENT! Pay processing fee now and share OTP to get your loan: bit.ly/abc');
check('Scam message is High risk', s.level === 'High');

console.log(failed ? `\n${failed} FAILED` : '\nAll tests passed');