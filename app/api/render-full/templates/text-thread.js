// Text Thread template — iMessage gray-and-blue bubble carousel
// Params:
//   contact      — string (contact name shown in header; "" or "— · — · —" stays anonymous)
//   bubbles      — array of { role: "gray"|"blue", text: "..." }
//   timestamp    — string (e.g., "Today  9:14 PM")
//   slide        — slide number
//   total        — total slides

export function renderTextThread(params) {
  const contact = String(params.contact || '— · — · —');
  const bubbles = Array.isArray(params.bubbles) ? params.bubbles : [];
  const timestamp = String(params.timestamp || 'Today  9:14 PM');
  const slide = String(params.slide || '01').padStart(2, '0');
  const total = String(params.total || '06').padStart(2, '0');

  const bubblesHtml = bubbles.map((b, i) => {
    const role = b.role === 'blue' ? 'blue' : 'gray';
    const text = escapeHtml(b.text || '');
    const gap = b.gap === true ? '<div class="gap-large"></div>' : '';
    return `${gap}<div class="bubble ${role}">${text}</div>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body {
    background: #f4f4f4;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Segoe UI", Arial, sans-serif;
    color: #000;
    padding: 0;
    position: relative;
  }
  .status-bar {
    height: 60px; background: #f4f4f4;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 40px; font-size: 32px; font-weight: 600; color: #1a1a1a;
    margin-top: 36px;
  }
  .status-bar .right { display: flex; gap: 12px; align-items: center; font-size: 28px; }
  .battery { width: 50px; height: 22px; border: 2px solid #1a1a1a; border-radius: 4px; position: relative; margin-left: 4px; }
  .battery::after { content: ""; position: absolute; right: -5px; top: 5px; width: 3px; height: 8px; background: #1a1a1a; border-radius: 0 1px 1px 0; }
  .battery::before { content: ""; position: absolute; inset: 2px; background: #1a1a1a; border-radius: 1px; width: 70%; }
  .nav {
    height: 110px; background: rgba(247,247,247,0.92);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    position: relative; padding: 0 40px;
  }
  .nav-back { position: absolute; left: 36px; top: 38px; font-size: 38px; color: #007aff; font-weight: 400; }
  .avatar { width: 72px; height: 72px; border-radius: 50%; background: #c7c7cc; margin-bottom: 8px; }
  .contact-name { font-size: 22px; font-weight: 600; color: rgba(0,0,0,0.5); letter-spacing: 0.5px; }
  .contact-name .arrow { font-size: 18px; margin-left: 4px; }
  .timestamp {
    text-align: center; font-size: 24px;
    color: rgba(0,0,0,0.45);
    margin: 56px 0 36px;
    font-weight: 500;
  }
  .timestamp .day { font-weight: 600; color: rgba(0,0,0,0.55); margin-right: 14px; }
  .messages {
    padding: 0 36px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .bubble {
    font-size: 38px; line-height: 1.32;
    padding: 22px 32px; border-radius: 32px;
    max-width: 75%; word-wrap: break-word;
    box-shadow: 0 1px 1.5px rgba(0,0,0,0.08);
  }
  .bubble.gray { background: #e9e9eb; color: #1a1a1a; align-self: flex-start; border-bottom-left-radius: 8px; }
  .bubble.blue { background: linear-gradient(180deg, #3094ff 0%, #1d8cf8 100%); color: white; align-self: flex-end; border-bottom-right-radius: 8px; }
  .gap-large { height: 24px; }
  .input-bar {
    position: absolute; bottom: 60px; left: 0; right: 0;
    height: 90px;
    border-top: 1px solid rgba(0,0,0,0.07);
    background: rgba(247,247,247,0.92);
    display: flex; align-items: center; padding: 0 24px; gap: 18px;
  }
  .plus-circle { width: 56px; height: 56px; border-radius: 50%; background: #e9e9eb; display: flex; align-items: center; justify-content: center; font-size: 36px; color: #8e8e93; font-weight: 300; }
  .input-pill { flex: 1; height: 56px; border: 1px solid rgba(0,0,0,0.12); border-radius: 28px; background: #fff; display: flex; align-items: center; padding: 0 20px; font-size: 26px; color: #c7c7cc; }
  .home-bar { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); width: 270px; height: 8px; background: #1a1a1a; border-radius: 4px; opacity: 0.85; }
  .tail-mark { position: absolute; top: 20px; right: 36px; font-family: "SF Mono", "Space Mono", Consolas, monospace; font-size: 14px; color: rgba(0,0,0,0.18); letter-spacing: 0.18em; }
</style>
</head>
<body>
  <div class="tail-mark">${slide} / ${total}</div>

  <div class="status-bar">
    <span>9:14</span>
    <span class="right">
      <span style="font-size: 26px; font-weight: 700; letter-spacing: 0.06em;">.&#x0131;ll&#x0131;</span>
      <span style="font-size: 26px;">100%</span>
      <span class="battery"></span>
    </span>
  </div>

  <div class="nav">
    <span class="nav-back">&lsaquo;</span>
    <div class="avatar"></div>
    <div class="contact-name">${escapeHtml(contact)}<span class="arrow">&rsaquo;</span></div>
  </div>

  <div class="timestamp"><span class="day">Today</span>${escapeHtml(timestamp.replace(/^Today\s*/, ''))}</div>

  <div class="messages">
    ${bubblesHtml}
  </div>

  <div class="input-bar">
    <div class="plus-circle">+</div>
    <div class="input-pill">iMessage</div>
  </div>
  <div class="home-bar"></div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
