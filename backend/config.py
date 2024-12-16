import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    CACHE_TIMEOUT = int(os.getenv('CACHE_TIMEOUT', 3600))
    SCRAPER_TIMEOUT = int(os.getenv('SCRAPER_TIMEOUT', 20))
    CHROME_TIMEOUT = int(os.getenv('CHROME_TIMEOUT', 10))
    CHROME_BINARY_PATH = os.getenv('CHROME_BINARY_PATH', '/usr/bin/google-chrome')
    CHROMEDRIVER_PATH = os.getenv('CHROMEDRIVER_PATH', '/usr/local/bin/chromedriver')
    IS_PRODUCTION = os.getenv('ENVIRONMENT', 'development').lower() == 'production'
    BROWSER_TYPE = os.getenv('BROWSER_TYPE', 'chrome').lower()  # chrome, firefox, or edge
    FIREFOX_BINARY_PATH = os.getenv('FIREFOX_BINARY_PATH', '/usr/bin/firefox')
    EDGE_BINARY_PATH = os.getenv('EDGE_BINARY_PATH', '/usr/bin/microsoft-edge')
    
    # Browser Configuration
    BROWSER_TYPE = os.getenv('BROWSER_TYPE', 'chrome').lower()
    DRIVER_CACHE_PATH = os.getenv('DRIVER_CACHE_PATH', '/tmp/webdriver')
    
    # Browser Binary Paths
    CHROME_BINARY_PATH = os.getenv('CHROME_BINARY_PATH', '/usr/bin/google-chrome')
    FIREFOX_BINARY_PATH = os.getenv('FIREFOX_BINARY_PATH', '/usr/bin/firefox')
    EDGE_BINARY_PATH = os.getenv('EDGE_BINARY_PATH', '/usr/bin/microsoft-edge')
    
    # WebDriver Manager Settings
    WDM_LOG_LEVEL = os.getenv('WDM_LOG_LEVEL', 'INFO')
    WDM_SSL_VERIFY = os.getenv('WDM_SSL_VERIFY', '1') == '1'
    WDM_LOCAL = os.getenv('WDM_LOCAL', '1') == '1'
