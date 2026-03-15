import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// ── Colors ───────────────────────────────────────────────────────────
const ACCENTS = {
  green: '#D4FF00',
  orange: '#FF6B35',
};

function getAccent(accent) {
  return ACCENTS[accent] || ACCENTS.green;
}

// ── Font URLs — WOFF format (Satori does NOT support woff2) ──────────
const FONT_URLS = {
  bebasNeue: 'https://cdn.jsdelivr.net/npm/@fontsource/bebas-neue@latest/files/bebas-neue-latin-400-normal.woff',
  spaceMono: 'https://cdn.jsdelivr.net/npm/@fontsource/space-mono@latest/files/space-mono-latin-400-normal.woff',
  inter: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@latest/files/inter-latin-400-normal.woff',
};

// ── Font loading ─────────────────────────────────────────────────────
async function fetchOneFont(url, name) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    if (!data || data.byteLength === 0) return null;
    return { name, data, style: 'normal', weight: 400 };
  } catch {
    return null;
  }
}

async function loadFonts() {
  const results = await Promise.all([
    fetchOneFont(FONT_URLS.bebasNeue, 'Bebas Neue'),
    fetchOneFont(FONT_URLS.spaceMono, 'Space Mono'),
    fetchOneFont(FONT_URLS.inter, 'Inter'),
  ]);
  const loaded = results.filter(Boolean);
  return loaded.length > 0 ? loaded : null;
}

