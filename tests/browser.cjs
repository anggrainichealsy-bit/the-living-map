// Optional development check; no test dependencies are loaded by the website.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const base = (process.env.BASE_URL || 'http://127.0.0.1:8000/').replace(/\/?$/, '/');
const ids = ['sumatra-utara', 'jawa-barat', 'kalimantan-barat', 'sulawesi-selatan', 'nusa-tenggara-barat', 'papua'];
const answers = [0, 1, 2, 1, 0, 2];
(async () => {
  const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(base);
    assert.equal(await page.locator('.map-scene').count(), 6);
    assert.equal(await page.locator('.geographic-pin').count(), 6);
    assert.equal(await page.locator('.region-card').count(), 6);
    const images = await page.locator('.story-map image').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    assert.equal(new Set(images).size, 6, 'Each scene must have a distinct illustration');
    for (const src of images) {
      const response = await page.request.get(new URL(src, base).href);
      assert.equal(response.status(), 200);
      assert.match(await response.text(), /<svg/);
    }
    // Stored passports from the previous version must remain valid.
    await page.evaluate(() => localStorage.setItem('living-map-passport-v1', '["jawa-barat"]'));
    await page.reload();
    assert.equal(await page.locator('#nav-count').innerText(), '1/6');
    await page.locator('.map-scene').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/#daerah/sumatra-utara');
    await page.evaluate(() => localStorage.removeItem('living-map-passport-v1'));
    await page.reload();
    for (let i = 0; i < ids.length; i++) {
      await page.goto(`${base}#daerah/${ids[i]}`);
      await page.locator('.art-hero').waitFor();
      await page.waitForFunction(() => document.querySelector('.art-hero').complete);
      assert(await page.locator('.art-hero').evaluate(img => img.naturalWidth > 0));
      assert.equal(await page.locator('.language[aria-disabled="true"]').count(), 1);
      assert.equal(await page.locator('.audio-placeholder').count(), 1);
      await page.locator(`[data-answer="${(answers[i] + 1) % 3}"]`).click();
      assert.match(await page.locator('.feedback').innerText(), /Belum tepat/);
      await page.locator(`[data-answer="${answers[i]}"]`).click();
      await page.locator(`[data-answer="${answers[i]}"]`).click();
      assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('living-map-passport-v1'))).length, i + 1);
      assert.equal(await page.locator('#region-link').inputValue(), `${base}#daerah/${ids[i]}`);
      await page.reload();
      assert.match(await page.locator('.pill').innerText(), /terkumpul/);
      if (i === 2) {
        await page.getByRole('link', { name: 'Lihat paspor saya' }).click();
        await page.locator('.celebrate').waitFor();
        assert.equal(await page.locator('.stamp.earned').count(), 3);
      }
    }
    await page.goto(`${base}#paspor`);
    await page.locator('.stamp.earned').first().waitFor();
    assert.equal(await page.locator('.stamp.earned').count(), 6);
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Atur ulang' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.stamp.earned').length === 0);
    // All scenes must remain reachable on a phone without widening the document.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.story-map-scroll').evaluate(el => { el.scrollLeft = el.scrollWidth; });
    await page.locator('.map-scene').last().click();
    await page.waitForURL('**/#daerah/papua');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(base);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto(`${base}#daerah/unknown`);
    assert.match(await page.locator('h1').innerText(), /belum ditemukan/);
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
    const temporary = await blocked.newPage();
    await temporary.goto(`${base}#daerah/sumatra-utara`);
    await temporary.locator('[data-answer="0"]').click();
    await temporary.getByRole('link', { name: 'Lihat paspor saya' }).click();
    await temporary.locator('.stamp.earned').first().waitFor();
    assert.equal(await temporary.locator('.storage-note').count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS: 6 unique SVG scenes, map keyboard/mobile navigation, legacy passport, 6 deep links, quiz, unique stamps, reload, 3-region milestone, reset, blocked storage, responsive layout, zero JS/HTTP errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
