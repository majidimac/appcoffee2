const { chromium } = require('playwright');
const path = require('path');

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Construct the absolute file path
    const filePath = path.resolve(__dirname, '..', '..', 'index.html');
    const fileUrl = `file://${filePath}`;

    await page.goto(fileUrl);
    console.log('Navigated to index.html');

    // Go to Price List section
    await page.click('#price-list-card');
    console.log('Clicked on Price List card');
    await page.waitForSelector('#price-list-section', { state: 'visible' });
    console.log('Price List section is visible');

    // --- Verify Coffee Search ---
    const coffeeSearchInput = page.locator('#coffee-search');
    await coffeeSearchInput.fill('برزیل');
    console.log('Typed "برزیل" into coffee search');

    // Wait for any potential DOM updates
    await page.waitForTimeout(500);

    // Take screenshot of the filtered coffee dropdown
    await page.screenshot({ path: 'jules-scratch/verification/coffee_search_filter_verification.png' });
    console.log('Screenshot taken for coffee search filter');

    // --- Verify Powder Search ---
    const powderSearchInput = page.locator('#powder-search');
    await powderSearchInput.fill('گلد');
    console.log('Typed "گلد" into powder search');

    // Wait for any potential DOM updates
    await page.waitForTimeout(500);

    // Take screenshot of the filtered powder dropdown
    await page.screenshot({ path: 'jules-scratch/verification/powder_search_filter_verification.png' });
    console.log('Screenshot taken for powder search filter');

    console.log('Verification script completed successfully.');

  } catch (error) {
    console.error('An error occurred during verification:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
