import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Construct the absolute file path
        file_path = "file://" + os.path.abspath("index.html")

        await page.goto(file_path)

        # Navigate to the Price List section
        await page.click("#price-list-card")
        await page.wait_for_selector("#price-list-section", state="visible")

        # Add a coffee row to make the bean type dropdown visible
        await page.click("#add-coffee-row-btn")

        # Select an option in the dropdown to trigger the modal
        await page.select_option("#coffee-list-container .price-list-dynamic-row select", "ethiopia-sidamo")

        # Wait for the modal to appear
        await page.wait_for_selector("#roast-modal", state="visible")

        # Take a screenshot to verify the modal's position
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

asyncio.run(main())
