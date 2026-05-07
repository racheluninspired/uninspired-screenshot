// Notes Diary template — cream paper Notes-app aesthetic
// Params:
//   date     — string (header date, e.g., "tuesday · 2:47am")
//   lines    — array of { text, style } where style ∈ "normal" | "dim" | "indent" | "dim indent"
//   slide    — slide number (e.g., "2")
//   total    — total slides (e.g., "6")

export function renderNotesDiary(params) {
  const date = String(params.date || 'tuesday · 2:47am').trim();
  const lines = Array.isArray(params.lines) ? params.lines : [];
  const slide = String(params.slide || '01').padStart(2, '0');
  const total = String(params.total || '06').padStart(2, '0');

  const linesHtml = lines.map(l => {
    if (typeof l === 'string') l = { text: l };
    const text = String(l.text || '').replace(/</g, '&lt;');
    const style = String(l.style || 'normal');
    const classes = ['line'];
    if (style.includes('dim')) classes.push('dim');
    if (style.includes('indent')) classes.push('indent');
    return `<div class="${classes.join(' ')}">${text || '&nbsp;'}</div>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Koulen&family=Space+Mono:wght@400;700&family=Aleo:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body {
    background: #f7efdd;
    font-family: 'Aleo', Georgia, serif;
    color: #1a1a1a;
    padding: 110px 90px;
    position: relative;
  }
  body::before {
    content: ""; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 12% 22%, rgba(26,26,26,0.025) 0px, transparent 1.5px),
      radial-gradient(circle at 78% 65%, rgba(26,26,26,0.02) 0px, transparent 2px),
      radial-gradient(circle at 41% 88%, rgba(26,26,26,0.015) 0px, transparent 1px);
    background-size: 70px 70px, 90px 90px, 50px 50px;
    pointer-events: none; z-index: 0;
  }
  .meta {
    font-family: 'Space Mono', monospace;
    font-size: 24px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(26,26,26,0.42);
    margin-bottom: 26px;
    position: relative; z-index: 1;
  }
  .rule { height: 1px; background: rgba(26,26,26,0.12); margin-bottom: 70px; position: relative; z-index: 1; }
  .line {
    font-family: 'Aleo', Georgia, serif;
    font-size: 64px;
    line-height: 1.3;
    margin-bottom: 18px;
    color: #1a1a1a;
    position: relative; z-index: 1;
    letter-spacing: -0.005em;
  }
  .line.dim { color: rgba(26,26,26,0.5); font-style: italic; font-weight: 300; }
  .indent { padding-left: 80px; }
  .brand-mark {
    position: absolute;
    bottom: 70px; left: 90px;
    font-family: 'Space Mono', monospace;
    font-size: 22px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(26,26,26,0.4);
    z-index: 2;
  }
  .slide-num {
    position: absolute;
    bottom: 70px; right: 90px;
    font-family: 'Space Mono', monospace;
    font-size: 22px;
    letter-spacing: 0.16em;
    color: rgba(26,26,26,0.4);
    z-index: 2;
  }
  .corner-mark {
    position: absolute;
    top: 60px; right: 90px;
    width: 14px; height: 14px;
    border: 1.5px solid rgba(26,26,26,0.3);
    border-radius: 50%;
    z-index: 2;
  }
</style>
</head>
<body>
  <div class="corner-mark"></div>
  <div class="meta">${escapeHtml(date)}</div>
  <div class="rule"></div>
  ${linesHtml}
  <div class="brand-mark">UNINSPIRED&trade;</div>
  <div class="slide-num">${slide} / ${total}</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
