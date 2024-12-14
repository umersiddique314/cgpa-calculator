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
