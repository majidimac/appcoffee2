from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context(viewport={'width': 400, 'height': 800})
    page = context.new_page()
    page.goto(f'file://{os.getcwd()}/index.html')
    page.click('text="لیست قیمت"')
    page.wait_for_selector('#price-list-section')
    page.screenshot(path='jules-scratch/verification/verification.png')
    browser.close()

import os
with sync_playwright() as playwright:
    run(playwright)
