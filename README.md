# UNINSPIRED Screenshot API · v2

Full replacement for the v1 `uninspired-screenshot` Vercel project. Two render routes:

- **`/api/screenshot`** — fast Satori (next/og) renders. Existing types (`textpost`, `hook`, `body`, `close`) plus new types (`body-cream`, `break-code`) and new params (`textstyle=pill` on hook, `bg=orange|lime|cream|black` on close).
- **`/api/render-full`** — Puppeteer + Chromium renders for UI-mimicry formats (`notes-diary`, `text-thread`, `search-bar`, `receipt`) at full HTML/CSS fidelity.

n8n routes by `Video Type` to whichever endpoint a given format needs.

---

## Migrating from v1 to v2

1. **Don't delete the old repo until v2 is deployed and verified.** If anything breaks, you can swap your Vercel project's root back to v1 in two clicks.
2. Push this entire `uninspired-screenshot-v2/` folder to a new GitHub repo (or replace the contents of your existing one — your call).
3. Connect to Vercel. Vercel auto-detects Next.js 15 + React 19. First build will install `@sparticuz/chromium` and `puppeteer-core` (~200 MB) on top of the existing deps.
4. After deploy, hit each test URL in the **Verification checklist** below.
5. Once all six render correctly, update n8n's Generate Slide URLs node to point at the new Vercel URL (or just keep the same URL — Vercel handles it).

Existing n8n calls to `/api/screenshot?type=hook&...` keep working unchanged. Only ADDITIONS — no breaking changes to existing types.

---

## File structure

```
uninspired-screenshot-v2/
├── README.md                                  ← this file
├── package.json                               ← deps including puppeteer-core, @sparticuz/chromium
├── next.config.js                             ← serverComponentsExternalPackages config
├── vercel.json                                ← function memory + duration per route
├── .gitignore
└── app/
    ├── layout.jsx
    ├── page.jsx                               ← landing page (status check)
    └── api/
        ├── screenshot/
        │   └── route.jsx                      ← Satori route (existing types + new ones)
        └── render-full/
            ├── route.jsx                      ← Puppeteer dispatcher
            └── templates/
                ├── notes-diary.js             ← cream Notes-app paper
                ├── text-thread.js             ← iMessage gray/blue bubbles
                ├── search-bar.js              ← Google search + autocomplete
                └── receipt.js                 ← cream perforated receipt
```

---

## Verification checklist (run after deploy)

Open each URL in a browser. Each should return a 1080×1920 image.

```
# Existing (Satori) — should match what v1 returned
https://YOUR-VERCEL-URL/api/screenshot?type=textpost&text=for+the+ones+who+get+it
https://YOUR-VERCEL-URL/api/screenshot?type=hook&text=said+i%27m+fine&slide=1&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=body&text=said+yes+when+i+meant+no&slide=2&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=close&design=STILL+LOADING&text=for+the+ones+who+get+it&accent=green

# NEW Satori variants
https://YOUR-VERCEL-URL/api/screenshot?type=hook&textstyle=pill&text=said+i%27m+fine|wasn%27t&slide=1&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=body-cream&text=said+yes.+meant+no.&tagline=FOR+THE+ONES+WHO&design=said+%22i%27m+fine.%22+weren%27t.&slide=3&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=break-code&design=STILL+LOADING&tagline=for+the+ones+who+read+this+twice&accent=lime&slide=4&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=close&bg=orange&design=STILL+LOADING&text=scan+the+cuff.+find+the+rest.&slide=5&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=close&bg=lime&design=STILL+LOADING&slide=5&total=5
https://YOUR-VERCEL-URL/api/screenshot?type=close&bg=cream&design=STILL+LOADING&slide=5&total=5

# Render-full (Puppeteer) — sample renders for each format
https://YOUR-VERCEL-URL/api/render-full?test=1&format=notes-diary
https://YOUR-VERCEL-URL/api/render-full?test=1&format=text-thread
https://YOUR-VERCEL-URL/api/render-full?test=1&format=search-bar
https://YOUR-VERCEL-URL/api/render-full?test=1&format=receipt
```

