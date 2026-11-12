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
      assert.match(response.headers()['content-type'], /^image\//);
      assert((await response.body()).length > 1000);
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
      assert.equal(await page.locator('.language[aria-disabled="true"]').count(), i === 0 ? 0 : 1);
      assert.equal(await page.locator('.audio-placeholder').count(), i === 0 ? 0 : 1);
      if (i === 0) {
        await page.waitForFunction(() => document.querySelector('audio')?.readyState >= 1);
        assert(await page.locator('audio').evaluate(audio => audio.duration > 90 && audio.duration < 100));
        assert.equal(await page.locator('audio').getAttribute('autoplay'), null);
        await page.locator('audio').evaluate(audio => audio.play());
        await page.waitForFunction(() => document.querySelector('audio').currentTime > .1);
        const pausedAt = await page.locator('audio').evaluate(audio => { audio.pause(); return audio.currentTime; });
        await page.locator('audio').evaluate(audio => audio.play());
        await page.waitForFunction(time => document.querySelector('audio').currentTime > time + .1, pausedAt);
        await page.locator('audio').evaluate(audio => audio.pause());
      }
      await page.locator(`[data-answer="${(answers[i] + 1) % 3}"]`).click();
      assert.match(await page.locator('.feedback').innerText(), /Belum tepat/);
      await page.locator(`[data-answer="${answers[i]}"]`).click();
      await page.locator(`[data-answer="${answers[i]}"]`).click();
      assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('living-map-passport-v1'))).length, i + 1);
      assert.equal(await page.locator('#region-link').inputValue(), `${base}#daerah/${ids[i]}`);
      await page.reload();
      assert.match(await page.locator('.pill').innerText(), /terkumpul/);
      await page.getByRole('button', { name: 'Bahasa daerah', exact: true }).click();
      assert.equal(await page.getByRole('button', { name: 'Bahasa daerah', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(new URL(page.url()).hash, `#daerah/${ids[i]}`);
      await page.getByRole('button', { name: 'Tantangan', exact: true }).click();
      assert.equal(await page.getByRole('button', { name: 'Tantangan', exact: true }).getAttribute('aria-pressed'), 'true');

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
    // Verify the relocated native audio player with a temporary silent WAV fixture.
    const audioPage = await browser.newPage();
    const wav = Buffer.alloc(1644);
    wav.write('RIFF'); wav.writeUInt32LE(1636,4); wav.write('WAVEfmt ',8);
    wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
    wav.writeUInt32LE(8000,24); wav.writeUInt32LE(16000,28);
    wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(1600,40);
    await audioPage.route('**/test-audio.wav', route => route.fulfill({ contentType: 'audio/wav', body: wav }));
    await audioPage.goto(base);
    await audioPage.evaluate(() => { window.REGIONS[1].audio='test-audio.wav'; location.hash='daerah/jawa-barat'; });
    await audioPage.waitForFunction(() => document.querySelector('audio')?.readyState >= 1);
    assert.equal(await audioPage.locator('.audio-exhibit audio').count(), 1);
    assert.equal(await audioPage.locator('audio').getAttribute('autoplay'), null);
    await audioPage.locator('audio').evaluate(audio => audio.play());
    await audioPage.waitForFunction(() => document.querySelector('audio').ended);
    // Broken user-supplied artwork falls back to the local SVG without a reload.
    await audioPage.route('**/missing-art.webp', route => route.fulfill({ status: 404, body: '' }));
    await audioPage.evaluate(() => { window.REGIONS[0].heroImage='missing-art.webp'; location.hash='daerah/sumatra-utara'; });
    await audioPage.waitForFunction(() => document.querySelector('.art-hero')?.src.endsWith('sumatra-utara.svg') && document.querySelector('.art-hero').naturalWidth > 0);
    for (const width of [320, 390, 768, 1024, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const hash of ['', '#daerah/jawa-barat']) {
        await page.goto(base + hash);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px ${hash}`);
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: 6 unique raster scenes, map keyboard/mobile navigation, legacy passport, 6 deep links, quiz, unique stamps, reload, 3-region milestone, reset, blocked storage, responsive layout, section navigation, native audio playback, image fallback, zero JS/HTTP errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
