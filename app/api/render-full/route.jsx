import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { renderNotesDiary } from './templates/notes-diary';
import { renderTextThread } from './templates/text-thread';
import { renderSearchBar } from './templates/search-bar';
import { renderReceipt } from './templates/receipt';

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export const runtime = 'nodejs';
export const maxDuration = 30;

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

function paramsFromUrl(searchParams) {
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
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1080, height: 1920 },
      executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar'),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 1500));
    const screenshot = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    return new Response(screenshot, { status: 200, headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    if (browser) await browser.close();
  }
}
