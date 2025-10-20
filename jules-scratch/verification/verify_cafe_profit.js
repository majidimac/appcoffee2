const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Construct the correct path to the HTML file from the project root
  const filePath = path.join(process.cwd(), 'index.html');

  // Load the local HTML file
  await page.goto(`file://${filePath}`);

  // Navigate to the cafe revenue section
  await page.click('#cafe-card');

  // Fill in the input fields with sample data
  await page.fill('#costPerKG', '150000');
  await page.fill('#costSingleShot', '5000');
  await page.fill('#salesSingle', '20');

  // Click the calculate button
  await page.click('#calculate-cafe-btn');

  // Wait for the results to appear
  await page.waitForSelector('#cafe-results p');

  // Take a screenshot of the results section
  await page.screenshot({ path: 'jules-scratch/verification/cafe_profit_verification.png', fullPage: true });

  await browser.close();
})();
