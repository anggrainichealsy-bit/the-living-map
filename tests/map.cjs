const { chromium } = require('playwright');
const { existsSync, mkdirSync } = require('node:fs');
const assert = require('node:assert/strict');
const base = (process.env.BASE_URL || 'http://127.0.0.1:8000/').replace(/\/?$/, '/');
const baseline = process.env.BASELINE_URL?.replace(/\/?$/, '/');
const ids = ['sumatra-utara', 'jawa-barat', 'kalimantan-barat', 'sulawesi-selatan', 'nusa-tenggara-barat', 'papua'];
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(base);
  await page.locator('.painted-map-art').evaluate(image=>image.decode());
  assert.equal(await page.locator('.painted-map-art').count(),1);
  assert.equal(await page.locator('.map-hotspot').count(),6);
  assert.equal(await page.locator('.map-mobile-destinations').isVisible(),false);
  for (const id of ids) {
   const hotspot=page.locator(`.map-hotspot[href="#daerah/${id}"]`);
   assert(await hotspot.getAttribute('aria-label'));
   await hotspot.focus(); await page.keyboard.press('Enter');
   await page.waitForURL(`**/#daerah/${id}`);
   await page.locator('.detail-hero').waitFor();
   assert.equal(await page.locator('.detail-hero').count(),1);
   await page.goto(base);
  }
  // Assert full-image aspect ratio and normalized hit positions at every phone width.
  for (const width of [320,375,390,430]) {
   await page.setViewportSize({width,height:900}); await page.goto(base);
   await page.locator('.painted-map-art').evaluate(image=>image.decode());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const geometry=await page.locator('.painted-map-canvas').evaluate(canvas=>{
    const image=canvas.querySelector('img'),box=canvas.getBoundingClientRect(),imageBox=image.getBoundingClientRect();
    return {width:box.width,height:box.height,scrollWidth:canvas.scrollWidth,clientWidth:canvas.clientWidth,imageWidth:imageBox.width,imageHeight:imageBox.height,ratio:image.naturalWidth/image.naturalHeight,positions:[...canvas.querySelectorAll('.map-hotspot')].map(h=>{
     const hit=h.getBoundingClientRect();return {actualX:(hit.left+hit.width/2-box.left)/box.width*100,actualY:(hit.top+hit.height/2-box.top)/box.height*100,x:parseFloat(h.style.getPropertyValue('--map-x')),y:parseFloat(h.style.getPropertyValue('--map-y'))};
    })};
   });
   assert(geometry.scrollWidth<=geometry.clientWidth,`Map overflows at ${width}`);
   assert(Math.abs(geometry.imageWidth/geometry.imageHeight-geometry.ratio)<.005,`Artwork distorted/cropped at ${width}`);
   assert(Math.abs(geometry.width-geometry.imageWidth)<1);
   assert(Math.abs(geometry.height-geometry.imageHeight)<1);
   for(const position of geometry.positions){assert(Math.abs(position.actualX-position.x)<.2);assert(Math.abs(position.actualY-position.y)<.2);}
   const menu=page.locator('.map-mobile-destinations');assert(await menu.isVisible());
   assert.equal(await menu.locator('a').count(),6);
   for (const id of ids) {
    const link=menu.locator(`a[href="#daerah/${id}"]`);
    assert((await link.boundingBox()).height>=44);
    await link.click();await page.waitForURL(`**/#daerah/${id}`);
    await page.goto(base);
   }
  }
  // Optional comparison with an archived pre-change site verifies protected sections are unchanged.
  if (baseline) {
   await page.setViewportSize({width:1440,height:1100});
   const before=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
   await Promise.all([page.goto(base),before.goto(baseline)]);
   for(const selector of ['.header','.editorial-hero','.collection','.passport-section','#tentang','footer']) {
    assert.equal(await page.locator(selector).evaluate(el=>el.outerHTML),await before.locator(selector).evaluate(el=>el.outerHTML),`Protected homepage section changed: ${selector}`);
    const a=await page.locator(selector).boundingBox(),b=await before.locator(selector).boundingBox();
    assert(Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1,`Protected dimensions changed: ${selector}`);
   }
   for(const id of ids) {
    await Promise.all([page.goto(`${base}#daerah/${id}`),before.goto(`${baseline}#daerah/${id}`)]);
    assert.equal(await page.locator('main').evaluate(el=>el.innerHTML),await before.locator('main').evaluate(el=>el.innerHTML),`Detail changed: ${id}`);
   }
  }
  if(process.env.SCREENSHOT_DIR) {
   mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});
   for(const [name,width] of [['desktop',1440],['mobile-320',320],['mobile-375',375],['mobile-390',390],['mobile-430',430]]) {
    await page.setViewportSize({width,height:1100});await page.goto(base);
    await page.locator('.painted-map-art').evaluate(image=>image.decode());
    await page.locator('.painted-map-art').scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('#jelajah').screenshot({path:`${process.env.SCREENSHOT_DIR}/map-${name}.png`,animations:'disabled'});
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: one full painted map; all six desktop keyboard routes; 320/375/390/430px without map/document overflow; uncropped aspect ratio; aligned hotspots; six touch links >=44px; protected homepage/detail content unchanged when BASELINE_URL is supplied.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
