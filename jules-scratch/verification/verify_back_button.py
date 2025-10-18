from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Construct the absolute file path
        file_path = "file://" + os.path.abspath("index.html")
        page.goto(file_path)

        # Click the roast calculator card
        page.click("#roast-card")

        # Take a screenshot of the calculator section
        page.screenshot(path="jules-scratch/verification/back-button-verification.png")

        browser.close()

if __name__ == "__main__":
    run()
