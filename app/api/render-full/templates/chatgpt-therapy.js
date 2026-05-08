// ChatGPT Therapy template — mimics ChatGPT 4o dark mode interface
// Params:
//   userMessage   — string (the confession)
//   aiResponse    — string (the AI reply)
//   model         — string (model label, e.g. "ChatGPT 4o", defaults to "ChatGPT 4o")
//   slideNum      — slide number string
//   totalSlides   — total slides string

export function renderChatgptTherapy(params) {
  const userMessage = String(params.userMessage || params.user || params.text || '');
  const aiResponse  = String(params.aiResponse || params.ai || params.response || '');
  const model       = String(params.model || 'ChatGPT 4o');
  const slide       = String(params.slideNum || params.slide || '01').padStart(2, '0');
  const total       = String(params.totalSlides || params.total_slides || '06').padStart(2, '0');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body {
    background: #212121;
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    color: #ECECF1;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* TOP BAR — model selector */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 60px 50px 30px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .menu-icon {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 32px;
  }
  .menu-icon span {
    height: 3px;
    background: #ECECF1;
    border-radius: 2px;
  }
  .menu-icon span:nth-child(1) { width: 100%; }
  .menu-icon span:nth-child(2) { width: 70%; }
  .menu-icon span:nth-child(3) { width: 100%; }
  .model-label {
    font-size: 30px;
    font-weight: 600;
    color: #ECECF1;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .model-label .chevron {
    color: rgba(236,236,241,0.5);
    font-size: 22px;
    margin-top: 4px;
  }
  .new-chat {
    width: 36px;
    height: 36px;
    border: 2px solid #ECECF1;
    border-radius: 8px;
    position: relative;
  }
  .new-chat::before, .new-chat::after {
    content: "";
    position: absolute;
    background: #ECECF1;
  }
  .new-chat::before {
    top: 50%; left: 6px; right: 6px; height: 2px; transform: translateY(-50%);
  }
  .new-chat::after {
    left: 50%; top: 6px; bottom: 6px; width: 2px; transform: translateX(-50%);
  }

  /* CONVERSATION AREA */
  .conversation {
    flex: 1;
    overflow: hidden;
    padding: 50px 50px 30px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  /* USER MESSAGE — right-aligned bubble */
  .user-row {
    display: flex;
    justify-content: flex-end;
  }
  .user-bubble {
    background: #2F2F2F;
    color: #ECECF1;
    padding: 26px 32px;
    border-radius: 28px;
    border-bottom-right-radius: 8px;
    max-width: 78%;
    font-size: 36px;
    line-height: 1.4;
    letter-spacing: -0.01em;
    word-wrap: break-word;
  }

  /* AI RESPONSE — full-width, no bubble, with avatar */
  .ai-row {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
  .ai-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10A37F 0%, #0E8E6E 100%);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .ai-avatar::before {
    content: "";
    width: 26px;
    height: 26px;
    background: #212121;
    border-radius: 50%;
    box-shadow: 0 0 0 4px #10A37F inset;
  }
  .ai-content {
    flex: 1;
    padding-top: 4px;
  }
  .ai-content .ai-name {
    font-size: 22px;
    font-weight: 600;
    color: rgba(236,236,241,0.6);
    margin-bottom: 14px;
    letter-spacing: 0.02em;
  }
  .ai-content .ai-text {
    font-size: 34px;
    line-height: 1.5;
    color: #ECECF1;
    letter-spacing: -0.005em;
    word-wrap: break-word;
  }
  .ai-actions {
    display: flex;
    gap: 18px;
    margin-top: 24px;
    opacity: 0.45;
  }
  .ai-action {
    width: 28px;
    height: 28px;
    border: 2px solid #ECECF1;
    border-radius: 6px;
  }

  /* INPUT BAR at bottom */
  .input-area {
    padding: 30px 50px 60px;
    flex-shrink: 0;
  }
  .input-bar {
    background: #2F2F2F;
    border-radius: 36px;
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .input-plus {
    width: 36px;
    height: 36px;
    border: 2px solid rgba(236,236,241,0.6);
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
  }
  .input-plus::before, .input-plus::after {
    content: "";
    position: absolute;
    background: rgba(236,236,241,0.6);
  }
  .input-plus::before {
    top: 50%; left: 8px; right: 8px; height: 2px; transform: translateY(-50%);
  }
  .input-plus::after {
    left: 50%; top: 8px; bottom: 8px; width: 2px; transform: translateX(-50%);
  }
  .input-placeholder {
    flex: 1;
    color: rgba(236,236,241,0.4);
    font-size: 28px;
    letter-spacing: -0.005em;
  }
  .input-mic {
    width: 36px;
    height: 36px;
    background: rgba(236,236,241,0.5);
    border-radius: 50%;
    flex-shrink: 0;
  }
  .input-send {
    width: 40px;
    height: 40px;
    background: #ECECF1;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
  }
  .input-send::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(45deg, transparent 45%, #212121 45%, #212121 55%, transparent 55%) center/2px 16px no-repeat,
      linear-gradient(-45deg, transparent 45%, #212121 45%, #212121 55%, transparent 55%) calc(50% - 6px) calc(50% - 6px)/14px 14px no-repeat;
  }

  /* BRAND MARK — bottom corner */
  .corner-mark {
    position: absolute;
    bottom: 24px;
    right: 50px;
    font-family: 'Space Mono', monospace;
    font-size: 18px;
    letter-spacing: 0.18em;
    color: rgba(236,236,241,0.25);
    z-index: 10;
  }
  .brand-mark {
    position: absolute;
    bottom: 24px;
    left: 50px;
    font-family: 'Space Mono', monospace;
    font-size: 16px;
    letter-spacing: 0.32em;
    color: rgba(236,236,241,0.25);
    z-index: 10;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="topbar">
    <div class="menu-icon"><span></span><span></span><span></span></div>
    <div class="model-label">${escapeHtml(model)} <span class="chevron">▾</span></div>
    <div class="new-chat"></div>
  </div>

  <div class="conversation">
    <div class="user-row">
      <div class="user-bubble">${escapeHtml(userMessage).replace(/\n/g, '<br>')}</div>
    </div>
    <div class="ai-row">
      <div class="ai-avatar"></div>
      <div class="ai-content">
        <div class="ai-name">ChatGPT</div>
        <div class="ai-text">${escapeHtml(aiResponse).replace(/\n/g, '<br>')}</div>
        <div class="ai-actions">
          <div class="ai-action"></div>
          <div class="ai-action"></div>
          <div class="ai-action"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="input-area">
    <div class="input-bar">
      <div class="input-plus"></div>
      <div class="input-placeholder">Message ChatGPT</div>
      <div class="input-mic"></div>
      <div class="input-send"></div>
    </div>
  </div>

  <div class="brand-mark">UNINSPIRED</div>
  <div class="corner-mark">${slide} / ${total}</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