If any fail, append `&debug=1` to that URL — for `/api/screenshot` it returns font-load diagnostics, for `/api/render-full` it returns the raw HTML the route would have rendered.

---

## `/api/screenshot` — URL parameter reference

### Common params (all types)

| Param | Type | Default | Description |
|---|---|---|---|
| `type` | string | `textpost` | One of: `textpost`, `hook`, `body`, `body-cream`, `break-code`, `close` |
| `text` | string | — | Main text content for the slide |
| `slide` | string | — | Slide number (e.g., `02`); pads to two digits |
| `total` | string | `5` | Total slides in the carousel (e.g., `06`) |
| `design` | string | — | Design name (used by `break-code`, `close`, `body-cream`) |
| `accent` | string | `green` | `green` (= lime `#D4FF00`) or `orange` (`#FF6B35`) |
| `image` | URL | — | Background image (for image-bg types: `hook`, `body`, `textpost` if you want one) |
| `overlay` | bool | `true` | Dark overlay on the image (set `false` to keep image bright) |
| `tagline` | string | — | Small mono-uppercase eyebrow text (used by `body-cream`, `break-code`) |
| `url` | string | `UNINSPIREDCOLLECTIVE.COM` | URL line for `close` |

### Type-specific params

**`type=textpost`** — single static post. Auto-switches between short (≤50 chars) and long (>50 chars) layouts.

**`type=hook`** — slide 1 of a carousel. Default style is large lowercase Koulen on the image. Pass `textstyle=pill` (or `textstyle=native`) to render as TikTok-native white-pill text instead. For pill style, separate lines with `|` or `\n` in the text param.

```
?type=hook&textstyle=pill&text=said+i%27m+fine|wasn%27t&image=...
```

**`type=body`** — slides 2–4 of a carousel. Image-bg with body copy + small accent bar.

