// Search Bar template — Google-style search + autocomplete carousel
// Params:
//   query        — string (text in the search bar)
//   showLogo     — boolean (default true; shows the Google-colored "Google" logo above)
//   showCursor   — boolean (default true; blinking cursor in search bar)
//   autocomplete — array of { typed, completion, dim } — typed shown gray, completion bold black, dim makes whole row gray
//   resultLink   — string (slide-4 result link, e.g. "uninspiredcollective.com › unspoken › still-loading")
//   resultTitle  — string (slide-4 result title)
//   resultSnippet— string (slide-4 result snippet, can include <b>...</b> for bold)
//   slide        — slide number
//   total        — total slides

export function renderSearchBar(params) {
  const query = String(params.query || 'why do i feel so');
  const showLogo = params.showLogo !== false && params.showLogo !== 'false';
  const showCursor = params.showCursor !== false && params.showCursor !== 'false';
  const autocomplete = Array.isArray(params.autocomplete) ? params.autocomplete : [];
  const resultLink = params.resultLink ? String(params.resultLink) : '';
  const resultTitle = params.resultTitle ? String(params.resultTitle) : '';
  const resultSnippet = params.resultSnippet ? String(params.resultSnippet) : '';
  const slide = String(params.slide || '01').padStart(2, '0');
  const total = String(params.total || '06').padStart(2, '0');

  const autoHtml = autocomplete.map(item => {
    const typed = escapeHtml(item.typed || '');
    const completion = escapeHtml(item.completion || '');
    const dimClass = item.dim ? ' dim' : '';
    if (completion) {
      return `<div class="auto-item${dimClass}"><div class="auto-icon"></div><span class="typed">${typed}&nbsp;</span><span class="completion">${completion}</span></div>`;
    }
    return `<div class="auto-item${dimClass}"><div class="auto-icon"></div><span class="typed" style="color:#5f6368;">${typed}</span></div>`;
  }).join('\n      ');

  const resultHtml = (resultLink || resultTitle || resultSnippet) ? `
  <div class="search-result">
    ${resultLink ? `<div class="search-result-link">${escapeHtml(resultLink)}</div>` : ''}
    ${resultTitle ? `<div class="search-result-title">${escapeHtml(resultTitle)}</div>` : ''}
    ${resultSnippet ? `<div class="search-result-snippet">${resultSnippet}</div>` : ''}
  </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body { background: #ffffff; font-family: arial, "Helvetica Neue", Helvetica, sans-serif; color: #202124; padding: 0; position: relative; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 32px 36px 0; }
  .menu-dots { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; }
  .menu-dots span { width: 8px; height: 8px; background: #5f6368; border-radius: 50%; box-shadow: 0 -16px 0 #5f6368, 0 16px 0 #5f6368; }
  .center-block { text-align: center; margin-top: 200px; }
  .logo {
    font-family: arial, sans-serif;
    font-size: 156px; font-weight: 400;
    letter-spacing: -8px; line-height: 1;
    margin-bottom: 80px;
  }
  .logo .l1 { color: #4285f4; } .logo .l2 { color: #ea4335; } .logo .l3 { color: #fbbc05; }
  .logo .l4 { color: #4285f4; } .logo .l5 { color: #34a853; } .logo .l6 { color: #ea4335; }
  .search-wrap { margin: 0 60px; position: relative; }
  .search-bar {
    background: white;
    border: 1px solid #dfe1e5;
    border-radius: 50px; height: 102px;
    display: flex; align-items: center; padding: 0 36px;
    box-shadow: 0 2px 5px 1px rgba(64,60,67,0.16);
    position: relative; z-index: 2;
  }
  .search-icon { width: 38px; height: 38px; border: 4px solid #9aa0a6; border-radius: 50%; position: relative; margin-right: 28px; flex-shrink: 0; }
  .search-icon::after { content: ""; position: absolute; bottom: -14px; right: -10px; width: 18px; height: 4px; background: #9aa0a6; border-radius: 2px; transform: rotate(45deg); }
  .search-text { font-size: 42px; color: #202124; flex: 1; }
  .search-cursor { width: 2px; height: 50px; background: #202124; margin-left: 4px; animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .mic-icon { width: 38px; height: 38px; margin-left: 18px; flex-shrink: 0; position: relative; }
  .mic-icon::before { content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 18px; height: 26px; background: #4285f4; border-radius: 9px; }
  .mic-icon::after { content: ""; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 26px; height: 6px; background: #4285f4; border-radius: 0 0 13px 13px; box-shadow: 0 -10px 0 -8px #4285f4; }
  .autocomplete {
    margin: -50px 60px 0;
    background: white;
    border-left: 1px solid #dfe1e5; border-right: 1px solid #dfe1e5; border-bottom: 1px solid #dfe1e5;
    border-bottom-left-radius: 36px; border-bottom-right-radius: 36px;
    padding: 70px 0 18px;
    box-shadow: 0 8px 16px 1px rgba(64,60,67,0.12);
    position: relative; z-index: 1;
  }
  .auto-item { display: flex; align-items: center; padding: 18px 36px; font-size: 38px; color: #202124; line-height: 1.2; }
  .auto-item.dim { color: #5f6368; }
  .auto-icon { width: 28px; height: 28px; border: 3px solid #9aa0a6; border-radius: 50%; margin-right: 28px; flex-shrink: 0; position: relative; }
  .auto-icon::after { content: ""; position: absolute; bottom: -10px; right: -7px; width: 12px; height: 3px; background: #9aa0a6; border-radius: 2px; transform: rotate(45deg); }
  .auto-item .typed { color: #5f6368; }
  .auto-item .completion { color: #202124; font-weight: 500; }
  .search-result { margin: 14px 64px 0; }
  .search-result-link { font-family: arial, sans-serif; font-size: 24px; color: #006621; margin-bottom: 4px; }
  .search-result-title { font-family: arial, sans-serif; font-size: 36px; color: #1a0dab; line-height: 1.25; margin-bottom: 8px; }
  .search-result-snippet { font-family: arial, sans-serif; font-size: 28px; color: #4d5156; line-height: 1.4; }
  .search-result-snippet b { font-weight: 700; color: #202124; }
  .tail-mark { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); font-family: 'Space Mono', monospace; font-size: 22px; color: rgba(32,33,36,0.3); letter-spacing: 0.16em; }
</style>
</head>
<body>
  <div class="top-bar">
    <div></div>
    <div class="menu-dots"><span></span></div>
  </div>

  ${showLogo ? `<div class="center-block">
    <div class="logo">
      <span class="l1">G</span><span class="l2">o</span><span class="l3">o</span><span class="l4">g</span><span class="l5">l</span><span class="l6">e</span>
    </div>
  </div>` : '<div style="height: 280px;"></div>'}

  <div class="search-wrap">
    <div class="search-bar">
      <div class="search-icon"></div>
      <div class="search-text">${escapeHtml(query)}</div>
      ${showCursor ? '<div class="search-cursor"></div>' : ''}
      <div class="mic-icon"></div>
    </div>
  </div>

  ${autocomplete.length ? `<div class="autocomplete">
    ${autoHtml}
  </div>` : ''}

  ${resultHtml}

  <div class="tail-mark">${slide} / ${total}</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
