export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', background: '#0d0d0d', color: '#f7efdd', minHeight: '100vh' }}>
      <h1 style={{ color: '#D4FF00', fontSize: '32px', marginBottom: '24px' }}>UNINSPIRED Screenshot API · v2</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>Two routes available:</p>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#ff4c0a', fontSize: '20px', marginBottom: '8px' }}>/api/screenshot</h2>
        <p style={{ color: '#aaa', fontSize: '14px' }}>Satori-rendered slides. Types: textpost, hook, body, body-cream, break-code, close.</p>
        <code style={{ color: '#D4FF00', fontSize: '12px', display: 'block', marginTop: '8px' }}>
          /api/screenshot?type=hook&text=said+i%27m+fine&textstyle=pill&image=...
        </code>
      </div>

      <div>
        <h2 style={{ color: '#ff4c0a', fontSize: '20px', marginBottom: '8px' }}>/api/render-full</h2>
        <p style={{ color: '#aaa', fontSize: '14px' }}>Puppeteer-rendered full-fidelity templates. Formats: notes-diary, text-thread, search-bar, receipt.</p>
        <code style={{ color: '#D4FF00', fontSize: '12px', display: 'block', marginTop: '8px' }}>
          /api/render-full?format=notes-diary&date=...&lines=[...]
        </code>
      </div>

      <p style={{ color: '#666', fontSize: '12px', marginTop: '40px' }}>Append <code>?test=1&format=...</code> for sample renders. <code>?debug=1</code> returns generated HTML.</p>
    </div>
  );
}
