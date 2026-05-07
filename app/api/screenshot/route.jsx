import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// ── Colors ───────────────────────────────────────────────────────────
const ACCENTS = {
  green:  '#D4FF00',
  lime:   '#D4FF00',
  orange: '#FF6B35',
};

const BGS = {
  black:  { bg: '#000000', primary: '#f7efdd', secondary: 'rgba(247,239,221,0.7)', accent_use: true,  brand_color: 'rgba(247,239,221,0.5)' },
  orange: { bg: '#ff4c0a', primary: '#1a1a1a', secondary: 'rgba(26,26,26,0.7)',     accent_use: false, brand_color: 'rgba(26,26,26,0.55)' },
  lime:   { bg: '#D4FF00', primary: '#1a1a1a', secondary: 'rgba(26,26,26,0.7)',     accent_use: false, brand_color: 'rgba(26,26,26,0.55)' },
  cream:  { bg: '#f7efdd', primary: '#1a1a1a', secondary: 'rgba(26,26,26,0.6)',     accent_use: true,  brand_color: 'rgba(26,26,26,0.4)' },
};

function getAccent(accent) { return ACCENTS[accent] || ACCENTS.green; }
function getBg(bg)         { return BGS[bg]         || BGS.black; }

// ── Font URLs — WOFF format (Satori does NOT support woff2) ──────────
const FONT_URLS = {
  bebasNeue: 'https://cdn.jsdelivr.net/npm/@fontsource/bebas-neue@latest/files/bebas-neue-latin-400-normal.woff',
  spaceMono: 'https://cdn.jsdelivr.net/npm/@fontsource/space-mono@latest/files/space-mono-latin-400-normal.woff',
  inter:     'https://cdn.jsdelivr.net/npm/@fontsource/inter@latest/files/inter-latin-400-normal.woff',
  interBold: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@latest/files/inter-latin-800-normal.woff',
  aleo:      'https://cdn.jsdelivr.net/npm/@fontsource/aleo@latest/files/aleo-latin-400-normal.woff',
  aleoItalic:'https://cdn.jsdelivr.net/npm/@fontsource/aleo@latest/files/aleo-latin-300-italic.woff',
};

async function fetchOneFont(url, name, weight = 400, style = 'normal') {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    if (!data || data.byteLength === 0) return null;
    return { name, data, style, weight };
  } catch { return null; }
}

async function loadFonts() {
  const results = await Promise.all([
    fetchOneFont(FONT_URLS.bebasNeue, 'Bebas Neue', 400),
    fetchOneFont(FONT_URLS.spaceMono, 'Space Mono', 400),
    fetchOneFont(FONT_URLS.inter,     'Inter',      400),
    fetchOneFont(FONT_URLS.interBold, 'Inter',      800),
    fetchOneFont(FONT_URLS.aleo,      'Aleo',       400),
    fetchOneFont(FONT_URLS.aleoItalic,'Aleo',       300, 'italic'),
  ]);
  const loaded = results.filter(Boolean);
  return loaded.length > 0 ? loaded : null;
}

