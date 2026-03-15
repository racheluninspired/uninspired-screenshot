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

// ── Font loading with timeout + fallback ─────────────────────────────
async function loadFonts() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s max

    const [bebasNeue, spaceMono, inter] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2', { signal: controller.signal }).then(r => r.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2', { signal: controller.signal }).then(r => r.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2', { signal: controller.signal }).then(r => r.arrayBuffer()),
    ]);

    clearTimeout(timeout);

    return [
      { name: 'Bebas Neue', data: bebasNeue, style: 'normal', weight: 400 },
      { name: 'Space Mono', data: spaceMono, style: 'normal', weight: 400 },
      { name: 'Inter', data: inter, style: 'normal', weight: 400 },
    ];
  } catch {
    // Font loading failed — return null to signal "use defaults"
    return null;
  }
}

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  // Outer safety net — if ANYTHING crashes, return plain text (not blank)
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'textpost';
    const text = searchParams.get('text') || 'no text provided';
    const slide = searchParams.get('slide') || '';
    const collection = searchParams.get('collection') || '';
    const design = searchParams.get('design') || '';
    const accent = searchParams.get('accent') || 'green';

    const accentColor = getAccent(accent);

    // Load fonts — null means "failed, use defaults"
    const loadedFonts = await loadFonts();

    // CRITICAL: only pass fonts key if we actually loaded fonts.
    // Passing fonts:[] crashes Satori. Omitting fonts lets next/og use its built-in.
    const imgOpts = { width: 1080, height: 1920 };
    if (loadedFonts && loadedFonts.length > 0) {
      imgOpts.fonts = loadedFonts;
    }

    // Font family names — if fonts loaded, these match. If not, Satori ignores unknown names.
    const F_HEADLINE = 'Bebas Neue';
    const F_MONO = 'Space Mono';
    const F_BODY = 'Inter';

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

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: F_MONO, fontSize: '22px', color: '#1a1a1a' }}>
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
                fontFamily: F_HEADLINE,
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

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: F_MONO, fontSize: '14px', color: '#1a1a1a' }}>
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

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '0px', width: '100%', justifyContent: 'center', fontFamily: F_MONO, fontSize: '22px', color: '#1a1a1a' }}>
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
                fontFamily: F_HEADLINE,
                fontSize: '180px',
                color: accentColor,
                lineHeight: 0.6,
                marginBottom: '20px',
              }}>
                {'\u201C'}
              </div>

              <div style={{
                display: 'flex',
                fontFamily: F_BODY,
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
                  fontFamily: F_MONO,
                  fontSize: '14px',
                  color: '#222222',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                }}>
                  {collection}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '0px', width: '100%', justifyContent: 'center', fontFamily: F_MONO, fontSize: '14px', color: '#1a1a1a' }}>
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

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: F_MONO, fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: F_MONO, fontSize: '18px', color: '#222222' }}>
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
                fontFamily: F_HEADLINE,
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
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: F_MONO, fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: F_BODY, fontSize: '14px', color: '#333333' }}>
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

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: F_MONO, fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: F_MONO, fontSize: '18px', color: '#222222' }}>
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
                fontFamily: F_BODY,
                fontSize: '52px',
                fontWeight: 300,
                color: '#D0D0D0',
                lineHeight: 1.45,
              }}>
                {text}
              </div>
            </div>

            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: F_MONO, fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: F_BODY, fontSize: '14px', color: '#333333' }}>
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

            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontFamily: F_MONO, fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontFamily: F_MONO, fontSize: '18px', color: '#222222' }}>
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
                  fontFamily: F_HEADLINE,
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
                fontFamily: F_BODY,
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
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontFamily: F_MONO, fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontFamily: F_MONO, fontSize: '14px', color: '#333333' }}>
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
    // Inner safety: try to render error as image
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
      // Nuclear fallback — plain text response
      return new Response(
        JSON.stringify({ error: String(err && err.message ? err.message : err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }
}
