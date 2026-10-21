import { chromium } from 'playwright';
import fs from 'node:fs';

const sites = [
  'car-battery.ru','wheelshops.ru','salesrate.ru','frimis.ru',
  'nanikaofficial.com','taipit-mebel.ru','dance.ru','stilfort.com','kvartiry.kssk.ru'
];

fs.mkdirSync('images/cases', { recursive: true });
const browser = await chromium.launch();

for (const host of sites) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(`https://${host}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `images/cases/${host.split('.')[0]}.jpg`, type: 'jpeg', quality: 82 });
    console.log('ok  ', host);
  } catch (e) {
    console.log('FAIL', host, '-', e.message);
  }
  await page.close();
}
await browser.close();
