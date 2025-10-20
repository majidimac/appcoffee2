
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set dark theme
  await page.emulateMedia({ colorScheme: 'dark' });

  await page.goto('http://localhost:8080');

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'dark_theme_verification.png', fullPage: true });

  await browser.close();
})();
