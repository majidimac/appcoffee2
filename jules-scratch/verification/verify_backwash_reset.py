from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct the file path
        # The working directory is the root of the repo
        file_path = "file://" + os.path.abspath("index.html")

        page.goto(file_path)

        # Navigate to the backwash section
        page.click("#bakwash-card")

        # Start the 10-second cycle
        page.click("#backwash-start10")

        # Wait a moment to ensure the timer is running
        page.wait_for_timeout(2000)

        # Click the reset button
        page.click("#backwash-reset")

        # Take a screenshot to verify the reset state
        page.screenshot(path="jules-scratch/verification/backwash_reset_verification.png")

        browser.close()

if __name__ == "__main__":
    run()
