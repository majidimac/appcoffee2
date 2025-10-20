
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set dark theme
  await page.emulateMedia({ colorScheme: 'dark' });

  await page.goto('http://localhost:8000');

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Click on the roast card to navigate to the calculator section
  await page.click('#roast-card');

  // Wait for the navigation to complete
  await page.waitForSelector('#calculator-section', { state: 'visible' });

  await page.screenshot({ path: 'back_button_verification.png', fullPage: true });

  await browser.close();
})();
