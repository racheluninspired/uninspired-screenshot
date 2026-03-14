import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const h = (tag, props, ...children) => ({ type: tag, props: { ...props, children: children.length > 1 ? children : children[0] } });

const bebasFont = fetch('https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2').then(r => r.arrayBuffer());
const spaceMonoFont = fetch('https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2').then(r => r.arrayBuffer());
const interFont = fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2').then(r => r.arrayBuffer());

const fonts = async () => {
  const [b, s, i] = await Promise.all([bebasFont, spaceMonoFont, interFont]);
  return [
    { name: 'BebasNeue', data: b, style: 'normal' },
    { name: 'SpaceMono', data: s, style: 'normal' },
    { name: 'Inter', data: i, style: 'normal' },
  ];
};

export default async function handler(req) {
  const f = await fonts();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'hook';
  const text = searchParams.get('text') || 'nobody asks how the strong one is doing.';
  const slide = searchParams.get('slide') || '1';
  const collection = searchParams.get('collection') || '';
  const design = searchParams.get('design') || '';
  const accent = searchParams.get('accent') || 'green';

  const ac = accent === 'orange' ? '#FF6B35' : '#D4FF00';
  const showColl = collection && collection.toLowerCase() !== 'general';
  const opt = { width: 1080, height: 1920, fonts: f };

  if (type === 'textpost' && text.length <= 50) {
    return new ImageResponse(
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' } },
        h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ac } }),
        h('div', { style: { position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#1a1a1a', textTransform: 'uppercase' } }, 'UNINSPIRED'),
        h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', padding: '200px 80px' } },
          h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('div', { style: { fontFamily: 'BebasNeue', fontSize: '130px', lineHeight: 1.05, letterSpacing: '2px', color: '#fff', textTransform: 'lowercase' } }, text),
            h('div', { style: { width: '400px', height: '4px', marginTop: '50px', background: ac } })
          )
        ),
        h('div', { style: { position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '16px', color: '#1a1a1a' } }, '@uninspiredcollective'),
        h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' } })
      ), opt
    );
  }

  if (type === 'textpost') {
    return new ImageResponse(
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative', alignItems: 'center', justifyContent: 'center' } },
        h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ac } }),
        h('div', { style: { position: 'absolute', top: '60px', display: 'flex', justifyContent: 'center', width: '100%', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#1a1a1a', textTransform: 'uppercase' } }, 'UNINSPIRED'),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 100px', maxWidth: '840px' } },
          h('div', { style: { fontFamily: 'BebasNeue', fontSize: '180px', lineHeight: 0.6, color: ac, marginBottom: '40px' } }, '"'),
          h('div', { style: { fontFamily: 'Inter', fontSize: '54px', fontWeight: 300, lineHeight: 1.55, color: '#E0E0E0', textAlign: 'center' } }, text),
          h('div', { style: { width: '80px', height: '2px', background: '#222', margin: '50px 0' } }),
          showColl ? h('div', { style: { fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '5px', color: '#222', textTransform: 'uppercase' } }, collection) : null
        ),
        h('div', { style: { position: 'absolute', bottom: '80px', display: 'flex', justifyContent: 'center', width: '100%', fontFamily: 'Inter', fontSize: '16px', color: '#1a1a1a' } }, '@uninspiredcollective'),
        h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' } })
      ), opt
    );
  }

  if (type === 'hook') {
    return new ImageResponse(
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' } },
        h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ac } }),
        h('div', { style: { position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' } }, 'UNINSPIRED'),
        h('div', { style: { position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' } }, slide + ' / 5'),
        h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', padding: '200px 80px' } },
          h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('div', { style: { fontFamily: 'BebasNeue', fontSize: '120px', lineHeight: 1.05, letterSpacing: '2px', color: '#fff', textTransform: 'lowercase', maxWidth: '920px' } }, text),
            h('div', { style: { width: '16px', height: '16px', borderRadius: '50%', background: ac, marginTop: '40px' } })
          )
        ),
        showColl ? h('div', { style: { position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' } }, collection) : null,
        h('div', { style: { position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' } }, slide !== '5' ? 'swipe →' : '@uninspiredcollective'),
        h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' } })
      ), opt
    );
  }

  if (type === 'body') {
    return new ImageResponse(
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative' } },
        h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ac } }),
        h('div', { style: { position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' } }, 'UNINSPIRED'),
        h('div', { style: { position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' } }, slide + ' / 5'),
        h('div', { style: { display: 'flex', flex: 1, alignItems: 'center', padding: '240px 80px 200px' } },
          h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('div', { style: { width: '60px', height: '3px', background: ac, marginBottom: '60px' } }),
            h('div', { style: { fontFamily: 'Inter', fontSize: '52px', fontWeight: 300, lineHeight: 1.5, color: '#D0D0D0', maxWidth: '920px' } }, text)
          )
        ),
        showColl ? h('div', { style: { position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' } }, collection) : null,
        h('div', { style: { position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' } }, slide !== '5' ? 'swipe →' : '@uninspiredcollective'),
        h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' } })
      ), opt
    );
  }

  if (type === 'close') {
    const showDesign = design && design.toLowerCase() !== 'general';
    return new ImageResponse(
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#000', position: 'relative', alignItems: 'center', justifyContent: 'center' } },
        h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ac } }),
        h('div', { style: { position: 'absolute', top: '60px', left: '80px', fontFamily: 'SpaceMono', fontSize: '22px', fontWeight: 700, letterSpacing: '6px', color: '#333', textTransform: 'uppercase' } }, 'UNINSPIRED'),
        h('div', { style: { position: 'absolute', top: '60px', right: '80px', fontFamily: 'SpaceMono', fontSize: '18px', color: '#222', letterSpacing: '2px' } }, slide + ' / 5'),
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 100px' } },
          showDesign ? h('div', { style: { fontFamily: 'BebasNeue', fontSize: '140px', lineHeight: 1, letterSpacing: '4px', color: ac, textTransform: 'uppercase', marginBottom: '40px' } }, design) : null,
          h('div', { style: { width: '80px', height: '2px', background: '#333', margin: '40px 0' } }),
          h('div', { style: { fontFamily: 'Inter', fontSize: '48px', fontWeight: 300, lineHeight: 1.5, color: '#888', fontStyle: 'italic', textAlign: 'center', maxWidth: '800px' } }, text)
        ),
        showColl ? h('div', { style: { position: 'absolute', bottom: '80px', left: '80px', fontFamily: 'SpaceMono', fontSize: '14px', letterSpacing: '4px', color: '#222', textTransform: 'uppercase' } }, collection) : null,
        h('div', { style: { position: 'absolute', bottom: '80px', right: '80px', fontFamily: 'Inter', fontSize: '14px', color: '#333' } }, '@uninspiredcollective'),
        h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#111' } })
      ), opt
    );
  }

  return new Response('Unknown type. Use: textpost, hook, body, close', { status: 400 });
}
