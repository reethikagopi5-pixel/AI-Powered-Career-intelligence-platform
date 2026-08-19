export function formatRupeeSalary(val: number): {
  lpa: string;          // e.g. "14.5 LPA"
  lakhsShort: string;   // e.g. "₹14.5L"
  formatted: string;    // e.g. "₹14,50,000"
  perYear: string;      // e.g. "₹14,50,000 / yr"
  rawINR: number;       // e.g. 1450000
  lpaValue: number;     // e.g. 14.5
} {
  let inrAmount = val;
  if (!val || isNaN(val)) inrAmount = 1250000;

  // Scale old USD figures (e.g. 50k - 250k) to Indian Rupee Tech market (e.g. ₹6 Lakhs to ₹30 Lakhs)
  if (inrAmount >= 30000 && inrAmount <= 250000) {
    inrAmount = Math.round((inrAmount * 12) / 10000) * 10000;
  } else if (inrAmount < 100) {
    // If value is given in LPA directly e.g. 14.5
    inrAmount = Math.round(inrAmount * 100000);
  }

  const lpaVal = (inrAmount / 100000).toFixed(1);
  const formattedInr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrAmount);

  return {
    lpa: `${lpaVal} LPA`,
    lakhsShort: `₹${lpaVal}L`,
    formatted: formattedInr,
    perYear: `${formattedInr} / yr`,
    rawINR: inrAmount,
    lpaValue: parseFloat(lpaVal),
  };
}
