from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from config import Config
import logging
import os


class UAFScraper:
    def __init__(self):
        try:
            if Config.IS_PRODUCTION:
                self.service = Service(Config.CHROMEDRIVER_PATH)
            else:
                self.service = Service(ChromeDriverManager().install())

            self.chrome_options = Options()
            self.chrome_options.add_argument("--headless")
            self.chrome_options.add_argument("--disable-gpu")
            self.chrome_options.add_argument("--no-sandbox")
            self.chrome_options.add_argument("--disable-dev-shm-usage")
            self.chrome_options.add_argument("--disable-extensions")
            self.chrome_options.add_argument("--dns-prefetch-disable")
            self.chrome_options.add_argument("--blink-settings=imagesEnabled=false")
            
            if Config.IS_PRODUCTION:
                self.chrome_options.binary_location = Config.CHROME_BINARY_PATH
            
            self.chrome_options.page_load_strategy = "eager"
        except Exception as e:
            logging.error(f"Failed to initialize Chrome options: {str(e)}")
            raise

    def get_result_html(self, reg_number):
        driver = None
        try:
            driver = webdriver.Chrome(service=self.service, options=self.chrome_options)
            driver.set_page_load_timeout(Config.CHROME_TIMEOUT)
            driver.set_script_timeout(Config.CHROME_TIMEOUT)

            driver.get("http://lms.uaf.edu.pk/login/index.php")

            reg_input = WebDriverWait(driver, Config.CHROME_TIMEOUT).until(
                EC.presence_of_element_located((By.ID, "REG"))
            )
            reg_input.send_keys(reg_number)

            submit_button = driver.find_element(
                By.XPATH, "//input[@type='submit'][@value='Result']"
            )
            submit_button.click()

            return driver.page_source

        except Exception as e:
            logging.error(f"Scraping error: {str(e)}")
            raise
        finally:
            if driver:
                driver.quit()
