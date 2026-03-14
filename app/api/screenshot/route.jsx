import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// ── Font URLs (Google Fonts CDN, woff2) ──────────────────────────────
const FONT_URLS = {
  bebasNeue: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2',
  spaceMono: 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2',
  inter: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
};

// ── Colors ───────────────────────────────────────────────────────────
const ACCENTS = {
  green: '#D4FF00',
  orange: '#FF6B35',
};

// ── Helpers ──────────────────────────────────────────────────────────
async function loadFonts() {
  const [bebasNeue, spaceMono, inter] = await Promise.all([
    fetch(FONT_URLS.bebasNeue).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.spaceMono).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.inter).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: 'Bebas Neue', data: bebasNeue, style: 'normal' },
    { name: 'Space Mono', data: spaceMono, style: 'normal' },
    { name: 'Inter', data: inter, style: 'normal' },
  ];
}

function getAccent(accent) {
  return ACCENTS[accent] || ACCENTS.green;
}

// ── Shared Chrome (logo, counter, collection, swipe/handle) ─────────
function CarouselChrome({ slide, totalSlides, collection, accentColor, isLastSlide }) {
  return [
    // Top accent bar
    { key: 'top-bar', node: (
      <div key="top-bar" style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '4px', background: accentColor, display: 'flex' }} />
    )},
    // Bottom line
    { key: 'bot-line', node: (
      <div key="bot-line" style={{ position: 'absolute', bottom: 0, left: 0, width: '1080px', height: '2px', background: '#111111', display: 'flex' }} />
    )},
    // Logo top-left
    { key: 'logo', node: (
      <div key="logo" style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: '"Space Mono"', fontSize: '22px', color: '#333333', display: 'flex' }}>
        UNINSPIRED
      </div>
    )},
    // Slide counter top-right
    { key: 'counter', node: slide ? (
      <div key="counter" style={{ position: 'absolute', top: '60px', right: '80px', fontFamily: '"Space Mono"', fontSize: '18px', color: '#222222', display: 'flex' }}>
        {slide} / {totalSlides || '5'}
      </div>
    ) : null },
    // Collection tag bottom-left
    { key: 'collection', node: collection ? (
      <div key="collection" style={{ position: 'absolute', bottom: '60px', left: '80px', fontFamily: '"Space Mono"', fontSize: '14px', color: '#222222', textTransform: 'uppercase', display: 'flex' }}>
        {collection}
      </div>
    ) : null },
    // Swipe or handle bottom-right
    { key: 'swipe', node: (
      <div key="swipe" style={{ position: 'absolute', bottom: '60px', right: '80px', fontFamily: '"Inter"', fontSize: '14px', color: '#333333', display: 'flex' }}>
        {isLastSlide ? '@uninspiredcollective' : 'swipe →'}
      </div>
    )},
  ];
}

// ── TEXT POST — Full Bleed (short, ≤50 chars) ────────────────────────
function TextPostShort({ text, accentColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '1920px', background: '#000000', position: 'relative' }}>
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '4px', background: accentColor, display: 'flex' }} />

      {/* Logo top-left, barely visible */}
      <div style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: '"Space Mono"', fontSize: '22px', color: '#1a1a1a', display: 'flex' }}>
        UNINSPIRED
      </div>

      {/* Main text area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        padding: '200px 80px',
      }}>
        <div style={{
          fontFamily: '"Bebas Neue"',
          fontSize: '130px',
          color: '#FFFFFF',
          lineHeight: 1.05,
          textTransform: 'lowercase',
          display: 'flex',
        }}>
          {text}
        </div>

        {/* Gradient accent bar below text */}
        <div style={{
          marginTop: '40px',
          width: '400px',
          height: '6px',
          display: 'flex',
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }} />
      </div>

      {/* Handle bottom-right, barely visible */}
      <div style={{ position: 'absolute', bottom: '60px', right: '80px', fontFamily: '"Space Mono"', fontSize: '14px', color: '#1a1a1a', display: 'flex' }}>
        @uninspiredcollective
      </div>

      {/* Bottom line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '1080px', height: '2px', background: '#111111', display: 'flex' }} />
    </div>
  );
}

// ── TEXT POST — Centered Quote (long, >50 chars) ─────────────────────
function TextPostLong({ text, accentColor, collection }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '1920px', background: '#000000', position: 'relative' }}>
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '4px', background: accentColor, display: 'flex' }} />

      {/* Logo centered top, barely visible */}
      <div style={{ position: 'absolute', top: '60px', left: 0, width: '1080px', display: 'flex', justifyContent: 'center', fontFamily: '"Space Mono"', fontSize: '22px', color: '#1a1a1a' }}>
        UNINSPIRED
      </div>

      {/* Centered content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '200px 100px',
      }}>
        {/* Giant quotation mark */}
        <div style={{
          fontFamily: '"Bebas Neue"',
          fontSize: '180px',
          color: accentColor,
          lineHeight: 0.6,
          marginBottom: '20px',
          display: 'flex',
        }}>
          {'\u201C'}
        </div>

        {/* Body text */}
        <div style={{
          fontFamily: '"Inter"',
          fontSize: '54px',
          fontWeight: 300,
          color: '#E0E0E0',
          textAlign: 'center',
          lineHeight: 1.4,
          display: 'flex',
        }}>
          {text}
        </div>

        {/* Divider line */}
        <div style={{
          width: '80px',
          height: '2px',
          background: '#222222',
          marginTop: '50px',
          display: 'flex',
        }} />

        {/* Collection name */}
        {collection && (
          <div style={{
            fontFamily: '"Space Mono"',
            fontSize: '14px',
            color: '#222222',
            textTransform: 'uppercase',
            marginTop: '20px',
            display: 'flex',
          }}>
            {collection}
          </div>
        )}
      </div>

      {/* Handle centered bottom, barely visible */}
      <div style={{ position: 'absolute', bottom: '60px', left: 0, width: '1080px', display: 'flex', justifyContent: 'center', fontFamily: '"Space Mono"', fontSize: '14px', color: '#1a1a1a' }}>
        @uninspiredcollective
      </div>

      {/* Bottom line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '1080px', height: '2px', background: '#111111', display: 'flex' }} />
    </div>
  );
}

// ── CAROUSEL: HOOK ───────────────────────────────────────────────────
function HookSlide({ text, accentColor, slide, collection }) {
  const isLastSlide = String(slide) === '5';
  const chrome = CarouselChrome({ slide, totalSlides: '5', collection, accentColor, isLastSlide });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '1920px', background: '#000000', position: 'relative' }}>
      {chrome.map((c) => c.node)}

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        padding: '200px 80px',
      }}>
        <div style={{
          fontFamily: '"Bebas Neue"',
          fontSize: '120px',
          color: '#FFFFFF',
          lineHeight: 1.05,
          textTransform: 'lowercase',
          display: 'flex',
        }}>
          {text}
        </div>

        {/* Accent dot */}
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: accentColor,
          marginTop: '40px',
          display: 'flex',
        }} />
      </div>
    </div>
  );
}

