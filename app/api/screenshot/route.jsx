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

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'textpost';
    const text = searchParams.get('text') || 'no text provided';
    const slide = searchParams.get('slide') || '';
    const collection = searchParams.get('collection') || '';
    const design = searchParams.get('design') || '';
    const accent = searchParams.get('accent') || 'green';

    const accentColor = getAccent(accent);

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
            {/* Top accent bar */}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            {/* Logo top-left, barely visible */}
            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#1a1a1a' }}>
              UNINSPIRED
            </div>

            {/* Main text */}
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

              {/* Accent bar below text */}
              <div style={{
                display: 'flex',
                marginTop: '40px',
                width: '400px',
                height: '6px',
                backgroundColor: accentColor,
              }} />
            </div>

            {/* Handle bottom-right, barely visible */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#1a1a1a' }}>
              @uninspiredcollective
            </div>

            {/* Bottom line */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
          </div>
        ),
        { width: 1080, height: 1920 },
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
            {/* Top accent bar */}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            {/* Logo centered top, barely visible */}
            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '0px', width: '100%', justifyContent: 'center', fontSize: '22px', color: '#1a1a1a' }}>
              UNINSPIRED
            </div>

            {/* Centered content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              paddingLeft: '100px',
              paddingRight: '100px',
            }}>
              {/* Giant quotation mark */}
              <div style={{
                display: 'flex',
                fontSize: '180px',
                color: accentColor,
                lineHeight: 0.6,
                marginBottom: '20px',
              }}>
                &ldquo;
              </div>

              {/* Body text */}
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

              {/* Divider line */}
              <div style={{
                display: 'flex',
                width: '80px',
                height: '2px',
                backgroundColor: '#222222',
                marginTop: '50px',
              }} />

              {/* Collection name */}
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

            {/* Handle centered bottom, barely visible */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '0px', width: '100%', justifyContent: 'center', fontSize: '14px', color: '#1a1a1a' }}>
              @uninspiredcollective
            </div>

            {/* Bottom line */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
          </div>
        ),
        { width: 1080, height: 1920 },
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
            {/* Top accent bar */}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            {/* Logo top-left */}
            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {/* Slide counter top-right */}
            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
                {slide} / 5
              </div>
            ) : null}

            {/* Main content */}
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

              {/* Accent dot */}
              <div style={{
                display: 'flex',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                marginTop: '40px',
              }} />
            </div>

            {/* Collection tag bottom-left */}
            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            {/* Swipe or handle bottom-right */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            {/* Bottom line */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
          </div>
        ),
        { width: 1080, height: 1920 },
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
            {/* Top accent bar */}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            {/* Logo top-left */}
            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {/* Slide counter top-right */}
            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
                {slide} / 5
              </div>
            ) : null}

            {/* Main content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
            }}>
              {/* Accent line above text */}
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

            {/* Collection tag bottom-left */}
            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            {/* Swipe or handle bottom-right */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              {String(slide) === '5' ? '@uninspiredcollective' : 'swipe \u2192'}
            </div>

            {/* Bottom line */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
          </div>
        ),
        { width: 1080, height: 1920 },
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
            {/* Top accent bar */}
            <div style={{ display: 'flex', width: '100%', height: '4px', backgroundColor: accentColor }} />

            {/* Logo top-left */}
            <div style={{ display: 'flex', position: 'absolute', top: '60px', left: '80px', fontSize: '22px', color: '#333333' }}>
              UNINSPIRED
            </div>

            {/* Slide counter top-right */}
            {slide ? (
              <div style={{ display: 'flex', position: 'absolute', top: '60px', right: '80px', fontSize: '18px', color: '#222222' }}>
                {slide} / 5
              </div>
            ) : null}

            {/* Centered content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              paddingLeft: '80px',
              paddingRight: '80px',
            }}>
              {/* Design name in accent color */}
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

              {/* Divider */}
              <div style={{
                display: 'flex',
                width: '80px',
                height: '2px',
                backgroundColor: '#333333',
                marginBottom: '40px',
              }} />

              {/* Closing text */}
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

            {/* Collection tag bottom-left */}
            {collection ? (
              <div style={{ display: 'flex', position: 'absolute', bottom: '60px', left: '80px', fontSize: '14px', color: '#222222', textTransform: 'uppercase' }}>
                {collection}
              </div>
            ) : null}

            {/* Handle bottom-right (always on close) */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '60px', right: '80px', fontSize: '14px', color: '#333333' }}>
              @uninspiredcollective
            </div>

            {/* Bottom line */}
            <div style={{ display: 'flex', position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '2px', backgroundColor: '#111111' }} />
          </div>
        ),
        { width: 1080, height: 1920 },
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
      { width: 1080, height: 1920 },
    );
  } catch (err) {
    // Return error as a visible image so we can debug
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
            {err.message || 'Unknown error'}
          </div>
        </div>
      ),
      { width: 1080, height: 1920 },
    );
  }
}
