/* 사이트 전체 페이지를 생성합니다:  node scripts/build.js
   새 페이지는 아래 pages 배열에 추가하면 첫 화면·사이트맵에 자동으로 들어갑니다. */
const fs = require("fs");
const path = require("path");
const TAX = require("../assets/tax.js");

const ROOT = path.join(__dirname, "..");
const SITE = "생활 계산기";
const BASE_URL = "https://qudrhs7788.github.io/my-brand-platform/";
const UPDATED = "2026년 11월";
const won = (n) => Math.round(n).toLocaleString("ko-KR");

function layout(p) {
  const up = p.slug ? "../" : "";
  const others = pages.filter((x) => x.slug && x.slug !== p.slug);
  const related = p.slug
    ? `<nav class="related" aria-label="다른 페이지">${others.map((x) => `<a href="../${x.slug}/">${x.short}</a>`).join("")}</nav>`
    : "";
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}${p.slug ? " | " + SITE : ""}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${BASE_URL}${p.slug ? p.slug + "/" : ""}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${BASE_URL}${p.slug ? p.slug + "/" : ""}">
<meta property="og:site_name" content="${SITE}">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="${up}assets/style.css">
</head>
<body>
<header class="top"><div class="top-in">
  <a class="brand" href="${up || "./"}"><i></i>${SITE}</a>
  <nav><a href="${up}salary/">실수령액</a><a href="${up}year-end-tax/">연말정산</a><a href="${up}salary-table/">연봉표</a></nav>
</div></header>
<main class="wrap">
${p.body}
${related}
<footer class="foot">
  <p>${p.foot || "계산 결과는 참고용 예상 금액이며 실제 금액과 다를 수 있습니다."}</p>
  <p>기준: ${UPDATED} 현재 시행 중인 요율과 세법 · <a href="${up || "./"}">${SITE} 전체 보기</a></p>