// ── CAROUSEL: BODY ───────────────────────────────────────────────────
function BodySlide({ text, accentColor, slide, collection }) {
  const isLastSlide = String(slide) === '5';
  const chrome = CarouselChrome({ slide, totalSlides: '5', collection, accentColor, isLastSlide });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '1920px', background: '#000000', position: 'relative' }}>
      {chrome.map((c) => c.node)}

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        padding: '200px 80px',
      }}>
        {/* Accent line above text */}
        <div style={{
          width: '60px',
          height: '3px',
          background: accentColor,
          marginBottom: '40px',
          display: 'flex',
        }} />

        <div style={{
          fontFamily: '"Inter"',
          fontSize: '52px',
          fontWeight: 300,
          color: '#D0D0D0',
          lineHeight: 1.45,
          display: 'flex',
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}

// ── CAROUSEL: CLOSE ──────────────────────────────────────────────────
function CloseSlide({ text, accentColor, slide, collection, design }) {
  const chrome = CarouselChrome({ slide, totalSlides: '5', collection, accentColor, isLastSlide: true });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1080px', height: '1920px', background: '#000000', position: 'relative' }}>
      {chrome.map((c) => c.node)}

      {/* Centered content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '200px 80px',
      }}>
        {/* Design name in accent color */}
        {design && (
          <div style={{
            fontFamily: '"Bebas Neue"',
            fontSize: '140px',
            color: accentColor,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            textAlign: 'center',
            marginBottom: '40px',
            display: 'flex',
          }}>
            {design}
          </div>
        )}

        {/* Divider */}
        <div style={{
          width: '80px',
          height: '2px',
          background: '#333333',
          marginBottom: '40px',
          display: 'flex',
        }} />

        {/* Closing text */}
        <div style={{
          fontFamily: '"Inter"',
          fontSize: '48px',
          fontWeight: 300,
          color: '#888888',
          fontStyle: 'italic',
          textAlign: 'center',
          lineHeight: 1.4,
          display: 'flex',
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}

// ── Main GET handler ─────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || 'textpost';
    const text = searchParams.get('text') || '';
    const slide = searchParams.get('slide') || '';
    const collection = searchParams.get('collection') || '';
    const design = searchParams.get('design') || '';
    const accent = searchParams.get('accent') || 'green';

    const accentColor = getAccent(accent);
    const fonts = await loadFonts();

    let element;

    switch (type) {
      case 'textpost':
        if (text.length <= 50) {
          element = <TextPostShort text={text} accentColor={accentColor} />;
        } else {
          element = <TextPostLong text={text} accentColor={accentColor} collection={collection} />;
        }
        break;

      case 'hook':
        element = <HookSlide text={text} accentColor={accentColor} slide={slide} collection={collection} />;
        break;

      case 'body':
        element = <BodySlide text={text} accentColor={accentColor} slide={slide} collection={collection} />;
        break;

      case 'close':
        element = <CloseSlide text={text} accentColor={accentColor} slide={slide} collection={collection} design={design} />;
        break;

      default:
        element = <TextPostShort text={text || 'unknown type'} accentColor={accentColor} />;
    }

    return new ImageResponse(element, {
      width: 1080,
      height: 1920,
      fonts,
    });
  } catch (err) {
    return new Response(`Error generating image: ${err.message}`, { status: 500 });
  }
}
