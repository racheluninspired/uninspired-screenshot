const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing ?url= parameter" });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1080, height: 1920 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

    // Wait for Google Fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Extra beat for rendering
    await new Promise((r) => setTimeout(r, 1500));

    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(screenshot);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
};