**`type=body-cream`** — cream background interrupt slide. Uses `tagline` (eyebrow), `text` (Koulen headline), `design` (Aleo italic body — yes, it's used for body copy here, not a design name).

```
?type=body-cream&tagline=FOR+THE+ONES+WHO&text=said+yes.+meant+no.&design=said+%22i%27m+fine.%22+weren%27t.
```

**`type=break-code`** — design moment slide. Black bg with barcode-pattern texture and huge accent-colored design name. Uses `design` (the big name) and `tagline` (small mono caption beneath).

```
?type=break-code&design=STILL+LOADING&tagline=for+the+ones+who+read+this+twice&accent=lime
```

**`type=close`** — CTA / closing slide. Default `bg=black` with accent design. Pass `bg=orange|lime|cream|black` to swap background. Uses `design` (the big name), `text` (italic body line above the URL), `url` (the URL line).

```
?type=close&bg=orange&design=STILL+LOADING&text=scan+the+cuff.+find+the+rest.&url=UNINSPIREDCOLLECTIVE.COM
```

---

## `/api/render-full` — URL parameter reference

Each format takes a `format` param plus its own data params. All data params that are arrays/objects are JSON-encoded then URL-encoded.

### `format=notes-diary`

| Param | Type | Description |
|---|---|---|
| `date` | string | Header date, e.g., `tuesday · 2:47am` |
| `lines` | JSON array | Each item `{ text, style }`; `style` ∈ `"normal"`, `"dim"`, `"indent"`, `"dim indent"` |
| `slide`, `total` | string | Slide number / total |

### `format=text-thread`

| Param | Type | Description |
|---|---|---|
| `contact` | string | Contact name in the nav header. Use `— · — · —` for anonymous, e.g. `DAD` for the reveal |
| `timestamp` | string | Day + time, e.g. `Today  9:14 PM` |
| `bubbles` | JSON array | Each `{ role: "gray"\|"blue", text, gap?: true }` |
| `slide`, `total` | string | Slide number / total |

### `format=search-bar`

| Param | Type | Description |
|---|---|---|
| `query` | string | Text in the search bar |
| `showLogo` | bool | Show Google logo above bar (default `true`) |
| `showCursor` | bool | Blinking cursor in the bar (default `true`) |
| `autocomplete` | JSON array | Each `{ typed, completion, dim?: false }` |
| `resultLink`, `resultTitle`, `resultSnippet` | string | For slide-4 search-result block |
| `slide`, `total` | string | Slide number / total |

### `format=receipt`

| Param | Type | Description |
|---|---|---|
| `header` | string | Top header (e.g., `— ITEMIZED —`) |
| `sub` | string | Sub-header smaller line |
| `lines` | JSON array | Each `{ qty, item, price, bold?: false }` |
| `total` | JSON object | `{ item, price }` for total block |
| `footer` | string | Footer caption |
| `stamp` | string | Diagonal stamp (use `\n` for line break) |
| `slideNum`, `totalSlides` | string | Slide number / total |

---

## n8n integration — what changes

In your existing `Generate Slide URLs` code node, branch by `Video Type` to choose the right route:

```js
const SCREENSHOT_BASE = 'https://YOUR-VERCEL-URL/api/screenshot';
const RENDER_FULL_BASE = 'https://YOUR-VERCEL-URL/api/render-full';

const RENDER_FULL_FORMATS = {
  'Carousel — Notes Diary':         'notes-diary',
  'Carousel — Text Thread':         'text-thread',
  'Carousel — Search & Autocomplete': 'search-bar',
  'Carousel — Receipt':             'receipt',
};

const videoType = item['Video Type'];

if (RENDER_FULL_FORMATS[videoType]) {
  const fmt = RENDER_FULL_FORMATS[videoType];
  // build /api/render-full URL with format-specific params
} else {
  // existing /api/screenshot logic with type/text/image params
}
```

The Switch node feeding into this can stay as-is (`Video Type starts with "Carousel"`), or you can add a sub-switch on the format name. Your call.

---

## Cost & performance

| Route | Engine | Cold start | Warm | Memory | Free-tier safe |
|---|---|---|---|---|---|
| `/api/screenshot` | Edge runtime + Satori | ~500 ms | ~200 ms | 128 MB | Yes |
| `/api/render-full` | Node runtime + Puppeteer + Chromium | ~5 s | ~2–3 s | 3 GB | Yes |

Vercel Hobby plan: 100K invocations/mo + 100 GB-hours of execution. Your usage at 4 carousels/week × ~6 slides = ~100 renders/month. Total GB-hours per month: <1. Comfortably free-tier.

24-hour cache on every render output (by URL). Re-fetching the same slide is instant from CDN.

---

## Troubleshooting

**`/api/render-full?test=1` returns 500** — Most likely `@sparticuz/chromium` failed to load. Confirm `vercel.json` has `memory: 3008` for the route. Check Vercel function logs for the specific error.

**Fonts look wrong on a slide** — Both routes wait for fonts before screenshotting, but if a `fonts.googleapis.com` request fails on Vercel for some reason, fall back will hit. Use `?debug=1` on `/api/screenshot` for font-load diagnostics, or `?debug=1&format=...` on `/api/render-full` for the raw HTML.

**The pill-style hook (`textstyle=pill`) is too tall** — Trim text or reduce number of pill lines. Each pill is ~150px tall at 108px font; centered vertically means ~3–4 pills fit comfortably. For more, lower the `text` per-line word count.

**Break-code barcode bg looks too dense / sparse** — Adjust the `Array(140)` count in `route.jsx` (search for `fragments`). The default works for short design names like `STILL LOADING`.

**Old `/api/screenshot` URLs from v1 still work** — Yes. All v1 types (`textpost`, `hook`, `body`, `close`) are preserved unchanged. v2 only adds.

---

## What's next after deploy

1. Run the verification checklist above
2. Update Notion's `Video Type` Select with the new options (per the schema we agreed on)
3. Update n8n's Generate Slide URLs code with the branching logic
4. Test one full carousel post end-to-end (Notion → n8n → Vercel → Blotato → TikTok)
5. Build the trend-research agent (the next thing on our list)

The screenshot pipeline is the foundation. Once it's solid, the agent layer is just content planning + status flips into a system that already knows how to render and publish.
