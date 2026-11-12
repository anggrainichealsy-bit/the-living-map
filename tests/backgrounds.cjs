const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { existsSync, mkdirSync } = require('node:fs');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000/').replace(/\/?$/,'/');
const baseline=process.env.BASELINE_URL?.replace(/\/?$/,'/');
const ids=['sumatra-utara','jawa-barat','kalimantan-barat','sulawesi-selatan','nusa-tenggara-barat','papua'];
function luminance(rgb){return rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const v=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(v[0]+.05)/(v[1]+.05);}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 try {
  const page=await browser.newPage({reducedMotion:'reduce'});
  const before=baseline?await browser.newPage({reducedMotion:'reduce'}):null;
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const width of [320,375,390,430,1440]){
   await page.setViewportSize({width,height:1050});await before?.setViewportSize({width,height:1050});
   for(const hash of ['',...ids.map(id=>`#daerah/${id}`)]){
    await page.goto(base+hash);await before?.goto(baseline+hash);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${hash}`);
    const decoration=await page.evaluate(()=>['::before','::after'].map(p=>{const s=getComputedStyle(document.body,p);return{events:s.pointerEvents,position:s.position,size:parseFloat(s.width),opacity:parseFloat(s.opacity),mode:s.backgroundSize,asset:s.backgroundImage};}));
    for(const d of decoration){assert.equal(d.events,'none');assert.equal(d.position,'fixed');assert.equal(d.mode,'contain');assert.match(d.asset,/blue-wave-corner.webp/);assert(d.opacity<=(width<=760?.14:.25));assert(d.size<=width);}
    for(const selector of hash?['body','.header','.story','.audio-exhibit','.info-card','footer']:['body','.header','.atlas','.region-card','.passport-section','footer']){
     assert.match(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).backgroundImage),/paper-grain.svg/,`Missing shared texture ${selector}`);
    }
    if(before){
     assert.equal(await page.locator('body').evaluate(el=>el.innerHTML),await before.locator('body').evaluate(el=>el.innerHTML),`DOM changed ${width} ${hash}`);
     const selectors=hash?['.header','.detail-top','.detail-hero','.audio-exhibit','.detail-body','footer']:['.header','.editorial-hero','.atlas','.collection','.passport-section','#tentang','footer'];
     for(const selector of selectors){
      const a=await page.locator(selector).boundingBox(),b=await before.locator(selector).boundingBox();
      for(const axis of ['x','y','width','height'])assert(Math.abs(a[axis]-b[axis])<1,`Layout changed ${selector} ${axis} at ${width} ${hash}`);
     }
    }
   }
  }
  await page.goto(base);
  for(const selector of ['.editorial-intro','.section-heading > p','.card-summary','.passport p']){
   const style=await page.locator(selector).first().evaluate(el=>({color:getComputedStyle(el).color,paper:getComputedStyle(document.documentElement).getPropertyValue('--paper-base')}));
   const rgb=style.color.match(/[\d.]+/g).slice(0,3).map(Number),paper=[250,245,231];
   assert(contrast(rgb,paper)>=4.5,`Low paper text contrast ${selector}`);
  }
  const transparency=await page.evaluate(async()=>{const image=new Image();image.src='assets/backgrounds/blue-wave-corner.webp';await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(image.width-1,image.height-1,1,1).data[3];});
  assert.equal(transparency,0,'Wave asset must retain transparent space');
  if(process.env.SCREENSHOT_DIR){
   mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});
   const flush=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   for(const [name,width,height] of [['desktop',1440,840],['mobile',390,1050]]){
    await page.setViewportSize({width,height});await page.goto(base);
    await page.locator('.postcard img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));await flush();
    await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/home-${name}.png`,animations:'disabled'});
    await page.goto(base+'#daerah/jawa-barat');await page.locator('.art-hero').evaluate(image=>image.decode());await flush();
    await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/detail-${name}.png`,animations:'disabled'});
    await page.goto(base+'#paspor');await page.locator('#paspor').scrollIntoViewIfNeeded();await flush();
    await page.locator('#paspor').screenshot({path:`${process.env.SCREENSHOT_DIR}/passport-${name}.png`,animations:'disabled'});
    await page.goto(base+'#jelajah');await page.locator('.painted-map-art').evaluate(image=>image.decode());await page.locator('.painted-map-art').scrollIntoViewIfNeeded();await flush();
    await page.locator('#jelajah').screenshot({path:`${process.env.SCREENSHOT_DIR}/map-${name}.png`,animations:'disabled'});
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: all six pages and homepage share paper textures; 320/375/390/430/1440px without overflow; decorations transparent and noninteractive; reduced mobile treatment; paragraph contrast on paper >=4.5; exact DOM and layout preserved when BASELINE_URL is supplied.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
