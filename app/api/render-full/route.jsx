import { renderNotesDiary } from './templates/notes-diary';
import { renderTextThread } from './templates/text-thread';
import { renderSearchBar } from './templates/search-bar';
import { renderReceipt } from './templates/receipt';

export const runtime = 'nodejs';
export const maxDuration = 30;

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const BROWSERLESS_URL = 'https://production-sfo.browserless.io';

const TEMPLATES = {
  'notes-diary': renderNotesDiary,
  'text-thread': renderTextThread,
  'search-bar':  renderSearchBar,
  'receipt':     renderReceipt,
};

const SAMPLES = {
  'notes-diary': { date: 'tuesday 2:47am', lines: [{ text: 'i am fine', style: 'normal' }, { text: 'wasnt', style: 'dim indent' }], slide: '02', total: '06' },
  'text-thread': { contact: 'DAD', timestamp: 'Today 9:14 PM', bubbles: [{ role: 'gray', text: 'stop being dramatic' }, { role: 'blue', text: 'words that stick' }], slide: '03', total: '06' },
  'search-bar':  { query: 'why do i feel so', showCursor: true, autocomplete: [{ typed: 'why do i feel so', completion: 'tired all the time' }, { typed: 'why do i feel so', completion: 'much' }], slide: '02', total: '06' },
  'receipt':     { header: 'ITEMIZED', lines: [{ qty: '3x', item: 'Said im fine', price: '$0.00' }, { qty: '1x', item: 'Cried in parking lot', price: 'PRICELESS' }], footer: 'PAID IN PRETENDING', stamp: 'PAID', slideNum: '03', totalSlides: '06' },
};

function b64urlDecode(s) {
  const std = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = std + '==='.slice((std.length + 3) % 4);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

function paramsFromUrl(searchParams) {
  const p = searchParams.get('p');
  if (p) {
    try { return JSON.parse(b64urlDecode(p)); } catch {}
  }
  const out = {};
  for (const [key, value] of searchParams.entries()) {
    if (value && (value.startsWith('[') || value.startsWith('{'))) {
      try { out[key] = JSON.parse(value); continue; } catch {}
    }
    out[key] = value;
  }
  return out;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (searchParams.get('debug') === '1') {
    if (!format || !TEMPLATES[format]) {
      return new Response(JSON.stringify({ error: 'Invalid format', valid: Object.keys(TEMPLATES) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const html = TEMPLATES[format](paramsFromUrl(searchParams));
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  }

  if (searchParams.get('test') === '1') {
    const fmt = format || 'notes-diary';
    if (!TEMPLATES[fmt]) {
      return new Response(JSON.stringify({ error: 'Invalid format', valid: Object.keys(TEMPLATES) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const html = TEMPLATES[fmt](SAMPLES[fmt]);
    return await renderHtmlToImage(html);
  }

  if (!format || !TEMPLATES[format]) {
    return new Response(JSON.stringify({ error: 'Missing or invalid format', valid: Object.keys(TEMPLATES) }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const html = TEMPLATES[format](paramsFromUrl(searchParams));
  return await renderHtmlToImage(html);
}

async function renderHtmlToImage(html) {
  if (!BROWSERLESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'BROWSERLESS_TOKEN env var not set in Vercel' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const response = await fetch(`${BROWSERLESS_URL}/screenshot?token=${BROWSERLESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify({
        html,
        viewport: { width: 1080, height: 1920, deviceScaleFactor: 2 },
        options: { type: 'jpeg', quality: 92, fullPage: false, clip: { x: 0, y: 0, width: 1080, height: 1920 } },
        gotoOptions: { waitUntil: 'networkidle0', timeout: 15000 },
        waitForTimeout: 1500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: 'Browserless render failed', status: response.status, detail: errText }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const buffer = await response.arrayBuffer();
return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
