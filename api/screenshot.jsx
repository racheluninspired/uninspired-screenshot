import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Load Bebas Neue font
const bebasFont = fetch(
  'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2'
).then((res) => res.arrayBuffer());

const spaceMonoFont = fetch(
  'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2'
).then((res) => res.arrayBuffer());

const interFont = fetch(
  'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2'
).then((res) => res.arrayBuffer());

export default async function handler(req) {
  const [bebasData, spaceMonoData, interData] = await Promise.all([
    bebasFont, spaceMonoFont, interFont
  ]);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'hook';
  const text = searchParams.get('text') || 'nobody asks how the strong one is doing.';
  const slide = searchParams.get('slide') || '1';
  const collection = searchParams.get('collection') || '';
  const design = searchParams.get('design') || '';
  const accent = searchParams.get('accent') || 'green';

  const green = '#D4FF00';
  const orange = '#FF6B35';
  const accentColor = accent === 'orange' ? orange : green;
  const showCollection = collection && collection.toLowerCase() !== 'general';

  // TEXT POST — Full Bleed (short)
  if (type === 'textpost' && text.length <= 50) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
          <div style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#1a1a1a', textTransform: 'uppercase' }}>UNINSPIRED</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '200px 80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'BebasNeue', fontSize: '130px', lineHeight: 1.05, letterSpacing: '2px', color: '#fff', textTransform: 'lowercase' }}>{text}</div>
              <div style={{ width: '400px', height: '4px', marginTop: '50px', background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)` }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '16px', color: '#1a1a1a' }}>@uninspiredcollective</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' }} />
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts: [
          { name: 'BebasNeue', data: bebasData, style: 'normal' },
          { name: 'SpaceMono', data: spaceMonoData, style: 'normal' },
          { name: 'Inter', data: interData, style: 'normal' },
        ],
      }
    );
  }

  // TEXT POST — Centered Quote (long)
  if (type === 'textpost') {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
          <div style={{ position: 'absolute', top: '60px', left: 0, right: 0, textAlign: 'center', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#1a1a1a', textTransform: 'uppercase', display: 'flex', justifyContent: 'center' }}>UNINSPIRED</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 100px', maxWidth: '840px' }}>
            <div style={{ fontFamily: 'BebasNeue', fontSize: '180px', lineHeight: 0.6, color: accentColor, marginBottom: '40px' }}>"</div>
            <div style={{ fontFamily: 'Inter', fontSize: '54px', fontWeight: 300, lineHeight: 1.55, color: '#E0E0E0', textAlign: 'center' }}>{text}</div>
            <div style={{ width: '80px', height: '2px', background: '#222', margin: '50px 0' }} />
            {showCollection && <div style={{ fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '5px', color: '#222', textTransform: 'uppercase' }}>{collection}</div>}
          </div>
          <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, display: 'flex', justifyContent: 'center', fontFamily: 'Inter', fontSize: '16px', color: '#1a1a1a' }}>@uninspiredcollective</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' }} />
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts: [
          { name: 'BebasNeue', data: bebasData, style: 'normal' },
          { name: 'SpaceMono', data: spaceMonoData, style: 'normal' },
          { name: 'Inter', data: interData, style: 'normal' },
        ],
      }
    );
  }

  // CAROUSEL: HOOK
  if (type === 'hook') {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
          <div style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' }}>UNINSPIRED</div>
          <div style={{ position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' }}>{slide} / 5</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '200px 80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'BebasNeue', fontSize: '120px', lineHeight: 1.05, letterSpacing: '2px', color: '#fff', textTransform: 'lowercase', maxWidth: '920px' }}>{text}</div>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: accentColor, marginTop: '40px' }} />
            </div>
          </div>
          {showCollection && <div style={{ position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' }}>{collection}</div>}
          <div style={{ position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' }}>{slide !== '5' ? 'swipe →' : '@uninspiredcollective'}</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' }} />
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts: [
          { name: 'BebasNeue', data: bebasData, style: 'normal' },
          { name: 'SpaceMono', data: spaceMonoData, style: 'normal' },
          { name: 'Inter', data: interData, style: 'normal' },
        ],
      }
    );
  }

  // CAROUSEL: BODY
  if (type === 'body') {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
          <div style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' }}>UNINSPIRED</div>
          <div style={{ position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' }}>{slide} / 5</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '240px 80px 200px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '60px', height: '3px', background: accentColor, marginBottom: '60px' }} />
              <div style={{ fontFamily: 'Inter', fontSize: '52px', fontWeight: 300, lineHeight: 1.5, color: '#D0D0D0', maxWidth: '920px' }}>{text}</div>
            </div>
          </div>
          {showCollection && <div style={{ position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' }}>{collection}</div>}
          <div style={{ position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' }}>{slide !== '5' ? 'swipe →' : '@uninspiredcollective'}</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' }} />
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts: [
          { name: 'BebasNeue', data: bebasData, style: 'normal' },
          { name: 'SpaceMono', data: spaceMonoData, style: 'normal' },
          { name: 'Inter', data: interData, style: 'normal' },
        ],
      }
    );
  }

  // CAROUSEL: CLOSE
  if (type === 'close') {
    const showDesign = design && design.toLowerCase() !== 'general';
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
          <div style={{ position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' }}>UNINSPIRED</div>
          <div style={{ position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' }}>{slide} / 5</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 100px' }}>
            {showDesign && <div style={{ fontFamily: 'BebasNeue', fontSize: '140px', lineHeight: 1, letterSpacing: '4px', color: accentColor, textTransform: 'uppercase', marginBottom: '40px' }}>{design}</div>}
            <div style={{ width: '80px', height: '2px', background: '#333', margin: '40px 0' }} />
            <div style={{ fontFamily: 'Inter', fontSize: '48px', fontWeight: 300, lineHeight: 1.5, color: '#888', fontStyle: 'italic', textAlign: 'center', maxWidth: '800px' }}>{text}</div>
          </div>
          {showCollection && <div style={{ position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' }}>{collection}</div>}
          <div style={{ position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' }}>@uninspiredcollective</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' }} />
        </div>
      ),
      {
        width: 1080,
        height: 1920,
        fonts: [
          { name: 'BebasNeue', data: bebasData, style: 'normal' },
          { name: 'SpaceMono', data: spaceMonoData, style: 'normal' },
          { name: 'Inter', data: interData, style: 'normal' },
        ],
      }
    );
  }

  return new Response('Unknown type. Use: textpost, hook, body, close', { status: 400 });
}
