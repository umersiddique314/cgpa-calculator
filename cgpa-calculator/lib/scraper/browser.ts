import puppeteer, { Browser, Page } from 'puppeteer';
import { CONFIG } from './config';

export class BrowserManager {
  private static browser: Browser | null = null;

  static async getInstance(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
    }
    return this.browser;
  }

  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  static async newPage(): Promise<Page> {
    const browser = await this.getInstance();
    const page = await browser.newPage();
    await page.setDefaultTimeout(CONFIG.CHROME_TIMEOUT);
    return page;
  }
}
