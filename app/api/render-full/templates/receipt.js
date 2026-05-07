// Receipt template — cream perforated receipt with monospace itemized list
// Params:
//   header        — string (top-of-receipt header, e.g. "— ITEMIZED —")
//   sub           — string (sub-header line, smaller)
//   lines         — array of { qty, item, price, bold } — line items
//   total         — { item, price } — total block
//   footer        — string (footer text, e.g. "PAID IN PRETENDING. NO REFUNDS.")
//   stamp         — string (rotated diagonal stamp text, e.g. "PAID IN\nPRETENDING")
//   slideNum      — slide number string
//   totalSlides   — total slides string

export function renderReceipt(params) {
  const header = String(params.header || '— ITEMIZED —');
  const sub = String(params.sub || '');
  const lines = Array.isArray(params.lines) ? params.lines : [];
  const totalBlock = (params.total && typeof params.total === 'object') ? params.total : null;
  const footer = String(params.footer || '');
  const stamp = String(params.stamp || '');
  const slide = String(params.slideNum || params.slide || '01').padStart(2, '0');
  const total = String(params.totalSlides || params.total_slides || '06').padStart(2, '0');

  const linesHtml = lines.map(l => {
    const qty = escapeHtml(l.qty || '');
    const item = escapeHtml(l.item || '');
    const price = escapeHtml(l.price || '');
    const boldClass = l.bold ? ' bold' : '';
    return `<div class="line${boldClass}"><span class="qty">${qty}</span><span class="item">${item}</span><span class="price">${price}</span></div>`;
  }).join('\n    ');

  const totalHtml = totalBlock ? `
    <div class="receipt-total"><span>${escapeHtml(totalBlock.item || 'TOTAL DUE')}</span><span>${escapeHtml(totalBlock.price || '')}</span></div>
  ` : '';

  const stampHtml = stamp ? `<div class="stamp">${escapeHtml(stamp).replace(/\n/g, '<br>')}</div>` : '';
  const footerHtml = footer ? `<div class="receipt-footer">${escapeHtml(footer).replace(/\n/g, '<br>')}</div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Koulen&family=Space+Mono:wght@400;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body {
    background: #1a1a1a;
    font-family: 'Courier Prime', 'Courier New', monospace;
    padding: 0; position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .receipt {
    width: 880px;
    background: #fbf6e9;
    color: #1a1a1a;
    padding: 70px 70px 90px;
    position: relative;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.05);
    transform: rotate(-1.2deg);
  }
  .receipt::before {
    content: "";
    position: absolute; top: -20px; left: 0; right: 0; height: 20px;
    background: radial-gradient(circle at 16px 0, transparent 12px, #fbf6e9 12.5px) 0 0 / 32px 20px repeat-x;
  }
  .receipt::after {
    content: "";
    position: absolute; bottom: -20px; left: 0; right: 0; height: 20px;
    background: radial-gradient(circle at 16px 20px, transparent 12px, #fbf6e9 12.5px) 0 0 / 32px 20px repeat-x;
  }
  .header {
    text-align: center; font-size: 38px;
    letter-spacing: 0.18em; font-weight: 700;
    margin-bottom: 8px;
  }
  .sub {
    text-align: center; font-size: 22px;
    letter-spacing: 0.16em; color: rgba(26,26,26,0.55);
    margin-bottom: 38px;
  }
  hr.dashed { border: none; border-top: 2px dashed rgba(26,26,26,0.5); margin: 26px 0; }
  .line {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 28px; line-height: 1.55;
    letter-spacing: 0.04em; margin-bottom: 8px;
  }
  .line .qty { width: 60px; color: rgba(26,26,26,0.55); flex-shrink: 0; }
  .line .item { flex: 1; padding-right: 18px; text-transform: uppercase; }
  .line .price { min-width: 130px; text-align: right; font-weight: 700; }
  .line.bold { font-weight: 700; font-size: 32px; margin-top: 10px; }
  .receipt-total {
    display: flex; justify-content: space-between;
    font-size: 38px; font-weight: 700;
    margin-top: 14px; padding-top: 14px;
    border-top: 3px double #1a1a1a;
    letter-spacing: 0.05em;
  }
  .stamp {
    position: absolute; right: 40px; top: 250px;
    transform: rotate(-14deg);
    font-family: 'Koulen', sans-serif;
    font-size: 56px;
    color: #ff4c0a;
    border: 6px solid #ff4c0a;
    padding: 10px 22px 6px;
    letter-spacing: 0.06em; line-height: 1;
    opacity: 0.92; text-transform: uppercase;
    background: rgba(251, 246, 233, 0.4);
  }
  .receipt-footer {
    text-align: center; font-size: 20px;
    margin-top: 30px; color: rgba(26,26,26,0.55);
    letter-spacing: 0.18em;
  }
  .corner-mark {
    position: absolute;
    bottom: 70px; right: 90px;
    font-family: 'Space Mono', monospace;
    font-size: 22px;
    letter-spacing: 0.16em;
    color: rgba(247,239,221,0.4);
    z-index: 10;
  }
</style>
</head>
<body>
  <div class="receipt">
    <div class="header">${escapeHtml(header)}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ''}
    <hr class="dashed">
    ${linesHtml}
    <hr class="dashed">
    ${totalHtml}
    ${footerHtml}
    ${stampHtml}
  </div>
  <div class="corner-mark">${slide} / ${total}</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