</footer>
</main>
${p.script ? `<script src="${up}assets/tax.js"></script>\n<script src="${up}assets/ui.js"></script>\n<script>\n${p.script}\n</script>` : ""}
</body>
</html>
`;
}

const money = (id, label, value, unit, hint, quick) => `<div class="field">
      <label for="${id}">${label}</label>
      <div class="inputwrap"><input id="${id}" data-money type="text" inputmode="numeric" autocomplete="off" value="${value}" placeholder="0"><span class="unit">${unit}</span></div>${
        quick ? `\n      <div class="quick">${quick.map(([t, v]) => `<button type="button" data-for="${id}" data-v="${v}">${t}</button>`).join("")}</div>` : ""}${
        hint ? `\n      <p class="hint">${hint}</p>` : ""}
    </div>`;
const stepper = (id, label, value, min, max, hint) => `<div class="field">
      <span class="label" id="${id}-l">${label}</span>
      <div class="stepper" data-min="${min}" data-max="${max}" role="group" aria-labelledby="${id}-l">
        <button type="button" data-d="-1" aria-label="${label} 줄이기">−</button>
        <output id="${id}">${value}</output>
        <button type="button" data-d="1" aria-label="${label} 늘리기">+</button>
      </div>${hint ? `\n      <p class="hint">${hint}</p>` : ""}
    </div>`;

/* ---------- 연봉 실수령액 표 (정적 생성) ---------- */
function salaryRows() {
  const list = [];
  for (let a = 2000; a <= 10000; a += 100) list.push(a);
  for (let a = 10500; a <= 20000; a += 500) list.push(a);
  return list.map((a) => {
    const r = TAX.netPay({ annual: a * 10000, nontaxMonthly: 200000, family: 1, kids: 0 });
    const name = a >= 10000 ? (a % 10000 === 0 ? a / 10000 + "억" : Math.floor(a / 10000) + "억 " + won(a % 10000) + "만") : won(a) + "만";
    return `<tr><td>${name}원</td><td class="em">${won(r.net)}</td><td>${won(r.deduct)}</td><td>${won(r.ins.pension)}</td><td>${won(r.ins.health)}</td><td>${won(r.ins.care)}</td><td>${won(r.ins.employ)}</td><td>${won(r.incomeTax)}</td><td>${won(r.localTax)}</td></tr>`;
  }).join("\n          ");
}
function rows2027() {
  const list = [];
  for (let a = 2400; a <= 10000; a += 200) list.push(a);
  for (let a = 11000; a <= 20000; a += 1000) list.push(a);
  return list.map((a) => {
    const o = { annual: a * 10000, nontaxMonthly: 200000, family: 1, kids: 0 };
    const r26 = TAX.netPay(o), r27 = TAX.netPay({ ...o, rates: TAX.RATES_2027 });
    const d = r27.net - r26.net;
    const name = a >= 10000 ? (a % 10000 === 0 ? a / 10000 + "억" : Math.floor(a / 10000) + "억 " + won(a % 10000) + "만") : won(a) + "만";
    return `<tr><td>${name}원</td><td>${won(r26.net)}</td><td class="em">${won(r27.net)}</td><td>${won(d)}</td><td>${won(d * 12)}</td><td>${won(r27.ins.pension)}</td><td>${won(r27.ins.health)}</td><td>${won(r27.ins.care)}</td></tr>`;
  }).join("\n          ");
}
const diff27 = (a) => { const o = { annual: a * 10000, nontaxMonthly: 200000, family: 1, kids: 0 }; return TAX.netPay(o).net - TAX.netPay({ ...o, rates: TAX.RATES_2027 }).net; };
const ex = (m) => TAX.insurance(m);
const insRow = (m) => { const i = ex(m * 10000); return `<tr><td>${won(m)}만원</td><td>${won(i.pension)}</td><td>${won(i.health)}</td><td>${won(i.care)}</td><td>${won(i.employ)}</td><td class="em">${won(i.total)}</td></tr>`; };

const pages = [
  /* ---------- 첫 화면 ---------- */
  {
    slug: "", title: SITE, short: "홈",
    desc: "연봉 실수령액, 연말정산 환급액, 3.3% 세금, 육아휴직 급여를 바로 계산하고 2026년 연봉 실수령액 표와 4대보험 요율을 확인하세요.",
    body: () => `<section class="hero">
    <span class="eyebrow">2026년 기준</span>
    <h1>월급과 세금,<br>바로 계산해 보세요</h1>
    <p class="lede">가입도 설치도 필요 없습니다. 숫자만 넣으면 결과가 바로 나옵니다.</p>
  </section>
  <h2 class="section-title">계산기</h2>
  <ul class="tiles">${pages.filter((p) => p.kind === "calc").map((p) => `
    <li><a class="tile" href="${p.slug}/"><span class="tag">계산기</span><strong>${p.short}</strong><span class="d">${p.tile}</span></a></li>`).join("")}
  </ul>
  <h2 class="section-title">한눈에 보는 정보</h2>
  <ul class="tiles">${pages.filter((p) => p.kind === "info").map((p) => `
    <li><a class="tile" href="${p.slug}/"><span class="tag">정보</span><strong>${p.short}</strong><span class="d">${p.tile}</span></a></li>`).join("")}
  </ul>`
  },

  /* ---------- 연봉 실수령액 계산기 ---------- */
  {
    slug: "salary", kind: "calc", short: "연봉 실수령액 계산기",
    title: "2026 연봉 실수령액 계산기",
    tile: "연봉이나 월급을 넣으면 4대보험과 세금을 뺀 월 실수령액을 보여줍니다.",
    desc: "2026년 4대보험 요율과 근로소득 간이세액표를 반영한 연봉 실수령액 계산기. 국민연금, 건강보험, 소득세를 뺀 월급을 바로 확인하세요.",
    body: () => `<section class="hero">
    <span class="eyebrow">2026년 요율 반영</span>
    <h1>연봉 실수령액 계산기</h1>
    <p class="lede">4대보험과 소득세를 빼고 매달 통장에 들어오는 금액을 계산합니다.</p>
  </section>
  <section class="card" aria-label="입력">
    <fieldset><legend>기준 연도</legend>
      <div class="seg">
        <label><input type="radio" name="yr" value="2026" checked><span>2026년</span></label>
        <label><input type="radio" name="yr" value="2027"><span>2027년 (예상)</span></label>
      </div>
      <p class="note" id="yrnote" hidden>2027년은 확정된 국민연금 5%와 장기요양보험 인상만 반영한 예상입니다. 고용보험과 소득세는 2026년 기준 그대로 계산합니다.</p>
    </fieldset>
    <fieldset><legend>입력 기준</legend>
      <div class="seg">
        <label><input type="radio" name="mode" value="year" checked><span>연봉</span></label>
        <label><input type="radio" name="mode" value="month"><span>월급</span></label>
      </div>
    </fieldset>
    ${money("pay", "세전 금액", "4,000", "만원", "", [["3,000만", 3000], ["4,000만", 4000], ["5,000만", 5000], ["6,000만", 6000], ["8,000만", 8000], ["1억", 10000]])}
    <div class="grid2">
    ${stepper("family", "부양가족 수 (본인 포함)", 1, 1, 11, "")}
    ${stepper("kids", "8~20세 자녀 수", 0, 0, 10, "")}
    </div>
    ${money("nontax", "비과세 금액 (월)", "20", "만원", "식대는 월 20만원까지 세금을 내지 않습니다. 없으면 0을 넣으세요.")}
  </section>
  <section class="result" aria-live="polite">
    <span class="label">월 예상 실수령액</span>
    <span class="big" id="net">0원</span>
    <span class="sub" id="netsub"></span>
  </section>
  <section class="card">
    <h2>매달 빠지는 금액</h2>
    <ul class="rows" id="rows"></ul>
  </section>
  <section class="card prose">
    <h2>어떻게 계산하나요</h2>
    <p>2027년(예상)을 고르면 국민연금 5%, 장기요양보험 13.90%로 바꿔 계산합니다. 아래 설명은 2026년 기준입니다.</p>
    <p>4대보험은 2026년 근로자 부담 요율(국민연금 4.75%, 건강보험 3.595%, 장기요양보험은 건강보험료의 약 13.14%, 고용보험 0.9%)을 적용합니다. 국민연금은 월 659만원까지만 보험료를 매깁니다.</p>
    <p>소득세는 회사가 매달 떼는 기준인 근로소득 간이세액표(2026년 3월 시행분)의 계산 방식을 그대로 따릅니다. 지방소득세는 소득세의 10%입니다.</p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>급여명세서와 금액이 조금 다른데요?</h3><p>회사마다 비과세 수당, 상여금 지급 방식, 건강보험 정산이 달라 차이가 날 수 있습니다. 소득세를 80%나 120%로 선택한 경우에도 달라집니다.</p></div>
    <div><h3>부양가족 수는 어떻게 세나요?</h3><p>본인을 포함해 연말정산에서 기본공제를 받는 가족 수입니다. 혼자라면 1명, 소득이 없는 배우자가 있으면 2명입니다.</p></div>
    <div><h3>여기서 뗀 세금이 최종 세금인가요?</h3><p>아닙니다. 매달 떼는 세금은 어림한 금액이고, 다음 해 연말정산에서 실제 세금과 비교해 돌려받거나 더 냅니다.</p></div>
  </section>`,
    script: `function render() {
  var mode = UI.radio("mode"), pay = UI.num("pay") * 10000;
  var annual = mode === "year" ? pay : pay * 12;
  var fam = UI.step("family"), kids = Math.min(UI.step("kids"), Math.max(0, fam - 1));
  document.getElementById("kids").textContent = kids;
  var y27 = UI.radio("yr") === "2027", R = y27 ? TAX.RATES_2027 : TAX.RATES;
  document.getElementById("yrnote").hidden = !y27;
  var r = TAX.netPay({ annual: annual, nontaxMonthly: UI.num("nontax") * 10000, family: fam, kids: kids, rates: R });
  var w = TAX.won;
  document.getElementById("net").textContent = w(Math.max(0, r.net));
  document.getElementById("netsub").textContent = annual > 0 ? "1년 합계 약 " + w(Math.max(0, r.net) * 12) + " · 세전 월 " + w(r.gross) : "세전 금액을 입력하세요.";
  var items = [["국민연금", (R.pension * 100) + "%", r.ins.pension], ["건강보험", "3.595%", r.ins.health], ["장기요양보험", "건강보험료의 " + (R.careOfHealth * 100).toFixed(2) + "%", r.ins.care],
    ["고용보험", "0.9%", r.ins.employ], ["소득세", "간이세액표", r.incomeTax], ["지방소득세", "소득세의 10%", r.localTax]];
  var html = items.map(function (i) { return '<li><span class="k">' + i[0] + ' <small>' + i[1] + '</small></span><span class="v">' + w(i[2]) + '</span></li>'; }).join("");
  html += '<li class="sum"><span class="k">공제 합계</span><span class="v">' + w(r.deduct) + '</span></li>';
  document.getElementById("rows").innerHTML = html;
}
UI.init(render);`
  },

  /* ---------- 연말정산 ---------- */
  {
    slug: "year-end-tax", kind: "calc", short: "연말정산 환급액 계산기",
    title: "연말정산 예상 환급액 계산기",
    tile: "총급여와 카드 사용액, 월세 등을 넣어 환급액 또는 추가 납부액을 미리 봅니다.",
    desc: "총급여, 신용카드 사용액, 연금저축, 월세 등 주요 항목으로 연말정산 예상 환급액과 추가 납부 세액을 미리 계산합니다.",
    foot: "주요 공제 항목만 반영한 어림 계산입니다. 주택자금, 중소기업 취업자 감면 등은 포함하지 않았으며 실제 결과는 국세청 홈택스 연말정산 미리보기로 확인하세요.",
    body: () => `<section class="hero">
    <span class="eyebrow">13월의 월급 미리 보기</span>
    <h1>연말정산 환급액 계산기</h1>
    <p class="lede">주요 항목만 넣어도 돌려받을지, 더 낼지 대략 알 수 있습니다.</p>
  </section>
  <section class="card" aria-label="입력">
    ${money("total", "총급여 (연봉에서 비과세를 뺀 금액)", "5,000", "만원", "", [["3,000만", 3000], ["4,000만", 4000], ["5,000만", 5000], ["7,000만", 7000], ["1억", 10000]])}
    <div class="grid2">
    ${stepper("family", "부양가족 수 (본인 포함)", 1, 1, 11, "")}
    ${stepper("kids", "8세 이상 자녀 수", 0, 0, 10, "")}
    </div>
    <div class="grid2">
    ${money("credit", "신용카드 (연)", "1,500", "만원", "")}
    ${money("debit", "체크카드·현금영수증 (연)", "500", "만원", "")}
    </div>
    <details class="more">
      <summary>공제 항목 더 넣기</summary>
      <div class="inner">
        <div class="grid2">
        ${money("market", "전통시장·대중교통 (연)", "", "만원", "")}
        ${money("rent", "월세 낸 금액 (연)", "", "만원", "무주택 세대주, 총급여 8,000만원 이하")}
        ${money("psave", "연금저축 납입액 (연)", "", "만원", "600만원까지")}
        ${money("irp", "IRP 납입액 (연)", "", "만원", "연금저축과 합쳐 900만원까지")}
        ${money("medical", "의료비 (연)", "", "만원", "총급여의 3%를 넘는 금액만 공제")}
        ${money("edu", "교육비 (연)", "", "만원", "")}
        ${money("ins", "보장성 보험료 (연)", "", "만원", "100만원까지")}
        ${money("don", "기부금 (연)", "", "만원", "")}
        </div>
        ${money("paid", "올해 월급에서 뗀 소득세 합계", "", "만원", "비워 두면 간이세액표 기준으로 자동 계산합니다. 급여명세서의 소득세를 모두 더한 금액입니다.")}
      </div>
    </details>
  </section>
  <section class="result" id="box" aria-live="polite">
    <span class="label" id="rlabel">예상 환급액</span>
    <span class="big" id="refund">0원</span>
    <span class="sub" id="rsub"></span>
  </section>
  <section class="card">
    <h2>계산 내역</h2>
    <ul class="rows" id="rows"></ul>
    <p class="hint" id="tip"></p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>신용카드를 얼마나 써야 공제받나요?</h3><p>카드와 현금영수증 사용액이 총급여의 25%를 넘어야 하고, 넘는 금액에 대해서만 공제됩니다. 공제율은 신용카드 15%, 체크카드와 현금영수증 30%, 전통시장과 대중교통 40%입니다.</p></div>
    <div><h3>환급액을 늘리는 가장 쉬운 방법은?</h3><p>연말 전에 할 수 있는 것은 연금저축과 IRP 납입입니다. 합쳐서 900만원까지 납입액의 13.2%(총급여 5,500만원 이하는 16.5%)를 세금에서 빼줍니다.</p></div>
    <div><h3>월세 세액공제 조건은?</h3><p>총급여 8,000만원 이하 무주택 세대주가 국민주택규모 또는 기준시가 4억원 이하 주택에 살면서 전입신고를 한 경우, 연 1,000만원까지 월세의 15%(총급여 5,500만원 이하는 17%)를 공제받습니다.</p></div>
  </section>`,
    script: `function render() {
  var M = 10000, w = TAX.won;
  var fam = UI.step("family"), kids = Math.min(UI.step("kids"), Math.max(0, fam - 1));
  document.getElementById("kids").textContent = kids;
  var paidEl = document.getElementById("paid");
  var o = { total: UI.num("total") * M, family: fam, kids: kids, credit: UI.num("credit") * M, debit: UI.num("debit") * M,
    market: UI.num("market") * M, rent: UI.num("rent") * M, pensionSaving: UI.num("psave") * M, irp: UI.num("irp") * M,
    medical: UI.num("medical") * M, education: UI.num("edu") * M, insurancePremium: UI.num("ins") * M, donation: UI.num("don") * M,
    paid: paidEl.value.trim() === "" ? null : UI.num("paid") * M };
  var box = document.getElementById("box");
  if (o.total <= 0) {
    box.className = "result";
    document.getElementById("rlabel").textContent = "예상 환급액";
    document.getElementById("refund").textContent = "0원";
    document.getElementById("rsub").textContent = "총급여를 입력하세요.";
    document.getElementById("rows").innerHTML = ""; document.getElementById("tip").textContent = "";
    return;
  }
  var r = TAX.yearEnd(o);
  var plus = r.refund >= 0;
  box.className = "result " + (plus ? "plus" : "minus");
  document.getElementById("rlabel").textContent = plus ? "예상 환급액 (돌려받는 돈)" : "예상 추가 납부액 (더 내는 돈)";
  document.getElementById("refund").textContent = w(Math.abs(r.refund));
  document.getElementById("rsub").textContent = "지방소득세 포함 · 이미 낸 세금 " + w(r.paidIncome + r.paidLocal);
  var rows = [["근로소득공제", r.earnedDeduction], ["인적공제", r.personal], ["국민연금 보험료 공제", r.pensionYear],
    ["건강·고용보험료 공제", r.healthYear], ["신용카드 등 소득공제", r.card], ["과세표준", r.base, 1], ["산출세액", r.tax, 1]];
  r.credits.forEach(function (c) { rows.push([c.name, c.amount]); });
  rows.push(["결정세액 (소득세)", r.finalIncome, 1], ["지방소득세", r.finalLocal], ["이미 낸 소득세", r.paidIncome], ["이미 낸 지방소득세", r.paidLocal]);
  document.getElementById("rows").innerHTML = rows.map(function (x) {
    return '<li' + (x[2] ? ' class="sum"' : '') + '><span class="k">' + x[0] + '</span><span class="v">' + w(x[1]) + '</span></li>';
  }).join("");
  document.getElementById("tip").textContent = "현재 과세표준 구간의 세율은 " + Math.round(r.rate * 100) + "%입니다. 소득공제가 100만원 늘면 세금이 약 " + w(M * 100 * r.rate * 1.1) + " 줄어듭니다.";
}
UI.init(render);`
  },

  /* ---------- 3.3% ---------- */
  {
    slug: "freelancer-tax", kind: "calc", short: "프리랜서 3.3% 세금 계산기",
    title: "프리랜서 3.3% 세금 계산기",
    tile: "계약 금액에서 3.3%를 뗀 실수령액, 또는 받을 금액에 맞는 계약 금액을 계산합니다.",
    desc: "프리랜서·아르바이트 3.3% 원천징수 세금 계산기. 계약 금액에서 소득세 3%와 지방소득세 0.3%를 뺀 실수령액과 역계산을 지원합니다.",
    body: () => `<section class="hero">
    <span class="eyebrow">사업소득 원천징수</span>
    <h1>프리랜서 3.3% 세금 계산기</h1>
    <p class="lede">외주비, 강의료, 아르바이트비에서 3.3%를 떼면 얼마가 들어오는지 계산합니다.</p>
  </section>
  <section class="card" aria-label="입력">
    <fieldset><legend>입력하는 금액</legend>
      <div class="seg">
        <label><input type="radio" name="mode" value="gross" checked><span>세전 (계약 금액)</span></label>
        <label><input type="radio" name="mode" value="net"><span>세후 (받을 금액)</span></label>
      </div>
    </fieldset>
    ${money("amt", "금액", "1,000,000", "원", "", [["50만", 500000], ["100만", 1000000], ["200만", 2000000], ["300만", 3000000], ["500만", 5000000]])}
  </section>
  <section class="result" aria-live="polite">
    <span class="label" id="rlabel">실수령액</span>
    <span class="big" id="out">0원</span>
    <span class="sub" id="sub"></span>
  </section>
  <section class="card">
    <h2>계산 내역</h2>
    <ul class="rows" id="rows"></ul>
  </section>
  <section class="card prose">
    <h2>3.3%는 무엇인가요</h2>
    <p>회사에 소속되지 않고 일한 대가(사업소득)를 받을 때, 주는 쪽이 소득세 3%와 지방소득세 0.3%를 미리 떼고 지급합니다. 뗀 세금은 주는 쪽이 대신 국세청에 냅니다.</p>
    <p>이 3.3%는 미리 낸 세금입니다. 다음 해 5월 종합소득세 신고 때 실제 세금을 계산해서, 미리 낸 금액이 더 많으면 돌려받습니다. 소득이 적은 프리랜서는 환급받는 경우가 많습니다.</p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>금액이 작으면 세금을 안 떼나요?</h3><p>소득세가 1,000원 미만이면 떼지 않습니다. 지급액 기준으로 약 33,330원 이하일 때입니다.</p></div>
    <div><h3>3.3%와 8.8%는 뭐가 다른가요?</h3><p>계속 반복하는 일은 사업소득으로 3.3%를 뗍니다. 한두 번 하는 강연이나 원고료 같은 기타소득은 필요경비 60%를 뺀 금액의 22%, 즉 지급액의 8.8%를 뗍니다.</p></div>
    <div><h3>4대보험도 빠지나요?</h3><p>3.3%를 떼는 프리랜서 계약에서는 회사가 4대보험을 떼지 않습니다. 국민연금과 건강보험은 지역가입자로 따로 냅니다.</p></div>
  </section>`,
    script: `function calc(g) {
  var it = TAX.floor10(g * 0.03);
  if (it < 1000) it = 0;
  var lt = TAX.floor10(it * 0.1);
  return { gross: g, income: it, local: lt, net: g - it - lt };
}
function render() {
  var mode = UI.radio("mode"), v = UI.num("amt"), w = TAX.won, r;
  if (mode === "gross") r = calc(v);
  else {
    var g = Math.round(v / 0.967); r = calc(g);
    for (var i = 0; i < 40 && r.net < v; i++) { g += 10; r = calc(g); }
    if (calc(v).income === 0) r = calc(v);
  }
  document.getElementById("rlabel").textContent = mode === "gross" ? "실수령액" : "필요한 계약 금액 (세전)";
  document.getElementById("out").textContent = w(mode === "gross" ? r.net : r.gross);
  document.getElementById("sub").textContent = v > 0 ? (mode === "gross" ? "떼는 세금 " + w(r.income + r.local) : "이 금액으로 계약하면 " + w(r.net) + "을 받습니다") : "금액을 입력하세요.";
  document.getElementById("rows").innerHTML =
    '<li><span class="k">계약 금액 (세전)</span><span class="v">' + w(r.gross) + '</span></li>' +
    '<li><span class="k">소득세 <small>3%</small></span><span class="v">' + w(r.income) + '</span></li>' +
    '<li><span class="k">지방소득세 <small>소득세의 10%</small></span><span class="v">' + w(r.local) + '</span></li>' +
    '<li class="sum"><span class="k">실수령액</span><span class="v">' + w(r.net) + '</span></li>';
}
UI.init(render);`
  },

  /* ---------- 육아휴직 ---------- */
  {
    slug: "parental-leave", kind: "calc", short: "육아휴직 급여 계산기",
    title: "2026 육아휴직 급여 계산기",
    tile: "일반, 6+6 부모육아휴직제, 한부모 기준으로 달마다 받는 급여와 총액을 계산합니다.",
    desc: "2026년 기준 육아휴직 급여를 월별로 계산합니다. 일반, 6+6 부모육아휴직제, 한부모 기준을 지원합니다.",
    foot: "휴직을 달 중간에 시작하거나 끝내면 날짜 수에 맞춰 달라지고, 휴직 중 회사에서 받는 돈이 있으면 줄어들 수 있습니다. 확정 금액은 고용24(www.work24.go.kr) 또는 고용노동부 상담센터 1350에서 확인하세요.",
    body: () => `<section class="hero">
    <span class="eyebrow">2026년 지급 기준</span>
    <h1>육아휴직 급여 계산기</h1>
    <p class="lede">월 통상임금과 휴직 기간을 넣으면 달마다 받는 금액과 총액을 보여줍니다.</p>
  </section>
  <section class="card" aria-label="입력">
    ${money("wage", "월 통상임금 (세전)", "300", "만원", "기본급에 매달 고정으로 받는 수당을 더한 금액입니다. 성과급과 연장근로수당은 빼고 넣으세요.")}
    <fieldset><legend>적용 기준</legend>
      <div class="seg">
        <label><input type="radio" name="type" value="general" checked><span>일반</span></label>
        <label><input type="radio" name="type" value="six"><span>6+6 부모</span></label>
        <label><input type="radio" name="type" value="single"><span>한부모</span></label>
      </div>
      <p class="hint" id="typehint"></p>
    </fieldset>
    <div class="field">
      <div class="rangehead"><label for="months">휴직 기간</label><output id="monthsout" for="months">12개월</output></div>
      <input id="months" type="range" min="1" max="18" step="1" value="12">
      <p class="note" id="longnote" hidden>13개월부터는 부모가 각각 3개월 이상 육아휴직을 쓰거나, 한부모 또는 중증 장애아동 부모일 때만 급여가 나옵니다.</p>
    </div>
  </section>
  <section class="result" aria-live="polite">
    <span class="label">휴직 기간 동안 받는 총액</span>
    <span class="big" id="total">0원</span>
    <span class="sub" id="avg"></span>
  </section>
  <section class="card">
    <h2>달마다 받는 금액</h2>
    <ol class="bars" id="rows"></ol>
    <p class="hint">육아휴직 급여는 소득세를 떼지 않습니다. 휴직 중 4대 보험료는 따로 정산되므로 실제 통장에 들어오는 돈은 조금 다를 수 있습니다.</p>
  </section>
  <section class="card">
    <h2>2026년 월 상한액</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>휴직 개월</th><th>지급률</th><th>일반</th><th>6+6 부모</th><th>한부모</th></tr></thead>
      <tbody>
        <tr><td>1~2개월</td><td>100%</td><td>250만</td><td>250만</td><td>300만</td></tr>
        <tr><td>3개월</td><td>100%</td><td>250만</td><td>300만</td><td>300만</td></tr>
        <tr><td>4개월</td><td>100%</td><td>200만</td><td>350만</td><td>200만</td></tr>
        <tr><td>5개월</td><td>100%</td><td>200만</td><td>400만</td><td>200만</td></tr>
        <tr><td>6개월</td><td>100%</td><td>200만</td><td>450만</td><td>200만</td></tr>
        <tr><td>7개월 이후</td><td>80%</td><td>160만</td><td>160만</td><td>160만</td></tr>
      </tbody>
    </table></div>
    <p class="hint">하한액은 모든 구간에서 월 70만원입니다.</p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>6+6 부모육아휴직제는 누가 받을 수 있나요?</h3><p>자녀가 태어난 지 18개월 안에 부모가 모두 육아휴직을 쓰면 됩니다. 동시에 쓰든 차례로 쓰든 상관없고, 부모 각자의 첫 6개월에 높은 상한액이 적용됩니다.</p></div>
    <div><h3>사후지급금은 없어졌나요?</h3><p>네. 2025년부터 복직 후에 나눠 받던 25%가 없어져서 휴직 중에 매달 전액을 받습니다.</p></div>
    <div><h3>급여는 자동으로 들어오나요?</h3><p>아닙니다. 고용24나 고용센터에서 직접 신청해야 합니다. 휴직을 시작하고 1개월이 지난 뒤부터 신청할 수 있습니다.</p></div>
    <div><h3>통상임금이 얼마인지 모르겠어요.</h3><p>급여명세서에서 기본급과 매달 같은 금액으로 나오는 수당(직책수당, 식대 등)을 더하면 됩니다. 정확한 금액은 회사 인사 담당자에게 확인하세요.</p></div>
  </section>`,
    script: `var CAPS = { general: [250, 250, 250, 200, 200, 200], six: [250, 250, 300, 350, 400, 450], single: [300, 300, 300, 200, 200, 200] };