// ── Background image + overlay layers ────────────────────────────────
function bgLayers(image, showOverlay) {
  if (!image) return null;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        width="1080"
        height="1920"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '1080px', height: '1920px',
          objectFit: 'cover',
        }}
      />
      {showOverlay ? (
        <div style={{
          display: 'flex',
          position: 'absolute', top: 0, left: 0,
          width: '1080px', height: '1920px',
          backgroundColor: 'rgba(0,0,0,0.55)',
        }} />
      ) : null}
    </>
  );
}

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // ── DEBUG: ?debug=1 → JSON diagnostics ───────────────────────────
    if (searchParams.get('debug') === '1') {
      const statuses = {};
      for (const [key, url] of Object.entries(FONT_URLS)) {
        try {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          statuses[key] = `ok=${res.ok}, status=${res.status}, bytes=${buf.byteLength}`;
        } catch (e) {
          statuses[key] = `FAILED: ${e.message}`;
        }
      }
      return new Response(
        JSON.stringify({
          route: 'working',
          version: 'v2',
          types: ['textpost', 'hook', 'hook[textstyle=pill]', 'body', 'body-cream', 'break-code', 'close', 'close[bg=orange|lime|cream|black]'],
          fonts: statuses,
          timestamp: new Date().toISOString(),
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ── Read params ──────────────────────────────────────────────────
    const type      = searchParams.get('type')      || 'textpost';
    const text      = searchParams.get('text')      || 'no text provided';
    const slide     = searchParams.get('slide')     || '';
    const totalStr  = searchParams.get('total')     || '5';
    const design    = searchParams.get('design')    || '';
    const accent    = searchParams.get('accent')    || 'green';
    const image     = searchParams.get('image')     || '';
    const overlay   = searchParams.get('overlay')   !== 'false';
    const textstyle = searchParams.get('textstyle') || 'koulen';
    const bg        = searchParams.get('bg')        || 'black';
    const tagline   = searchParams.get('tagline')   || '';
    const url_text  = searchParams.get('url')       || 'UNINSPIREDCOLLECTIVE.COM';

    const accentColor = getAccent(accent);
    const bgConfig    = getBg(bg);

    // Load fonts
    const loadedFonts = await loadFonts();
    const imgOpts = { width: 1080, height: 1920 };
    if (loadedFonts) imgOpts.fonts = loadedFonts;

    // Font family constants
    const FH = 'Bebas Neue';   // Headlines (Koulen substitute, similar register)
    const FM = 'Space Mono';   // Tags, counters, monospace
    const FB = 'Inter';        // Sans body / pill text
    const FS = 'Aleo';         // Editorial body (italic for cta body)

    const bgImg = bgLayers(image, overlay);
    const slideTotal = String(totalStr || '5');
    const slideStr = slide ? `${String(slide).padStart(2,'0')} / ${slideTotal.padStart(2,'0')}` : '';

    // ── TEXT POST (short ≤50 chars) ──────────────────────────────────
    if (type === 'textpost' && text.length <= 50) {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#000000', position: 'relative',
          }}>
            {bgImg}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              UNINSPIRED
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-start',
              flexGrow: 1, paddingLeft: '80px', paddingRight: '80px', zIndex: 5,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '130px',
                color: '#FFFFFF', lineHeight: 1.05,
                textTransform: 'lowercase',
              }}>
                {text}
              </div>
              <div style={{ display: 'flex', marginTop: '40px', width: '400px', height: '6px', backgroundColor: accentColor }} />
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '14px', color: 'rgba(247,239,221,0.4)', zIndex: 5 }}>
              @uninspiredcollective
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── TEXT POST (long >50 chars) ───────────────────────────────────
    if (type === 'textpost') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#000000', position: 'relative',
          }}>
            {bgImg}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '0px', width: '100%', justifyContent: 'center', fontFamily: FM, fontSize: '22px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              UNINSPIRED
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              flexGrow: 1, paddingLeft: '100px', paddingRight: '100px', zIndex: 5,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '180px',
                color: accentColor, lineHeight: 0.6, marginBottom: '20px',
              }}>
                "
              </div>
              <div style={{
                display: 'flex',
                fontFamily: FS, fontSize: '52px',
                color: '#FFFFFF', lineHeight: 1.35,
                textAlign: 'center', fontStyle: 'italic',
              }}>
                {text}
              </div>
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── HOOK · TIKTOK NATIVE PILL (textstyle=pill) ───────────────────
    if (type === 'hook' && (textstyle === 'pill' || textstyle === 'native')) {
      const pillLines = text.split(/[\n|]/).map(s => s.trim()).filter(Boolean);
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#1a1a1a', position: 'relative',
          }}>
            {bgImg}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              flexGrow: 1, gap: '16px',
              paddingLeft: '60px', paddingRight: '60px', zIndex: 5,
            }}>
              {pillLines.map((line, i) => (
                <div key={i} style={{
                  display: 'flex',
                  backgroundColor: '#1a1a1a',
                  color: '#FFFFFF',
                  padding: '26px 48px',
                  fontFamily: FB,
                  fontSize: '108px',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textTransform: 'lowercase',
                  borderRadius: '10px',
                }}>
                  {line}
                </div>
              ))}
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '20px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.16em', zIndex: 5 }}>
                {slideStr}
              </div>
            ) : null}
          </div>
        ),
        imgOpts,
      );
    }

    // ── HOOK · KOULEN (default) ──────────────────────────────────────
    if (type === 'hook') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#000000', position: 'relative',
          }}>
            {bgImg}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              UNINSPIRED
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.16em' }}>
                {slideStr}
              </div>
            ) : null}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', alignItems: 'flex-start',
              flexGrow: 1, paddingLeft: '80px', paddingRight: '80px', paddingBottom: '180px', zIndex: 5,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '180px',
                color: '#FFFFFF', lineHeight: 0.95,
                textTransform: 'lowercase', letterSpacing: '-0.02em',
              }}>
                {text}
              </div>
              <div style={{ display: 'flex', width: '24px', height: '24px', borderRadius: '12px', backgroundColor: accentColor, marginTop: '40px' }} />
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '16px', color: 'rgba(247,239,221,0.55)', zIndex: 5, letterSpacing: '0.18em' }}>
              SWIPE →
            </div>
          </div>
        ),
        imgOpts,
      );
    }
