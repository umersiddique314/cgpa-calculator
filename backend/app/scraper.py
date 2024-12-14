from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

class UAFScraper:
    def __init__(self):
        self.service = Service(ChromeDriverManager().install())
        self.chrome_options = Options()
        self.chrome_options.add_argument('--headless')
        self.chrome_options.add_argument('--disable-gpu')
        self.chrome_options.add_argument('--no-sandbox')
        self.chrome_options.add_argument('--disable-dev-shm-usage')
    
    def get_result_html(self, reg_number):
        driver = webdriver.Chrome(
            service=self.service,
            options=self.chrome_options
        )
        try:
            driver.get("http://lms.uaf.edu.pk/login/index.php")
            
            reg_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "REG"))
            )
            reg_input.send_keys(reg_number)
            
            submit_button = driver.find_element(By.XPATH, "//input[@type='submit'][@value='Result']")
            submit_button.click()
            
            WebDriverWait(driver, 10).until(
                EC.url_contains("uaf_student_result.php")
            )
            
            return driver.page_source
            
        finally:
            driver.quit()
