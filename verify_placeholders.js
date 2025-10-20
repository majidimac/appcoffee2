
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to the page...');
    await page.goto('http://127.0.0.1:8080');

    // --- Verify Price List Placeholders ---
    console.log('Navigating to the Price List section...');
    await page.click('#price-list-card');
    await page.waitForSelector('#price-list-section', { state: 'visible' });
    console.log('Taking screenshot of Price List section...');
    await page.screenshot({ path: 'price_list_placeholder_verification.png' });

    // --- Verify Bean Mix Placeholders ---
    console.log('Navigating back to the main menu...');
    await page.click('#price-list-section .back-button'); // More specific selector
    await page.waitForSelector('#main-menu', { state: 'visible' });

    console.log('Navigating to the Bean Mix section...');
    await page.click('#mix-card');
    await page.waitForSelector('#mix-section', { state: 'visible' });
    console.log('Taking screenshot of Bean Mix section...');
    await page.screenshot({ path: 'bean_mix_placeholder_verification.png' });

    console.log('Verification screenshots saved successfully.');

  } catch (error) {
    console.error('An error occurred during verification:', error);
  } finally {
    console.log('Closing the browser.');
    await browser.close();
  }
})();