// ── Background image + overlay layers ────────────────────────────────
// Returns array of JSX elements to prepend inside the root div
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
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1080px',
          height: '1920px',
          objectFit: 'cover',
        }}
      />
      {showOverlay ? (
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1080px',
          height: '1920px',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }} />
      ) : null}
    </>
  );
}

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // ── DEBUG: ?debug=1 → JSON diagnostics ──────────────────────
    if (searchParams.get('debug') === '1') {
      const statuses = {};
      for (const [key, url] of Object.entries(FONT_URLS)) {
        try {
          const res = await fetch(url);
          const buf = await res.arrayBuffer();
          statuses[key] = `ok=${res.ok}, status=${res.status}, bytes=${buf.byteLength}, type=${res.headers.get('content-type')}`;
        } catch (e) {
          statuses[key] = `FAILED: ${e.message}`;
        }
      }
      return new Response(
        JSON.stringify({ route: 'working', fonts: statuses, timestamp: new Date().toISOString() }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ── FONT TEST: ?test=1 → minimal image with fonts ───────────
    if (searchParams.get('test') === '1') {
      const fonts = await loadFonts();
      const opts = { width: 1080, height: 1920 };
      if (fonts) opts.fonts = fonts;

      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}>
            <div style={{ display: 'flex', fontSize: '100px', color: '#D4FF00', fontFamily: 'Bebas Neue', marginBottom: '40px' }}>
              BEBAS NEUE WORKS
            </div>
            <div style={{ display: 'flex', fontSize: '40px', color: '#ffffff', fontFamily: 'Space Mono', marginBottom: '40px' }}>
              Space Mono works
            </div>
            <div style={{ display: 'flex', fontSize: '40px', color: '#888888', fontFamily: 'Inter' }}>
              Inter works too
            </div>
          </div>
        ),
        opts,
      );
    }

    // ── MAIN ROUTE ───────────────────────────────────────────────
    const type = searchParams.get('type') || 'textpost';
    const text = searchParams.get('text') || 'no text provided';
    const slide = searchParams.get('slide') || '';
    const collection = searchParams.get('collection') || '';
    const design = searchParams.get('design') || '';
    const accent = searchParams.get('accent') || 'green';
    const image = searchParams.get('image') || '';
    const overlay = searchParams.get('overlay') !== 'false'; // defaults to true

    const accentColor = getAccent(accent);

    // Load fonts (WOFF format — Satori compatible)
    const loadedFonts = await loadFonts();
    const imgOpts = { width: 1080, height: 1920 };
    if (loadedFonts) imgOpts.fonts = loadedFonts;

    // Font family constants
    const FH = 'Bebas Neue';   // Headlines
    const FM = 'Space Mono';   // Logo, tags, counters
    const FB = 'Inter';        // Body text

    // Background layers (image + optional overlay)
    const bg = bgLayers(image, overlay);

    // ── TEXT POST (short ≤50 chars) ────────────────────────────────
    if (type === 'textpost' && text.length <= 50) {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}>
            {bg}

            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: '#1a1a1a', zIndex: 1 }}>
              UNINSPIRED
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
              zIndex: 1,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH,
                fontSize: '130px',
                color: '#FFFFFF',
                lineHeight: 1.05,
                textTransform: 'lowercase',
              }}>
                {text}
              </div>

              <div style={{
                display: 'flex',
                marginTop: '40px',
                width: '400px',
                height: '6px',
                backgroundColor: accentColor,
              }} />
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '14px', color: '#1a1a1a', zIndex: 1 }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111', zIndex: 1 }} />
          </div>
        ),
        imgOpts,
      );
    }

    // ── TEXT POST (long >50 chars) ─────────────────────────────────
    if (type === 'textpost') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}>
            {bg}

            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '0px', width: '100%', justifyContent: 'center', fontFamily: FM, fontSize: '22px', color: '#1a1a1a', zIndex: 1 }}>
              UNINSPIRED
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              paddingLeft: '100px',
              paddingRight: '100px',
              zIndex: 1,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH,
                fontSize: '180px',
                color: accentColor,
                lineHeight: 0.6,
                marginBottom: '20px',
              }}>
                {'\u201C'}
              </div>

              <div style={{
                display: 'flex',
                fontFamily: FB,
                fontSize: '54px',
                color: '#E0E0E0',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {text}
              </div>

              <div style={{
                display: 'flex',
                width: '80px',
                height: '2px',
                backgroundColor: '#222222',
                marginTop: '50px',
              }} />

              {collection ? (
                <div style={{
                  display: 'flex',
                  fontFamily: FM,
                  fontSize: '14px',
                  color: '#222222',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                }}>
                  {collection}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '0px', width: '100%', justifyContent: 'center', fontFamily: FM, fontSize: '14px', color: '#1a1a1a', zIndex: 1 }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111', zIndex: 1 }} />
          </div>
        ),
        imgOpts,
      );
    }

    // ── HOOK ───────────────────────────────────────────────────────
    if (type === 'hook') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}>
            {bg}

            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: '#333333', zIndex: 1 }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: '#222222', zIndex: 1 }}>
                {slide} / 5
              </div>
            ) : null}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
              zIndex: 1,
            }}>
              <div style={{
                display: 'flex',
                fontFamily: FH,
                fontSize: '120px',
                color: '#FFFFFF',
                lineHeight: 1.05,
                textTransform: 'lowercase',
              }}>
                {text}
              </div>

              <div style={{
                display: 'flex',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                marginTop: '40px',
              }} />
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: FM, fontSize: '14px', color: '#222222', textTransform: 'uppercase', zIndex: 1 }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FB, fontSize: '14px', color: '#333333', zIndex: 1 }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111', zIndex: 1 }} />
          </div>
        ),
        imgOpts,
      );
    }

    // ── BODY ──────────────────────────────────────────────────────
    if (type === 'body') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}>
            {bg}

            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: '#333333', zIndex: 1 }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: '#222222', zIndex: 1 }}>
                {slide} / 5
              </div>
            ) : null}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
              zIndex: 1,
            }}>
              <div style={{
                display: 'flex',
                width: '60px',
                height: '3px',
                backgroundColor: accentColor,
                marginBottom: '40px',
              }} />

              <div style={{
                display: 'flex',
                fontFamily: FB,
                fontSize: '52px',
                color: '#D0D0D0',
                lineHeight: 1.45,
              }}>
                {text}
              </div>
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: FM, fontSize: '14px', color: '#222222', textTransform: 'uppercase', zIndex: 1 }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FB, fontSize: '14px', color: '#333333', zIndex: 1 }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111', zIndex: 1 }} />
          </div>
        ),
        imgOpts,
      );
    }

    // ── CLOSE ─────────────────────────────────────────────────────
    if (type === 'close') {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}>
            {bg}

            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor, zIndex: 1 }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: FM, fontSize: '22px', color: '#333333', zIndex: 1 }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: FM, fontSize: '18px', color: '#222222', zIndex: 1 }}>
                {slide} / 5
              </div>
            ) : null}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
              zIndex: 1,
            }}>
              {design ? (
                <div style={{
                  display: 'flex',
                  fontFamily: FH,
                  fontSize: '140px',
                  color: accentColor,
                  textTransform: 'uppercase',
                  lineHeight: 1.05,
                  textAlign: 'center',
                  marginBottom: '40px',
                }}>
                  {design}
                </div>
              ) : null}

              <div style={{
                display: 'flex',
                width: '80px',
                height: '2px',
                backgroundColor: '#333333',
                marginBottom: '40px',
              }} />

              <div style={{
                display: 'flex',
                fontFamily: FB,
                fontSize: '48px',
                color: '#888888',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {text}
              </div>
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: FM, fontSize: '14px', color: '#222222', textTransform: 'uppercase', zIndex: 1 }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: FM, fontSize: '14px', color: '#333333', zIndex: 1 }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111', zIndex: 1 }} />
          </div>
        ),
        imgOpts,
      );
    }

    // ── Fallback ──────────────────────────────────────────────────
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', fontSize: '60px', color: '#D4FF00' }}>
            Unknown type: {type}
          </div>
        </div>
      ),
      imgOpts,
    );
  } catch (err) {
    try {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a0000',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}>
            <div style={{ display: 'flex', fontSize: '60px', color: '#ff4444', marginBottom: '40px' }}>
              ERROR
            </div>
            <div style={{ display: 'flex', fontSize: '32px', color: '#ff8888', textAlign: 'center' }}>
              {String(err && err.message ? err.message : err)}
            </div>
          </div>
        ),
        { width: 1080, height: 1920 },
      );
    } catch {
      return new Response(
        JSON.stringify({ error: String(err && err.message ? err.message : err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }
}
