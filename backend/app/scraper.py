from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from config import Config
import logging
import os


class BrowserFactory:
    @staticmethod
    def create_driver(browser_type):
        try:
            os.environ["WDM_LOG"] = Config.WDM_LOG_LEVEL
            os.environ["WDM_LOCAL"] = str(int(Config.WDM_LOCAL))
            os.environ["WDM_SSL_VERIFY"] = str(int(Config.WDM_SSL_VERIFY))
            os.environ["WDM_CACHE_DIR"] = Config.DRIVER_CACHE_PATH

            common_arguments = [
                "--headless=new",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-extensions",
                "--disable-software-rasterizer",
                "--ignore-certificate-errors"
            ]

            if browser_type == "chrome":
                options = ChromeOptions()
                for arg in common_arguments:
                    options.add_argument(arg)
                options.add_argument("--remote-debugging-port=9222")
                options.add_argument("--blink-settings=imagesEnabled=false")

                if Config.IS_PRODUCTION:
                    options.binary_location = Config.CHROME_BINARY_PATH

                service = ChromeService(ChromeDriverManager().install())
                return webdriver.Chrome(service=service, options=options)

            elif browser_type == "firefox":
                options = FirefoxOptions()
                for arg in common_arguments:
                    options.add_argument(arg)

                if Config.IS_PRODUCTION:
                    options.binary_location = Config.FIREFOX_BINARY_PATH

                service = FirefoxService(GeckoDriverManager().install())
                return webdriver.Firefox(service=service, options=options)

            elif browser_type == "edge":
                options = EdgeOptions()
                for arg in common_arguments:
                    options.add_argument(arg)

                if Config.IS_PRODUCTION:
                    options.binary_location = Config.EDGE_BINARY_PATH

                service = EdgeService(EdgeChromiumDriverManager().install())
                return webdriver.Edge(service=service, options=options)

            else:
                raise ValueError(f"Unsupported browser type: {browser_type}")

        except Exception as e:
            logging.error(f"Failed to create {browser_type} driver: {str(e)}")
            raise


class UAFScraper:
    def __init__(self):
        self.browser_type = Config.BROWSER_TYPE

    def get_result_html(self, reg_number):
        driver = None
        try:
            driver = BrowserFactory.create_driver(self.browser_type)
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
