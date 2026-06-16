#!/usr/bin/env node
// Usage: NODE_PATH=$(npm root -g) node driver.mjs [screenshot|check] [output.png]
// Serves the site locally and drives it via puppeteer.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = resolve(fileURLToPath(import.meta.url), '../../../../');
const PORT = 18080;

const [,, cmd = 'screenshot', outFile = resolve(ROOT, 'screenshot.png')] = process.argv;

const server = createServer((req, res) => {
  try {
    const path = join(ROOT, req.url === '/' ? 'index.html' : req.url);
    const body = readFileSync(path);
    res.writeHead(200);
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise(r => server.listen(PORT, r));

const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });

if (cmd === 'screenshot') {
  await page.screenshot({ path: outFile, fullPage: false });
  console.log(`screenshot saved → ${outFile}`);
} else if (cmd === 'check') {
  const title = await page.title();
  const hero = await page.evaluate(() => document.querySelector('h1')?.textContent.trim());
  console.log(`title: ${title}`);
  console.log(`hero h1: ${hero}`);
}

await browser.close();
server.close();
