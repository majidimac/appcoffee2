from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct the absolute file path
        file_path = "file://" + os.path.abspath("index.html")

        page.goto(file_path)
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()
