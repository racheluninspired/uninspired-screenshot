# UNINSPIRED Screenshot API — Free Vercel Deploy

Replaces screenshotone.com. Takes a URL, returns a JPG screenshot at 1080x1920.

## Deploy in 3 minutes

### Step 1: Create Vercel account
Go to [vercel.com](https://vercel.com) and sign up free with your GitHub account.

### Step 2: Push to GitHub
Create a new repo called `uninspired-screenshot` and push these 3 files:
```
uninspired-screenshot/
  api/screenshot.js
  package.json
  vercel.json
```

Or use the Vercel CLI:
```bash
npm i -g vercel
cd uninspired-screenshot
vercel
```

### Step 3: Deploy
Vercel auto-deploys from GitHub. You'll get a URL like:
```
https://uninspired-screenshot-xxxxx.vercel.app
```

### Step 4: Test
Open in browser:
```
https://YOUR-VERCEL-URL/api/screenshot?url=https://silver-biscochitos-04a8a5.netlify.app/uninspired-carousel-renderer.html
```

You should see your slide rendered as a JPG image.

### Step 5: Update n8n workflow
In both Code nodes, replace the screenshotone URL pattern:

**Before:**
```
https://api.screenshotone.com/take?access_key=nib977e2hOv8YA&url=${encodeURIComponent(pageUrl)}&viewport_width=1080&viewport_height=1920&device_scale_factor=1&format=jpg&block_ads=true&delay=3&image_quality=100
```

**After:**
```
https://YOUR-VERCEL-URL/api/screenshot?url=${encodeURIComponent(pageUrl)}
```

That's it. Everything else in the workflow stays the same.

## How it works
- Launches headless Chromium on Vercel's serverless infrastructure
- Navigates to your Netlify HTML renderer
- Waits for Google Fonts (Bebas Neue) to load
- Screenshots at 1080x1920
- Returns cached JPG (24-hour cache)
- First request after cold start: ~5 seconds
- Subsequent requests: ~2-3 seconds

## Free tier limits
- 100,000 function invocations/month (you'll use ~150/month for daily posting)
- 100GB bandwidth/month
- You will never hit these limits

## Cost
$0