// ── BODY · TIKTOK NATIVE PILL (textstyle=pill) ───────────────────
    if (type === 'body' && (textstyle === 'pill' || textstyle === 'native')) {
      const pillLines = text.split(/[\n|]/).map(s => s.trim()).filter(Boolean);
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#1a1a1a', position: 'relative',
          }}>
            {bgImg}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              flexGrow: 1, gap: '12px',
              paddingLeft: '60px', paddingRight: '60px', zIndex: 5,
            }}>
              {pillLines.map((line, i) => (
                <div key={i} style={{
                  display: 'flex',
                  backgroundColor: '#1a1a1a',
                  color: '#FFFFFF',
                  padding: '20px 36px',
                  fontFamily: FB,
                  fontSize: '72px',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                  borderRadius: '8px',
                }}>
                  {line}
                </div>
              ))}
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '20px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.16em', zIndex: 5 }}>
                {slideStr}
              </div>
            ) : null}
          </div>
        ),
        imgOpts,
      );
    }
    // ── BODY · IMAGE BG ──────────────────────────────────────────────
    if (type === 'body') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#000000', position: 'relative',
          }}>
            {bgImg}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              UNINSPIRED
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.16em' }}>
                {slideStr}
              </div>
            ) : null}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-start',
              flexGrow: 1, paddingLeft: '80px', paddingRight: '80px', zIndex: 5,
            }}>
              <div style={{ display: 'flex', width: '60px', height: '3px', backgroundColor: accentColor, marginBottom: '40px' }} />
              <div style={{
                display: 'flex',
                fontFamily: FB, fontSize: '52px',
                color: '#E8E0CD', lineHeight: 1.45,
              }}>
                {text}
              </div>
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '16px', color: 'rgba(247,239,221,0.55)', zIndex: 5, letterSpacing: '0.18em' }}>
              SWIPE →
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── BODY · CREAM INTERRUPT (no image, cream bg) ──────────────────
    if (type === 'body-cream') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#f7efdd', position: 'relative',
          }}>
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: '#ff4c0a', zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: 'rgba(26,26,26,0.4)', zIndex: 5, letterSpacing: '0.18em' }}>
              UNINSPIRED
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: 'rgba(26,26,26,0.4)', zIndex: 5, letterSpacing: '0.16em' }}>
                {slideStr}
              </div>
            ) : null}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-start',
              flexGrow: 1, paddingLeft: '80px', paddingRight: '80px', zIndex: 5,
            }}>
              {tagline ? (
                <div style={{ display: 'flex', fontFamily: FM, fontSize: '24px', color: '#ff4c0a', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '36px' }}>
                  {tagline}
                </div>
              ) : null}
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '130px',
                color: '#1a1a1a', lineHeight: 0.96,
                textTransform: 'lowercase', letterSpacing: '-0.02em',
                marginBottom: '50px',
              }}>
                {text}
              </div>
              {design ? (
                <div style={{
                  display: 'flex',
                  fontFamily: FS, fontSize: '38px',
                  color: 'rgba(26,26,26,0.7)', lineHeight: 1.5,
                  fontStyle: 'italic', maxWidth: '880px',
                }}>
                  {design}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '16px', color: 'rgba(26,26,26,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              SWIPE →
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── BREAK-CODE · DESIGN MOMENT (black + barcode + huge accent) ──
    if (type === 'break-code') {
      // Barcode bg: many small mono text fragments tiled via flex-wrap
      const barcodeText = (design || text || 'STILL LOADING').toUpperCase();
      const fragments = Array(140).fill(`${barcodeText} / `);

      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: '#0d0d0d', position: 'relative',
          }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              position: 'absolute', inset: 0,
              padding: '20px 16px',
              fontFamily: FM, fontSize: '14px',
              letterSpacing: '0.06em',
              color: 'rgba(212,255,0,0.06)',
              zIndex: 0, gap: '8px',
            }}>
              {fragments.map((f, i) => (
                <div key={i} style={{ display: 'flex' }}>{f}</div>
              ))}
            </div>

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: 'rgba(212,255,0,0.5)', zIndex: 5, letterSpacing: '0.16em' }}>
                {slideStr}
              </div>
            ) : null}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              flexGrow: 1, paddingLeft: '60px', paddingRight: '60px', zIndex: 5,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '320px',
                color: accentColor, lineHeight: 0.88,
                textTransform: 'uppercase', letterSpacing: '-0.02em',
                textAlign: 'center',
              }}>
                {design || text}
              </div>
              {tagline ? (
                <div style={{
                  display: 'flex',
                  fontFamily: FM, fontSize: '22px',
                  color: 'rgba(247,239,221,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.3em',
                  marginTop: '60px', textAlign: 'center',
                }}>
                  {tagline}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '16px', color: 'rgba(247,239,221,0.5)', zIndex: 5, letterSpacing: '0.18em' }}>
              SWIPE →
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── CLOSE / CTA · with bg=black|orange|lime|cream variants ───────
    if (type === 'close' || type === 'cta') {
      const c = bgConfig;
      const designColor = c.accent_use ? accentColor : c.primary;
      return new ImageResponse(
        (
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            backgroundColor: c.bg, position: 'relative',
          }}>
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: bg === 'black' ? accentColor : '#1a1a1a', zIndex: 1 }} />

            {slideStr ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: c.brand_color, zIndex: 5, letterSpacing: '0.16em' }}>
                {slideStr}
              </div>
            ) : null}

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-start', alignItems: 'flex-start',
              flexGrow: 0, paddingTop: '180px', paddingLeft: '80px', paddingRight: '80px', zIndex: 5,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH, fontSize: '260px',
                color: designColor, lineHeight: 0.9,
                textTransform: 'uppercase', letterSpacing: '-0.02em',
              }}>
                {design || text || 'UNINSPIRED'}
              </div>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', alignItems: 'flex-start',
              flexGrow: 1, paddingLeft: '80px', paddingRight: '80px', paddingBottom: '160px', zIndex: 5,
            }}>
              {text && text !== (design || '') ? (
                <div style={{
                  display: 'flex',
                  fontFamily: FS, fontSize: '38px',
                  color: c.secondary, lineHeight: 1.4,
                  fontStyle: 'italic', marginBottom: '32px',
                }}>
                  {text}
                </div>
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', width: '320px', height: '3px', backgroundColor: c.primary, marginBottom: '20px' }} />
                <div style={{
                  display: 'flex',
                  fontFamily: FM, fontSize: '26px',
                  color: c.primary, letterSpacing: '0.18em',
                  textTransform: 'uppercase', fontWeight: 700,
                }}>
                  {url_text}
                </div>
              </div>
            </div>
          </div>
        ),
        imgOpts,
      );
    }

    // ── Fallback ─────────────────────────────────────────────────────
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '100%', height: '100%',
          backgroundColor: '#000000',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '24px',
        }}>
          <div style={{ display: 'flex', fontSize: '60px', color: '#D4FF00' }}>
            Unknown type: {type}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#888' }}>
            Valid: textpost · hook · body · body-cream · break-code · close
          </div>
        </div>
      ),
      imgOpts,
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
