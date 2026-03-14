import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#D4FF00', fontSize: '80px' }}>UNINSPIRED TEST</div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
