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

// ── Font loading — each font individually, with timeout ──────────────
async function fetchOneFont(url, name, weight) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.arrayBuffer();
    if (!data || data.byteLength === 0) return null;
    return { name, data, style: 'normal', weight: weight || 400 };
  } catch {
    return null;
  }
}

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // ── DEBUG: ?debug=1 → JSON diagnostics ──────────────────────
    if (searchParams.get('debug') === '1') {
      let fontStatus = 'not attempted';
      try {
        const testFetch = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2');
        fontStatus = `status=${testFetch.status}, type=${testFetch.headers.get('content-type')}, ok=${testFetch.ok}`;
        const buf = await testFetch.arrayBuffer();
        fontStatus += `, bytes=${buf.byteLength}`;
      } catch (e) {
        fontStatus = `FAILED: ${e.message}`;
      }
      return new Response(
        JSON.stringify({ route: 'working', fontFetchTest: fontStatus, timestamp: new Date().toISOString() }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ── FONT TESTS: ?test=bebas|space|inter|all|none ─────────────
    // These isolate which font is causing the blank image
    const testMode = searchParams.get('test');
    if (testMode) {
      const URLS = {
        bebas: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2',
        space: 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2',
        inter: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
      };

      const fonts = [];
      let label = testMode;

      if (testMode === 'bebas' || testMode === 'all') {
        const f = await fetchOneFont(URLS.bebas, 'Bebas Neue', 400);
        if (f) fonts.push(f);
      }
      if (testMode === 'space' || testMode === 'all') {
        const f = await fetchOneFont(URLS.space, 'Space Mono', 400);
        if (f) fonts.push(f);
      }
      if (testMode === 'inter' || testMode === 'all') {
        const f = await fetchOneFont(URLS.inter, 'Inter', 400);
        if (f) fonts.push(f);
      }

      const opts = { width: 1080, height: 1920 };
      if (fonts.length > 0) {
        opts.fonts = fonts;
        label += ` (${fonts.length} fonts loaded, ${fonts.map(f => f.name).join('+')})`;
      } else {
        label += ' (no fonts / default)';
      }

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
            <div style={{ display: 'flex', fontSize: '80px', color: '#D4FF00', marginBottom: '40px' }}>
              FONT TEST
            </div>
            <div style={{ display: 'flex', fontSize: '40px', color: '#ffffff', marginBottom: '20px' }}>
              {label}
            </div>
            <div style={{ display: 'flex', fontSize: '30px', color: '#888888' }}>
              If you can see this, it works
            </div>
          </div>
        ),
        opts,
      );
    }

    // ── MAIN ROUTE — working version (no custom fonts for now) ───
    const type = searchParams.get('type') || 'textpost';
    const text = searchParams.get('text') || 'no text provided';
    const slide = searchParams.get('slide') || '';
    const collection = searchParams.get('collection') || '';
    const design = searchParams.get('design') || '';
    const accent = searchParams.get('accent') || 'green';

    const accentColor = getAccent(accent);
    const imgOpts = { width: 1080, height: 1920 };

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
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#1a1a1a' }}>
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
            }}>
              <div style={{
                display: 'flex',
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

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#1a1a1a' }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
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
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '0px', width: '100%', justifyContent: 'center', fontSize: '22px', color: '#1a1a1a' }}>
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
            }}>
              <div style={{
                display: 'flex',
                fontSize: '180px',
                color: accentColor,
                lineHeight: 0.6,
                marginBottom: '20px',
              }}>
                {'\u201C'}
              </div>

              <div style={{
                display: 'flex',
                fontSize: '54px',
                fontWeight: 300,
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
                  fontSize: '14px',
                  color: '#222222',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                }}>
                  {collection}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '0px', width: '100%', justifyContent: 'center', fontSize: '14px', color: '#1a1a1a' }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
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
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
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
            }}>
              <div style={{
                display: 'flex',
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
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
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
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
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
                fontSize: '52px',
                fontWeight: 300,
                color: '#D0D0D0',
                lineHeight: 1.45,
              }}>
                {text}
              </div>
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
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
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
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
            }}>
              {design ? (
                <div style={{
                  display: 'flex',
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
                fontSize: '48px',
                fontWeight: 300,
                color: '#888888',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {text}
              </div>
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              @uninspiredcollective
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
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
