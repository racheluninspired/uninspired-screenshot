import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { renderNotesDiary } from './templates/notes-diary';
import { renderTextThread } from './templates/text-thread';
import { renderSearchBar } from './templates/search-bar';
import { renderReceipt } from './templates/receipt';

export const runtime = 'nodejs';
export const maxDuration = 30;

const TEMPLATES = {
  'notes-diary': renderNotesDiary,
  'text-thread': renderTextThread,
  'search-bar':  renderSearchBar,
  'receipt':     renderReceipt,
};

// Convert searchParams into a JS object, parsing JSON-shaped values
function paramsFromUrl(searchParams) {
  const out = {};
  for (const [key, value] of searchParams.entries()) {
    if (value && (value.startsWith('[') || value.startsWith('{'))) {
      try { out[key] = JSON.parse(value); continue; } catch { /* fall through */ }
    }
    out[key] = value;
  }
  return out;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // ── DEBUG: ?debug=1 → return generated HTML as text/html ────────────
  if (searchParams.get('debug') === '1') {
    const format = searchParams.get('format');
    if (!format || !TEMPLATES[format]) {
      return new Response(JSON.stringify({
        error: 'Invalid format',
        validFormats: Object.keys(TEMPLATES),
      }, null, 2), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const html = TEMPLATES[format](paramsFromUrl(searchParams));
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  }

  // ── DEBUG: ?test=1 → render a sample for the requested format ───────
  if (searchParams.get('test') === '1') {
    const format = searchParams.get('format') || 'notes-diary';
    if (!TEMPLATES[format]) {
      return new Response(JSON.stringify({ error: 'Invalid format', validFormats: Object.keys(TEMPLATES) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const sampleParams = SAMPLES[format];
    const html = TEMPLATES[format](sampleParams);
    return await renderHtmlToImage(html);
  }

  // ── MAIN: render based on format + params ──────────────────────────
  const format = searchParams.get('format');
  if (!format || !TEMPLATES[format]) {
    return new Response(JSON.stringify({
      error: 'Missing or invalid ?format= parameter',
      validFormats: Object.keys(TEMPLATES),
      example: '/api/render-full?format=notes-diary&date=tuesday+2:47am&lines=[{"text":"i\'m fine.","style":"normal"},{"text":"— wasn\'t.","style":"dim indent"}]&slide=2&total=6'
    }, null, 2), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const params = paramsFromUrl(searchParams);
  const html = TEMPLATES[format](params);

  return await renderHtmlToImage(html);
}

async function renderHtmlToImage(html) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1080, height: 1920 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 1500));

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 92,
      clip: { x: 0, y: 0, width: 1080, height: 1920 },
    });

    return new Response(screenshot, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (browser) await browser.close();
  }
}

// ── Sample params per format (used by ?test=1) ──────────────────────
const SAMPLES = {
  'notes-diary': {
    date: 'tuesday · 2:47am',
    lines: [
      { text: '"i\'m fine."', style: 'normal' },
      { text: '— wasn\'t.', style: 'dim indent' },
      { text: '"i\'m good."', style: 'normal' },
      { text: '— still loading.', style: 'dim indent' },
      { text: '"i\'m okay."', style: 'normal' },
      { text: '— filed under drafts.', style: 'dim indent' },
    ],
    slide: '02', total: '06',
  },
  'text-thread': {
    contact: '— · — · —',
    timestamp: 'Today  9:14 PM',
    bubbles: [
      { role: 'gray', text: 'you know i love you right' },
      { role: 'gray', text: 'that\'s why i said it' },
      { role: 'blue', text: 'words that stick' },
      { role: 'blue', text: 'just not the way you meant them to' },
    ],
    slide: '03', total: '06',
  },
  'search-bar': {
    query: 'why do i feel so',
    showCursor: true,
    autocomplete: [
      { typed: 'why do i feel so', completion: 'tired all the time' },
      { typed: 'why do i feel so', completion: 'guilty for resting' },
      { typed: 'why do i feel so', completion: 'much' },
      { typed: 'why do i feel so disconnected from everyone', dim: true },
      { typed: 'why do i feel like i\'m too much', dim: true },
    ],
    slide: '02', total: '06',
  },
  'receipt': {
    header: '— CONTINUED —',
    sub: 'UNINSPIRED™ · YOUR WEEK · PAGE 2/3',
    lines: [
      { qty: '3×', item: 'Dissociated in Target', price: 'PRICELESS' },
      { qty: '1×', item: 'Cried in a parking lot', price: '$$$.--' },
      { qty: '12×', item: 'Scrolled past 2am', price: '$$$.--' },
      { qty: '5×', item: 'Started a text · never sent', price: '$$$.--' },
      { qty: '∞', item: 'Emotional Labor', price: '$$$$$' },
      { qty: '', item: 'SUBTOTAL · INTERIOR', price: '$$$$$', bold: true },
    ],
    footer: 'CONTINUED ON SLIDE 04 →',
    stamp: 'PAID IN\nPRETENDING',
    slideNum: '03',
    totalSlides: '06',
  },
};
