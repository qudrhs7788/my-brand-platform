/* 2026년 기준 급여 세금·4대보험 계산 (브라우저와 Node 공용) */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TAX = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var MAN = 10000;

  var RATES = {
    pension: 0.0475,          // 국민연금 근로자 부담
    pensionMin: 410000,       // 기준소득월액 하한 (2026.7~2027.6)
    pensionMax: 6590000,      // 기준소득월액 상한 (2026.7~2027.6)
    health: 0.03595,          // 건강보험 근로자 부담
    careOfHealth: 0.9448 / 7.19, // 장기요양: 건강보험료의 약 13.14%
    employ: 0.009             // 고용보험 근로자 부담
  };

  function floor10(x) { return Math.floor((x + 1e-6) / 10) * 10; }

  /* 월 과세 급여 기준 4대보험 근로자 부담액 */
  function insurance(monthly) {
    var base = Math.floor(monthly / 1000) * 1000;
    var pBase = Math.min(Math.max(base, RATES.pensionMin), RATES.pensionMax);
    var pension = monthly > 0 ? floor10(pBase * RATES.pension) : 0;
    var health = floor10(monthly * RATES.health);
    var care = floor10(health * RATES.careOfHealth);
    var employ = floor10(monthly * RATES.employ);
    return { pension: pension, health: health, care: care, employ: employ,
             total: pension + health + care + employ };
  }

  /* 근로소득공제 */
  function earnedDeduction(total) {
    var d;
    if (total <= 500 * MAN) d = total * 0.7;
    else if (total <= 1500 * MAN) d = 350 * MAN + (total - 500 * MAN) * 0.4;
    else if (total <= 4500 * MAN) d = 750 * MAN + (total - 1500 * MAN) * 0.15;
    else if (total <= 10000 * MAN) d = 1200 * MAN + (total - 4500 * MAN) * 0.05;
    else d = 1475 * MAN + (total - 10000 * MAN) * 0.02;
    return Math.min(d, 2000 * MAN, total);
  }

  /* 종합소득세 기본세율 (2023년 이후) */
  var BRACKETS = [
    [1400 * MAN, 0.06], [5000 * MAN, 0.15], [8800 * MAN, 0.24], [15000 * MAN, 0.35],
    [30000 * MAN, 0.38], [50000 * MAN, 0.40], [100000 * MAN, 0.42], [Infinity, 0.45]
  ];
  function progressive(base) {
    var tax = 0, prev = 0;
    if (base <= 0) return 0;
    for (var i = 0; i < BRACKETS.length; i++) {
      var top = BRACKETS[i][0], rate = BRACKETS[i][1];
      if (base > top) { tax += (top - prev) * rate; prev = top; }
      else { tax += (base - prev) * rate; break; }
    }
    return tax;
  }
  function marginalRate(base) {
    for (var i = 0; i < BRACKETS.length; i++) if (base <= BRACKETS[i][0]) return BRACKETS[i][1];
    return 0.45;
  }

  /* 근로소득 간이세액표 (소득세법 시행령 별표2, 2026.2.27 개정) 계산식 재현.
     표 자체가 국민연금 4.5%·상한 449만원과 예전 근로소득세액공제 기준으로 만들어져 있어 그대로 따른다. */
  function tableTax(monthly, family) {
    var k = monthly / 1000, mid;
    if (k >= 10000) mid = 10000;
    else {
      var step = k < 1500 ? 5 : (k < 3000 ? 10 : 20);
      mid = Math.floor(k / step) * step + step / 2;
    }
    var total = mid * 1000 * 12;
    var fam = Math.max(1, family);
    var pension = Math.min(mid * 1000, 4490000) * 0.045 * 12;
    var special, over3000 = Math.max(0, total - 3000 * MAN);
    if (fam === 1) {
      if (total <= 3000 * MAN) special = 310 * MAN + total * 0.04;
      else if (total <= 4500 * MAN) special = 310 * MAN + total * 0.04 - over3000 * 0.05;
      else if (total <= 7000 * MAN) special = 310 * MAN + total * 0.015;
      else special = 310 * MAN + total * 0.005;
    } else if (fam === 2) {
      if (total <= 3000 * MAN) special = 360 * MAN + total * 0.04;
      else if (total <= 4500 * MAN) special = 360 * MAN + total * 0.04 - over3000 * 0.05;
      else if (total <= 7000 * MAN) special = 360 * MAN + total * 0.02;
      else special = 360 * MAN + total * 0.01;
    } else {
      if (total <= 3000 * MAN) special = 500 * MAN + total * 0.07;
      else if (total <= 4500 * MAN) special = 500 * MAN + total * 0.07 - over3000 * 0.05;
      else if (total <= 7000 * MAN) special = 500 * MAN + total * 0.05;
      else special = 500 * MAN + total * 0.03;
      special += Math.max(0, total - 4000 * MAN) * 0.04;
    }
    var base = total - earnedDeduction(total) - 150 * MAN * fam - pension - special;
    var tax = progressive(Math.max(0, base));
    var credit = tax <= 50 * MAN ? tax * 0.55 : 27.5 * MAN + (tax - 50 * MAN) * 0.3;
    var cap = total <= 5500 * MAN ? 66 * MAN : (total <= 7000 * MAN ? 63 * MAN : 50 * MAN);
    credit = Math.min(credit, cap);
    return Math.max(0, floor10((tax - credit) / 12));
  }

  /* 매달 원천징수되는 소득세 (자녀 공제 포함) */
  function simpleTax(monthly, family, kids) {
    var tax;
    if (monthly <= 10000000) tax = tableTax(monthly, family);
    else {
      var b = tableTax(10000000, family), m = monthly;
      if (m <= 14000000) tax = b + (m - 10000000) * 0.98 * 0.35 + 25000;
      else if (m <= 28000000) tax = b + 1397000 + (m - 14000000) * 0.98 * 0.38;
      else if (m <= 30000000) tax = b + 6610600 + (m - 28000000) * 0.98 * 0.40;
      else if (m <= 45000000) tax = b + 7394600 + (m - 30000000) * 0.40;
      else if (m <= 87000000) tax = b + 13394600 + (m - 45000000) * 0.42;
      else tax = b + 31034600 + (m - 87000000) * 0.45;
      tax = floor10(tax);
    }
    var n = Math.max(0, kids || 0), off = 0;
    if (n === 1) off = 20830;
    else if (n === 2) off = 45830;
    else if (n > 2) off = 45830 + (n - 2) * 33330;
    return Math.max(0, tax - off);
  }

  /* 연봉 → 월 실수령액 */
  function netPay(o) {
    var gross = Math.round(o.annual / 12);
    var nontax = Math.min(o.nontaxMonthly || 0, gross);
    var taxable = gross - nontax;
    var ins = insurance(taxable);
    var income = simpleTax(taxable, o.family || 1, o.kids || 0);
    var local = floor10(income * 0.1);
    var deduct = ins.total + income + local;
    return { gross: gross, taxable: taxable, nontax: nontax, ins: ins,
             incomeTax: income, localTax: local, deduct: deduct, net: gross - deduct };
  }

  /* 근로소득세액공제 (현행 소득세법) */
  function earnedCredit(tax, total) {
    var c = tax <= 130 * MAN ? tax * 0.55 : 71.5 * MAN + (tax - 130 * MAN) * 0.3;
    var cap;
    if (total <= 3300 * MAN) cap = 74 * MAN;
    else if (total <= 7000 * MAN) cap = Math.max(66 * MAN, 74 * MAN - (total - 3300 * MAN) * 0.008);
    else if (total <= 12000 * MAN) cap = Math.max(50 * MAN, 66 * MAN - (total - 7000 * MAN) * 0.5);
    else cap = Math.max(20 * MAN, 50 * MAN - (total - 12000 * MAN) * 0.5);
    return Math.min(c, cap);
  }

  function childCredit(n) {
    if (n <= 0) return 0;
    if (n === 1) return 25 * MAN;
    if (n === 2) return 55 * MAN;
    return 55 * MAN + (n - 2) * 40 * MAN;
  }

  /* 신용카드 등 소득공제 */
  function cardDeduction(total, credit, debit, market) {
    var threshold = total * 0.25, rest = threshold;
    var c = Math.max(0, credit - rest); rest = Math.max(0, rest - credit);
    var d = Math.max(0, debit - rest); rest = Math.max(0, rest - debit);
    var m = Math.max(0, market - rest);
    var normal = c * 0.15 + d * 0.3, extra = m * 0.4;
    var baseCap = total <= 7000 * MAN ? 300 * MAN : 250 * MAN;
    var extraCap = total <= 7000 * MAN ? 300 * MAN : 200 * MAN;
    var sum = normal + extra;
    if (sum <= baseCap) return sum;
    return baseCap + Math.min(sum - baseCap, extra, extraCap);
  }

  /* 연말정산 예상 (주요 항목만) */
  function yearEnd(o) {
    var total = o.total, fam = Math.max(1, o.family || 1);
    var monthly = total / 12, ins = insurance(monthly);
    var pensionYear = ins.pension * 12;
    var healthYear = (ins.health + ins.care + ins.employ) * 12;
    var ed = earnedDeduction(total);
    var card = cardDeduction(total, o.credit || 0, o.debit || 0, o.market || 0);
    var base = Math.max(0, total - ed - 150 * MAN * fam - pensionYear - healthYear - card);
    var tax = progressive(base);
    var credits = [];
    function add(name, amt) { if (amt > 0) credits.push({ name: name, amount: amt }); }
    add("근로소득 세액공제", earnedCredit(tax, total));
    add("자녀 세액공제", childCredit(o.kids || 0));
    var pensionSave = Math.min(Math.min(o.pensionSaving || 0, 600 * MAN) + (o.irp || 0), 900 * MAN);
    add("연금계좌 세액공제", pensionSave * (total <= 5500 * MAN ? 0.15 : 0.12));
    add("보장성 보험료 세액공제", Math.min(o.insurancePremium || 0, 100 * MAN) * 0.12);
    add("의료비 세액공제", Math.min(Math.max(0, (o.medical || 0) - total * 0.03), 700 * MAN) * 0.15);
    add("교육비 세액공제", (o.education || 0) * 0.15);
    var don = o.donation || 0;
    add("기부금 세액공제", Math.min(don, 1000 * MAN) * 0.15 + Math.max(0, don - 1000 * MAN) * 0.3);
    if (total <= 8000 * MAN)
      add("월세 세액공제", Math.min(o.rent || 0, 1000 * MAN) * (total <= 5500 * MAN ? 0.17 : 0.15));
    var creditSum = 0;
    credits.forEach(function (c) { creditSum += c.amount; });
    var finalIncome = floor10(Math.max(0, tax - creditSum));
    var finalLocal = floor10(finalIncome * 0.1);
    var paidIncome = o.paid != null ? o.paid : simpleTax(monthly, fam, o.kids || 0) * 12;
    var paidLocal = floor10(paidIncome * 0.1);
    return {
      earnedDeduction: ed, pensionYear: pensionYear, healthYear: healthYear, card: card,
      personal: 150 * MAN * fam, base: base, tax: tax, credits: credits, creditSum: creditSum,
      finalIncome: finalIncome, finalLocal: finalLocal, paidIncome: paidIncome, paidLocal: paidLocal,
      refund: (paidIncome + paidLocal) - (finalIncome + finalLocal), rate: marginalRate(base)
    };
  }

  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  return { RATES: RATES, insurance: insurance, earnedDeduction: earnedDeduction,
           progressive: progressive, tableTax: tableTax, simpleTax: simpleTax, netPay: netPay,
           earnedCredit: earnedCredit, cardDeduction: cardDeduction, yearEnd: yearEnd,
           won: won, floor10: floor10 };
});
