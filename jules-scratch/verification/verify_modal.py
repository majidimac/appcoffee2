
import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the HTML file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        page.goto(f'file://{file_path}')

        # Click on the "Price List" card
        page.click('#price-list-card')

        # Click the "Add Coffee Row" button to ensure a fresh row
        page.click('#add-coffee-row-btn')

        # Select a coffee type to trigger the modal
        # We'll select the last coffee row created
        coffee_rows = page.locator('#coffee-list-container .price-list-dynamic-row')
        last_row = coffee_rows.last
        last_row.locator('select').select_option('برزیل')

        # Wait for the modal to be visible
        modal = page.locator('#roast-modal')
        expect(modal).to_be_visible()

        # Fill in the modal
        page.select_option('#modal-roast-type', 'شکلاتی')
        page.fill('#modal-purchase-price', '600000')
        page.fill('#modal-profit-percent', '50')

        # Click the confirm button
        page.click('#modal-confirm-btn')

        # Wait for the modal to be hidden
        expect(modal).to_be_hidden()

        # Take a screenshot
        page.screenshot(path='jules-scratch/verification/verification.png')

        browser.close()

if __name__ == "__main__":
    run_verification()
