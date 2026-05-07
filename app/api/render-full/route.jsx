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
      executablePath: await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar'
      ),
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
      { text: '— filed under drafts.', style:
