import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:3002';
const OUT = '/Users/owner/Desktop/Website Building/temporary screenshots';

const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });

// Force all reveal elements visible
await page.evaluate(() => {
  document.querySelectorAll('.rev,.rev-left,.rev-right').forEach(el => el.classList.add('on'));
});
await new Promise(r => setTimeout(r, 400));

const sections = [
  { id: 'hero',      label: 'hero' },
  { id: 'services',  label: 'services' },
  { id: 'why',       label: 'why' },
  { id: 'process',   label: 'process' },
  { id: 'flakes',    label: 'flakes' },
  { id: 'gallery',   label: 'gallery' },
  { id: 'reviews',   label: 'reviews' },
  { id: 'locations', label: 'locations' },
  { id: 'faq',       label: 'faq' },
  { id: 'contact',   label: 'contact' },
];

// Find next screenshot number
const files = fs.readdirSync(OUT);
const nums = files.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1]||0)).filter(Boolean);
let n = (Math.max(0,...nums)) + 1;

for (const s of sections) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }, s.id);
  await new Promise(r => setTimeout(r, 300));
  const fp = path.join(OUT, `screenshot-${n++}-${s.label}.png`);
  await page.screenshot({ path: fp, fullPage: false });
  console.log('Saved:', fp);
}

await browser.close();