var HINTS = { general: "부모 중 한 사람만 쓰거나, 6+6 조건에 해당하지 않을 때의 기준입니다.",
  six: "자녀 생후 18개월 안에 부모가 모두 육아휴직을 쓸 때, 각자 첫 6개월에 적용됩니다.",
  single: "한부모 근로자는 첫 3개월 상한액이 300만원입니다." };
function monthPay(wage, type, m) {
  var rate = m <= 6 ? 1 : 0.8, cap = m <= 6 ? CAPS[type][m - 1] : 160;
  var raw = wage * rate, pay = raw, why = m <= 6 ? "통상임금 100%" : "통상임금 80%";
  if (raw > cap) { pay = cap; why = "상한액 적용"; }
  if (pay < 70) { pay = 70; why = "하한액 적용"; }
  return { pay: pay, why: why };
}
function render() {
  var wage = UI.num("wage"), months = Number(document.getElementById("months").value), type = UI.radio("type");
  var w = function (man) { return TAX.won(man * 10000); };
  document.getElementById("monthsout").textContent = months + "개월";
  document.getElementById("typehint").textContent = HINTS[type];
  document.getElementById("longnote").hidden = months <= 12;
  var list = document.getElementById("rows");
  if (wage <= 0) { list.innerHTML = ""; document.getElementById("total").textContent = "0원"; document.getElementById("avg").textContent = "월 통상임금을 입력하세요."; return; }
  var total = 0, items = [], max = 0;
  for (var m = 1; m <= months; m++) { var r = monthPay(wage, type, m); total += r.pay; items.push(r); if (r.pay > max) max = r.pay; }
  list.innerHTML = items.map(function (r, i) {
    return '<li><span class="m">' + (i + 1) + '개월</span><div class="topline"><span class="amt">' + w(r.pay) + '</span><span class="why">' + r.why +
      '</span></div><div class="track"><div class="bar" style="width:' + (r.pay / max * 100).toFixed(1) + '%"></div></div></li>';
  }).join("");
  document.getElementById("total").textContent = w(total);
  document.getElementById("avg").textContent = months + "개월 동안 월평균 " + w(total / months);
}
UI.init(render);`
  },

  /* ---------- 연봉 실수령액 표 ---------- */
  {
    slug: "salary-table", kind: "info", short: "2026 연봉 실수령액 표",
    title: "2026년 연봉 실수령액 표",
    tile: "연봉 2,000만원부터 2억원까지, 4대보험과 세금을 뺀 월 실수령액을 한 표로 정리했습니다.",
    desc: "2026년 연봉 실수령액 표. 연봉 2,000만원부터 2억원까지 국민연금, 건강보험, 소득세를 뺀 월 실수령액을 한눈에 확인하세요.",
    foot: "부양가족 1명(본인), 비과세 식대 월 20만원, 연봉을 12개월로 나눠 받는 경우를 가정한 예상 금액입니다.",
    body: () => `<section class="hero">
    <span class="eyebrow">2026년 요율 반영</span>
    <h1>2026년 연봉 실수령액 표</h1>
    <p class="lede">연봉별로 매달 통장에 들어오는 금액입니다. 부양가족 1명(본인), 비과세 식대 월 20만원 기준입니다.</p>
  </section>
  <section class="card">
    <h2>연봉별 월 실수령액</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>연봉</th><th>월 실수령액</th><th>공제 합계</th><th>국민연금</th><th>건강보험</th><th>장기요양</th><th>고용보험</th><th>소득세</th><th>지방소득세</th></tr></thead>
      <tbody>
          ${salaryRows()}
      </tbody>
    </table></div>
    <p class="hint">단위: 원. 표가 넓으면 옆으로 밀어서 보세요.</p>
    <p>가족 수나 비과세 금액이 다르면 <a href="../salary/">연봉 실수령액 계산기</a>에서 내 조건으로 계산해 보세요.</p>
  </section>
  <section class="card prose">
    <h2>표 읽는 법</h2>
    <ul>
      <li>국민연금은 월 659만원까지만 보험료를 매겨서, 연봉 약 8,150만원부터는 금액이 같습니다.</li>
      <li>소득세는 회사가 매달 떼는 근로소득 간이세액표 기준이며, 연말정산에서 실제 세금과 정산합니다.</li>
      <li>부양가족이 많을수록 소득세가 줄어 실수령액이 늘어납니다.</li>
    </ul>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>2025년보다 실수령액이 줄었나요?</h3><p>같은 연봉이라면 조금 줄었습니다. 2026년부터 국민연금 근로자 부담이 4.5%에서 4.75%로, 건강보험이 3.545%에서 3.595%로 올랐기 때문입니다.</p></div>
    <div><h3>상여금이나 성과급이 있으면요?</h3><p>이 표는 연봉을 12로 나눠 매달 같은 금액을 받는다고 가정합니다. 상여금을 따로 받으면 달마다 실수령액이 달라지지만 1년 합계는 비슷합니다.</p></div>
  </section>`
  },

  /* ---------- 2027 예상 ---------- */
  {
    slug: "salary-2027", kind: "info", short: "2027 연봉 실수령액 예상",
    title: "2027년 연봉 실수령액 표 (예상)",
    tile: "국민연금 5% 인상 등을 반영해 2027년 월급이 2026년보다 얼마나 줄어드는지 연봉별로 비교했습니다.",
    desc: "2027년 연봉 실수령액 예상 표. 국민연금 10% 인상과 장기요양보험 인상을 반영해 2026년 대비 월 실수령액이 얼마나 줄어드는지 연봉별로 비교합니다.",
    foot: "부양가족 1명(본인), 비과세 식대 월 20만원 가정. 2027년 금액은 예상이며, 고용보험 요율·국민연금 상한액(2027년 7월~)·간이세액표가 확정되면 달라질 수 있습니다.",
    body: () => `<section class="hero">
    <span class="eyebrow">예상 · ${UPDATED} 기준</span>
    <h1>2027년 연봉 실수령액 표</h1>
    <p class="lede">같은 연봉이라면 2027년에는 월급이 조금 줄어듭니다. 지금까지 정해진 요율로 미리 계산했습니다.</p>
  </section>
  <section class="result">
    <span class="label">연봉 5,000만원이면 2026년보다</span>
    <span class="big">월 ${won(diff27(5000))}원 감소</span>
    <span class="sub">1년에 약 ${won(diff27(5000) * 12)}원 · 국민연금과 장기요양보험 인상분</span>
  </section>
  <section class="card">
    <h2>2027년에 바뀌는 것</h2>
    <ul class="rows">
      <li><span class="k">국민연금 (근로자) <small>법으로 확정</small></span><span class="v">4.75% → 5%</span></li>
      <li><span class="k">건강보험 (근로자) <small>동결 결정</small></span><span class="v">3.595% 그대로</span></li>
      <li><span class="k">장기요양보험 <small>건강보험료 대비</small></span><span class="v">13.14% → 13.90%</span></li>
      <li><span class="k">고용보험 (근로자) <small>인상안 확정 전</small></span><span class="v">0.9%로 계산</span></li>
      <li><span class="k">소득세 <small>간이세액표 개정 전</small></span><span class="v">2026년 기준</span></li>
    </ul>
    <p class="note">고용보험 실업급여 요율을 근로자 1.0%로 올리는 안이 추진 중입니다. 확정되면 월급 300만원 기준으로 월 3,000원이 더 빠집니다.</p>
  </section>
  <section class="card">
    <h2>연봉별 월 실수령액 비교</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>연봉</th><th>2026년</th><th>2027년 예상</th><th>월 차이</th><th>연 차이</th><th>국민연금</th><th>건강보험</th><th>장기요양</th></tr></thead>
      <tbody>
          ${rows2027()}
      </tbody>
    </table></div>
    <p class="hint">단위: 원. 국민연금·건강보험·장기요양은 2027년 예상 월 보험료입니다. 표가 넓으면 옆으로 밀어서 보세요.</p>
    <p>내 조건으로 보려면 <a href="../salary/">연봉 실수령액 계산기</a>에서 기준 연도를 2027년으로 바꿔 보세요.</p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>국민연금은 언제까지 오르나요?</h3><p>2026년 9.5%에서 시작해 해마다 0.5%포인트씩 올라 2033년에 13%가 됩니다. 직장인은 절반을 내므로 본인 부담은 해마다 0.25%포인트씩 늘어납니다.</p></div>
    <div><h3>연봉이 높으면 덜 줄어드는 이유는?</h3><p>국민연금은 월 659만원까지만 보험료를 매깁니다. 그 이상 받는 사람은 국민연금 인상분이 월 16,480원으로 같습니다.</p></div>
    <div><h3>이 표는 언제 확정되나요?</h3><p>고용보험 요율과 세법 개정은 보통 12월에, 간이세액표는 다음 해 2월쯤 확정됩니다. 확정되는 대로 표를 고칩니다.</p></div>
  </section>`
  },

  /* ---------- 4대보험 요율 ---------- */
  {
    slug: "insurance-rates", kind: "info", short: "2026 4대보험 요율표",
    title: "2026년 4대보험 요율표",
    tile: "국민연금, 건강보험, 장기요양, 고용보험의 근로자·회사 부담 요율과 월급별 보험료.",
    desc: "2026년 4대보험 요율 정리. 국민연금 9.5%, 건강보험 7.19%, 장기요양보험, 고용보험의 근로자·사업주 부담과 월급별 보험료 표.",
    foot: "근로자 부담 보험료는 10원 미만을 버린 예상 금액입니다. 건강보험료는 다음 해 4월에 실제 보수로 정산됩니다.",
    body: () => `<section class="hero">
    <span class="eyebrow">2026년 적용</span>
    <h1>2026년 4대보험 요율표</h1>
    <p class="lede">월급에서 빠지는 4대보험, 올해 요율과 월급별 금액을 정리했습니다.</p>
  </section>
  <section class="result">
    <span class="label">근로자가 부담하는 요율 합계</span>
    <span class="big">월급의 약 9.72%</span>
    <span class="sub">국민연금 4.75% + 건강보험 3.595% + 장기요양 0.4724% + 고용보험 0.9%</span>
  </section>
  <section class="card">
    <h2>보험별 요율</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>보험</th><th>근로자</th><th>회사</th><th>합계</th></tr></thead>
      <tbody>
        <tr><td>국민연금</td><td class="em">4.75%</td><td>4.75%</td><td>9.5%</td></tr>
        <tr><td>건강보험</td><td class="em">3.595%</td><td>3.595%</td><td>7.19%</td></tr>
        <tr><td>장기요양보험</td><td class="em">0.4724%</td><td>0.4724%</td><td>0.9448%</td></tr>
        <tr><td>고용보험 (실업급여)</td><td class="em">0.9%</td><td>0.9%</td><td>1.8%</td></tr>
        <tr><td>산재보험</td><td class="em">없음</td><td>업종별</td><td>업종별</td></tr>
      </tbody>
    </table></div>
    <p class="hint">장기요양보험료는 건강보험료의 약 13.14%로 계산합니다. 회사는 고용보험에서 고용안정·직업능력개발 사업 보험료(0.25~0.85%)를 추가로 냅니다.</p>
  </section>
  <section class="card">
    <h2>2026년에 달라진 점</h2>
    <ul class="rows">
      <li><span class="k">국민연금 요율 <small>1월부터</small></span><span class="v">9% → 9.5%</span></li>
      <li><span class="k">건강보험 요율 <small>1월부터</small></span><span class="v">7.09% → 7.19%</span></li>
      <li><span class="k">장기요양보험 요율 <small>1월부터</small></span><span class="v">0.9182% → 0.9448%</span></li>
      <li><span class="k">국민연금 기준소득월액 상한 <small>7월부터</small></span><span class="v">637만 → 659만원</span></li>
      <li><span class="k">국민연금 기준소득월액 하한 <small>7월부터</small></span><span class="v">40만 → 41만원</span></li>
    </ul>
    <p class="hint">국민연금 요율은 2033년 13%가 될 때까지 해마다 0.5%포인트씩 오를 예정입니다.</p>
  </section>
  <section class="card">
    <h2>월급별 근로자 부담 보험료</h2>
    <div class="tablewrap"><table>
      <thead><tr><th>월급 (비과세 제외)</th><th>국민연금</th><th>건강보험</th><th>장기요양</th><th>고용보험</th><th>합계</th></tr></thead>
      <tbody>
        ${[200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000].map(insRow).join("\n        ")}
      </tbody>
    </table></div>
    <p class="hint">단위: 원. 월급 659만원 이상은 국민연금 보험료가 313,020원으로 같습니다.</p>
    <p>소득세까지 뺀 금액은 <a href="../salary/">연봉 실수령액 계산기</a>에서 확인하세요.</p>
  </section>
  <section class="card faq">
    <h2>자주 묻는 질문</h2>
    <div><h3>4대보험은 어떤 금액에 매기나요?</h3><p>식대 같은 비과세 수당을 뺀 월 보수에 매깁니다. 국민연금은 그 금액에 상한(659만원)과 하한(41만원)이 있습니다.</p></div>
    <div><h3>프리랜서도 4대보험을 내나요?</h3><p>3.3%를 떼는 프리랜서는 회사에서 4대보험을 떼지 않습니다. 대신 지역가입자로 국민연금 9.5%와 건강보험료를 전액 본인이 냅니다.</p></div>
    <div><h3>건강보험료가 4월에 더 빠지는 이유는?</h3><p>건강보험료는 전년도 보수로 먼저 매긴 뒤, 다음 해 4월에 실제 보수와 비교해 차액을 정산하기 때문입니다.</p></div>
  </section>`
  }
];

for (const p of pages) {
  const html = layout({ ...p, body: p.body() });
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map((p) => `  <url><loc>${BASE_URL}${p.slug ? p.slug + "/" : ""}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}sitemap.xml\n`);
console.log("built", pages.length, "pages");
