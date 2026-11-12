'use strict';
const regions = window.REGIONS;
const main = document.querySelector('main');
const KEY = 'living-map-passport-v1';
let storageAvailable = true;
let completed = [];
try { const saved = JSON.parse(localStorage.getItem(KEY) || '[]'); completed = Array.isArray(saved) ? [...new Set(saved.filter(id => regions.some(r => r.id === id)))] : []; } catch { storageAvailable = false; }
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function imageSource(r, context = 'gallery') {
 const field = context === 'hero' || context === 'cover' ? 'heroImage' : context === 'thumbnail' ? 'thumbnailImage' : 'cardImage';
 return r[field] || r.illustration || `assets/illustrations/${r.id}.svg`;
}
function art(r, context = 'gallery') {
 const src = imageSource(r, context);
 const alt = r.imageAlt || r.illustrationAlt || `Ilustrasi imajinatif ${r.title}, ${r.name}`;
 return `<img class="art art-${context}" src="${escapeHTML(src)}" data-fallback="assets/illustrations/${r.id}.svg" alt="${escapeHTML(alt)}" width="1672" height="941" ${context === 'gallery' ? 'loading="lazy"' : ''} ${context === 'hero' || context === 'cover' ? 'fetchpriority="high"' : ''} decoding="async">`;
}
function postcards() {
 const selected = [regions[0], regions[1], regions[4]];
 return `<div class="postcard-collage" aria-label="Pilihan cerita bergambar"><span class="collage-coordinate" aria-hidden="true">CATATAN PERJALANAN / NUSANTARA</span>${selected.map((r,i)=>`<a class="postcard postcard-${i}" href="#daerah/${r.id}" aria-label="Buka ${r.title}">${art(r,i===0?'cover':'postcard')}<span class="postcard-title"><small>${i===0?'Ikan emas & sebuah janji':r.name}</small><span>${r.title.replace('Legenda ','')}</span></span>${i===0?'<span class="story-invitation">Masuk ke dunia ceritanya ↗</span>':''}</a>`).join('')}</div>`;
}
function audioPanel(r) {
 return `<section class="audio-exhibit" aria-label="Audio narasi siswa"><span class="audio-symbol" aria-hidden="true">♫</span><div class="audio-copy"><h2>${escapeHTML(r.audioTitle || 'Dengarkan cerita dari siswa')}</h2>${r.audio?`<p>${escapeHTML(r.audioCaption || 'Suara karya siswa · Dengarkan sesuai ritmemu.')}</p>`:'<p>Rekaman siswa segera hadir. Kamu tetap bisa membaca dan menjelajah.</p>'}</div>${r.audio?`<div class="audio-player"><audio controls preload="metadata" src="${escapeHTML(r.audio)}">Browser Anda tidak mendukung audio.</audio><p id="audio-status" role="status"></p></div>`:`<div class="audio-placeholder"><span class="waveform" aria-hidden="true">${[8,18,30,40,27,13,20,34,43,31,19,12,29,38,22,16,27,41,33,21,12,20,36,45,29,15,23,34,26,14,9,22,39,31,18,25,35,20,12,8].map(h=>`<i style="height:${h}px"></i>`).join('')}</span><span class="audio-state">○ Segera hadir</span><span class="sr-only">Rekaman siswa belum tersedia. Tanpa pemutaran otomatis.</span></div>`}</section>`;
}
// If a supplied raster cannot load, retain the existing local vector as a fallback.
document.addEventListener('error', event => {
 const image = event.target;
 if (image instanceof HTMLImageElement && image.dataset.fallback) {
  const fallback=image.dataset.fallback;
  delete image.dataset.fallback;
  image.src=fallback;
 } else if (image instanceof SVGImageElement && image.dataset.fallback) {
  const fallback=image.dataset.fallback;
  delete image.dataset.fallback;
  image.setAttribute('href',fallback);
 }
}, true);
function geographicMap() {
 const positions = [[155,105],[300,222],[380,110],[535,145],[465,249],[815,160]];
 return `<div class="map-wrap"><svg class="map" viewBox="0 0 1000 315" role="group" aria-label="Peta skematis Indonesia. Pilih salah satu dari enam daerah."><path class="map-sea" d="M20 130 Q320 10 630 80T990 130 M20 280 Q400 180 980 280 M110 10Q300 210 190 310 M730 0Q600 180 760 310"/><g class="land"><path d="m81 25 30 10 22 32 30 25 17 31 31 24 18 44 29 36-10 16-29-19-22-33-29-15-19-36-24-16-17-33-19-27z"/><path d="m242 214 38-5 30 9 27 3 37 17 34 4 8 12-22 4-36-10-36-4-34-12-37-4z"/><path d="m319 75 42-13 29-36 16 10 2 31 29 15-5 38-18 22-6 35-28 6-38-23-12-33-19-14z"/><path d="m508 81 18 8-4 30 16 4 25-31 35-4-3 12-28 7-17 33 19 20 21 1 13 29-12 9-22-21-18 2-12-20-12 14 9 38-15 10-10-30-7-33-22 2-8-17 17-17z"/><path d="m425 248 13-2 12 7-7 7-18-5z m28 7 29-2 13 9-24 4z m46 6 28 0 22 11-14 8-23-10z m57 10 24-7 22 7-17 7z m31 21 38-17 25 0 4 8-43 17z"/><path d="m728 113 28-12 33 11 25 29 27-1 27-15 15 4 5 31 24 16 26 12 4 51-38-17-35-21-28-5-24-27-32-10-24-18-28 1z"/><path d="m663 140 8-14 7 17-3 25-9 4z m-22 52 15-8 13 8-9 12-19-3z m40 35 27-5 11 7-19 6z m-29-132 10-12 3 19-9 9z"/></g><text class="map-label" x="190" y="75">SUMATRA</text><text class="map-label" x="335" y="208">JAWA</text><text class="map-label" x="331" y="53">KALIMANTAN</text><text class="map-label" x="530" y="66">SULAWESI</text><text class="map-label" x="787" y="260">PAPUA</text>${regions.map((r,i)=>`<a href="#daerah/${r.id}" class="map-pin" aria-label="Jelajahi ${r.name}: ${r.title}"><g transform="translate(${positions[i]})"><circle class="pin-target" r="23" fill="transparent"/><circle class="halo" r="18"/><circle class="dot" r="7"/><text y="-24" text-anchor="middle">${r.name}</text></g></a>`).join('')}<text x="900" y="45" fill="#d9c593" font-size="22">✧</text><text x="905" y="65" fill="#b2c4b4" font-size="8">U</text></svg></div>`;
}
// Vignette frames connect to geographic pins. All navigation uses the existing hash routes.
function map() {
 const geo = geographicMap().match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]
  .replace(/<a href="[\s\S]*?<\/a>/g, '');
 const pins = [[186,306],[360,446],[456,312],[642,354],[558,479],[978,372]];
 const frames = [[24,22],[242,499],[348,15],[670,28],[594,505],[946,467]];
 const lineEnds = [[134,208],[352,499],[458,201],[780,214],[704,505],[1056,467]];
 return `<div class="story-map-scroll" tabindex="0" role="region" aria-label="Atlas ilustratif; geser mendatar untuk melihat semua daerah" lang="id"><svg class="story-map" viewBox="0 0 1200 720" role="group" aria-label="Peta cerita Indonesia. Pilih ilustrasi atau pin dari enam daerah.">
 <defs><pattern id="ocean-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#79988a" stroke-width=".6" opacity=".18"/></pattern><radialGradient id="atlas-ocean"><stop stop-color="#3a6a67"/><stop offset="1" stop-color="#123c42"/></radialGradient><pattern id="land-lines" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 7 0" stroke="#e3d1a3" opacity=".12"/></pattern>${regions.map(r=>`<clipPath id="scene-${r.id}"><rect width="220" height="138" rx="40"/></clipPath>`).join('')}</defs>
 <rect width="1200" height="720" rx="8" fill="url(#atlas-ocean)"/><rect width="1200" height="720" fill="url(#ocean-grid)"/><path d="M12 45V12h45m1086 0h45v33M12 675v33h45m1086 0h45v-33" stroke="#c7b77e" fill="none" opacity=".65"/>
 <g class="atlas-geography" transform="translate(0 180) scale(1.2)">${geo}</g>
 <path class="voyage-line" d="M186 306Q205 430 360 446T558 479Q685 510 642 354T456 312Q688 175 978 372"/>
 <g class="atlas-flourishes" fill="none" stroke="#b7cfb4" opacity=".3"><path d="M37 330q30-20 60 0t60 0M710 440q30-20 60 0t60 0M828 282q30-20 60 0t60 0M87 541q30-20 60 0t60 0"/><circle cx="1090" cy="116" r="56"/><circle cx="1090" cy="116" r="47"/></g>
 <g transform="translate(1090 116)" fill="#d8bf88"><path d="m0-43 9 34 34 9-34 9-9 34-9-34-34-9 34-9z"/><circle r="6" fill="#234a4b"/><text y="-67" text-anchor="middle" font-size="10" letter-spacing="3">UTARA</text></g>

 ${regions.map((r,i)=>{
  const [px,py]=pins[i], [x,y]=frames[i], [lx,ly]=lineEnds[i];
  return `<path class="scene-connector" d="M${px} ${py}Q${lx} ${py} ${lx} ${ly}"/>
  <a class="map-pin geographic-pin" href="#daerah/${r.id}" aria-label="Pin ${r.name}: ${r.title}"><g transform="translate(${px} ${py})"><circle class="halo" r="24"/><circle class="pin-target" r="24" fill="transparent"/><circle class="dot" r="12"/><text class="pin-index" y="4" text-anchor="middle">${i+1}</text></g></a>
  <a class="map-scene" href="#daerah/${r.id}" aria-label="Jelajahi ${r.name}: ${r.title}"><g transform="translate(${x} ${y})"><rect class="scene-shadow" x="5" y="7" width="220" height="186" rx="40"/><rect class="scene-frame" x="-4" y="-4" width="228" height="190" rx="42"/><image data-fallback="assets/illustrations/${r.id}.svg" href="${escapeHTML(imageSource(r, 'thumbnail'))}" width="220" height="138" preserveAspectRatio="xMidYMid slice" clip-path="url(#scene-${r.id})"/>
  <path d="M0 100v45q0 37 40 37h140q40 0 40-37v-45q-110 30-220 0" fill="#f1e5ca"/><text class="scene-region" x="110" y="142" text-anchor="middle">0${i+1} · ${r.name.toUpperCase()}</text><text class="scene-title" x="110" y="164" text-anchor="middle">${r.id==='papua'?'Ruang Cerita Papua':r.title.replace('Legenda ','').replace('Kisah ','')}</text><circle cx="23" cy="22" r="14" fill="#183e42" stroke="#dbc087"/><text x="23" y="26" text-anchor="middle" font-size="11" fill="#f6ddb0">${completed.includes(r.id)?'✓':i+1}</text></g></a>`;
 }).join('')}</svg></div><div class="atlas-route-index" aria-label="Daftar destinasi peta">${regions.map((r,i)=>`<a href="#daerah/${r.id}"><span>0${i+1}</span>${r.name}<b aria-hidden="true">↗</b></a>`).join('')}</div>`;
}
function stamps(){return regions.map(r=>`<div class="stamp ${completed.includes(r.id)?'earned':''}"><b aria-hidden="true">${completed.includes(r.id)?r.icon:'·'}</b><span>${r.name}</span><span>${completed.includes(r.id)?'Terkumpul':'Belum dijelajahi'}</span></div>`).join('');}
function home(){
 document.title='The Living Map — Indonesia Bercerita';
 main.innerHTML=`<section class="editorial-hero"><div class="editorial-copy"><div class="eyebrow">THE LIVING MAP · INDONESIA BERCERITA</div><h1>Satu peta.<br><em>Berjuta cerita.</em></h1><p class="editorial-intro">Dari danau yang menyimpan legenda hingga pesisir yang penuh kisah. Mari mengenal Indonesia, satu cerita pada satu waktu.</p><div class="hero-actions"><a class="button" href="#jelajah">Mulai Jelajah <span aria-hidden="true">↗</span></a><a class="text-link" href="#paspor">Lihat Paspor →</a></div><p class="exhibition-meta"><span>● &nbsp; 6 daerah pilihan</span><span>14 November 2026</span></p><p class="editorial-theme">Beragam Bahasa, Berjuta Kisah, Satu Indonesia.</p></div>${postcards()}</section><section class="atlas" id="jelajah" aria-labelledby="atlas-title"><div class="atlas-heading"><div><div class="eyebrow">BUKA ATLASNYA. TEMUKAN KISAHNYA.</div><h2 id="atlas-title">Jelajah Nusantara</h2></div><p>Pilih ilustrasi atau pin untuk membuka kisah.<br><span class="mobile-map-hint">Geser atlas ke samping. Enam cerita menantimu.</span></p></div>${map()}<div class="map-caption"><span>✧ ENAM PINTU MENUJU DUNIA CERITA</span><span>PETA SKEMATIS · BUKAN UNTUK NAVIGASI</span></div><div class="hero-bottom"><span>01 — 06 &nbsp; DESTINASI CERITA</span><strong>Beragam Bahasa, Berjuta Kisah, Satu Indonesia.</strong><span>JELAJAHI DENGAN RASA INGIN TAHU ↘</span></div></section><section class="section collection" id="koleksi"><div class="section-heading"><div><div class="eyebrow">GALERI CERITA NUSANTARA</div><h2>Koleksi Cerita</h2></div><p>Dari danau hingga pesisir, ikuti jejak kisah Nusantara. Ke mana kita pergi hari ini?</p></div><div class="region-grid">${regions.map((r,i)=>`<a class="region-card" href="#daerah/${r.id}"><div class="card-art">${art(r)}<span class="number">0${i+1} / ${r.island}</span></div><div class="card-content"><small>${r.name.toUpperCase()}</small><h3>${r.title}</h3><p class="card-summary">${escapeHTML(r.summary || r.tag)}</p><div class="card-bottom"><span class="stamp-label">${completed.includes(r.id)?'✓ Tanda terkumpul':r.id==='papua'?'Materi dalam persiapan':'Buka cerita'}</span><span aria-hidden="true">↗</span></div></div></a>`).join('')}</div></section><section class="passport-section" id="paspor"><div class="section passport"><div><div class="eyebrow">NUSANTARA EXPLORER PASSPORT</div><h2>Langkah kecil.<br>Penemuan besar.</h2><p>Baca ceritanya, jawab tantangannya, lalu kumpulkan tanda eksplorasi. Selesaikan tiga daerah untuk menjadi Penjelajah Nusantara!</p><p>Progres tersimpan di browser perangkat ini. Tidak perlu akun.</p>${!storageAvailable?'<p class="storage-note">Penyimpanan browser tidak tersedia. Progres hanya bertahan selama halaman ini terbuka.</p>':''}${completed.length>=3?'<p class="celebrate" role="status">✺ Selamat, Penjelajah Nusantara! Kamu sudah menyelesaikan tiga daerah atau lebih. Teruskan perjalananmu!</p>':''}<a href="#jelajah" class="button outline">${completed.length?'Lanjutkan perjalanan':'Kumpulkan tanda pertama'} <span>↗</span></a>${completed.length?'<br><button class="reset" id="reset">Atur ulang paspor perangkat ini</button>':''}</div><div class="passport-book"><div class="book-spine" aria-hidden="true"></div><div class="book-title"><span>✺ &nbsp; PASPOR NUSANTARA</span><span>EXPLORER / 2026</span></div><div class="stamps">${stamps()}</div><label class="progress-copy" for="progress"><span>JEJAK PERJALANANMU</span><span>${completed.length} dari 6 daerah</span></label><progress id="progress" max="6" value="${completed.length}">${completed.length} / 6</progress></div></div></section><section class="section about" id="tentang"><div class="exhibition-note"><span class="exhibit-seal" aria-hidden="true">✺</span><div><div class="eyebrow">OPEN HOUSE · 14 NOVEMBER 2026</div><h2>Tentang Pameran</h2><p>The Living Map adalah ruang pameran edukatif untuk menjelajahi cerita Nusantara melalui peta, bacaan, dan karya suara siswa. Setiap daerah menjadi pintu percakapan tentang bahasa, kisah, dan keberagaman Indonesia.</p><p>Materi yang belum tersedia diberi penanda dan akan dilengkapi setelah peninjauan guru.</p></div></div><div class="section-heading"><div><div class="eyebrow">CARA MENJELAJAH</div><h2>Biarkan rasa ingin tahu memandu.</h2></div></div><div class="how"><article><b>01</b><h3>Pilih sebuah daerah</h3><p>Sentuh titik pada peta, pilih kartu cerita, atau pindai QR di stan pameran.</p></article><article><b>02</b><h3>Temukan kisahnya</h3><p>Baca cerita dan jelajahi materi siswa. Audio akan tersedia setelah rekaman ditambahkan.</p></article><article><b>03</b><h3>Tinggalkan jejakmu</h3><p>Jawab tantangan dengan benar dan kumpulkan tanda di paspor digitalmu.</p></article></div></section>`;
 document.querySelector('#reset')?.addEventListener('click',()=>{if(confirm('Hapus seluruh tanda eksplorasi pada perangkat ini?')){completed=[];save();render();toast('Paspor telah diatur ulang.');}});
}
function detail(r){
 document.documentElement.lang = 'id';
 document.title=`${r.title} — The Living Map`;
 const next=regions[(regions.indexOf(r)+1)%regions.length];
 main.innerHTML=`<section class="detail-top"><div class="breadcrumb"><a href="#jelajah">← Kembali ke peta cerita</a><span>DESTINASI 0${regions.indexOf(r)+1} / 06</span></div><div class="detail-hero">${art(r, 'hero')}<div class="detail-title"><div class="eyebrow">${r.name.toUpperCase()}</div><h1 id="detail-title">${r.title}</h1><p id="detail-tag">${r.tag}</p><div class="exhibit-index">ARSIP CERITA / 0${regions.indexOf(r)+1}</div><span class="pill">${completed.includes(r.id)?'✓ Tanda eksplorasi terkumpul':'Baca · Renungkan · Jelajahi'}</span><button class="read-story" data-section="story-section">Baca kisahnya <span aria-hidden="true">↓</span></button></div><span class="region-medallion" aria-hidden="true"><b>0${regions.indexOf(r)+1}</b><small>${r.island}</small></span></div><p class="illustration-caption">ILUSTRASI CERITA IMAJINATIF · BUKAN DOKUMENTASI TEMPAT ATAU BUSANA</p></section>${audioPanel(r)}<nav class="detail-sections" aria-label="Bagian cerita"><button class="active" data-section="story-section" aria-pressed="true">Cerita rakyat</button><button data-section="culture-section" aria-pressed="false">Bahasa daerah</button><button data-section="challenge-section" aria-pressed="false">Tantangan</button></nav><div class="section detail-body"><article class="story" id="story-section"><div class="reading-toolbar"><div class="eyebrow" id="reading-label">BUKU CERITA / BACAAN INDONESIA</div><div class="language-switch" role="group" aria-label="Bahasa cerita"><button class="language active" data-lang="id" aria-pressed="true" type="button">Indonesia</button><button class="language" data-lang="en" ${r.translations?.en ? 'aria-pressed="false"' : 'aria-disabled="true" aria-describedby="translation-note"'} type="button">English ${r.translations?.en ? '' : '<span>Segera</span>'}</button></div></div><p id="translation-note" class="translation-note">${r.translations?.en ? 'Pilih bahasa untuk membaca cerita, fakta, dan tantangan.' : 'Terjemahan English belum tersedia. Cerita ditampilkan dalam bahasa Indonesia.'}</p><div class="eyebrow">RUANG CERITA</div><h2>${r.id==='papua'?'Cerita berikutnya sedang disiapkan':'Dengarkan kisah dari Nusantara'}</h2><p class="notice">${['papua','sulawesi-selatan'].includes(r.id)?'Materi lengkap menunggu peninjauan guru.':'Adaptasi ringkas untuk pembelajaran, bukan kutipan naskah asli. Versi cerita dapat berbeda. Sumber edisi dan peninjauan guru belum dilengkapi.'}</p><div class="story-pages">${r.story.map(p=>`<p>${p}</p>`).join('')}</div>${r.reference?`<a class="text-link" href="${r.reference.url}" target="_blank" rel="noopener noreferrer">Sumber pengenalan: ${r.reference.label} ↗</a>`:''}<section class="quiz" id="challenge-section" aria-labelledby="quiz-title"><div class="eyebrow">TANTANGAN PENJELAJAH</div><h3 id="quiz-title">${escapeHTML(r.question)}</h3><p class="notice">Pilih jawaban yang tepat untuk mengumpulkan tanda eksplorasi. Kamu boleh mencoba lagi.</p><div class="options">${r.options.map((o,i)=>`<button class="option" data-answer="${i}"><span aria-hidden="true">${String.fromCharCode(65+i)}.</span> <span class="option-label">${escapeHTML(o)}</span></button>`).join('')}</div><p class="feedback" role="status" aria-live="polite">${completed.includes(r.id)?'✓ Kamu sudah mendapatkan tanda daerah ini. Boleh mencoba lagi!':''}</p><a class="text-link" href="#paspor">Lihat paspor saya →</a></section><div class="next-region"><a href="#jelajah" class="text-link">← Semua daerah</a><a class="button" href="#daerah/${next.id}">${next.name} →</a></div></article><aside aria-label="Materi pendamping"><section class="info-card" id="culture-section"><div class="eyebrow">PANEL MUSEUM / CATATAN DAERAH</div><h3>Mengenal lebih dekat</h3><p><strong>Wilayah dalam pameran</strong><br>${r.name} · ${r.island}</p><p class="panel-caption">Penanda lokasi mengikuti peta skematis pameran, bukan batas administratif.</p>${r.language?`<p id="region-language">${escapeHTML(r.language)}</p>`:'<p><strong>Bahasa daerah</strong><br>Materi dan pelafalan menunggu verifikasi guru atau narasumber.</p>'}${r.culture?`<p id="region-culture"><strong>Penjelasan geografi / Geography</strong><br>${escapeHTML(r.culture)}</p>`:'<p><strong>Fakta budaya</strong><br>Materi bersumber sedang dipersiapkan. Kami tidak menambahkan fakta yang belum diverifikasi.</p>'}</section><section class="info-card"><div class="eyebrow">BAGIKAN PERJALANAN</div><h3>Satu tautan, satu daerah</h3><label for="region-link" class="placeholder-label">Tautan untuk QR stan</label><input id="region-link" class="share-input" readonly aria-label="Tautan langsung daerah"><button id="copy" class="button">Salin tautan ↗</button><p>Gunakan tautan ini pada pembuat QR pilihan sekolah. QR akan langsung membuka daerah ini.</p></section></aside></div>`;
 document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
  const target=document.getElementById(button.dataset.section);
  target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  document.querySelectorAll('.detail-sections button').forEach(tab=>{
   const active=tab.dataset.section===button.dataset.section;
   tab.classList.toggle('active',active);
   tab.setAttribute('aria-pressed',String(active));
  });
 }));
 let selectedLanguage = 'id';
 document.querySelectorAll('.language').forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-disabled') === 'true') {
   toast('Terjemahan English belum tersedia.');
   document.querySelector('#translation-note').classList.add('highlight');
   return;
  }
  const language = button.dataset.lang;
  if (language === selectedLanguage) return;
  selectedLanguage = language;
  const translation = language === 'en' ? r.translations?.en : null;
  const data = translation || r;
  document.documentElement.lang = language;
  document.title = `${data.title || r.title} — The Living Map`;
  document.querySelector('#detail-title').textContent = data.title || r.title;
  document.querySelector('#detail-tag').textContent = data.tag || r.tag;
  document.querySelector('#reading-label').textContent = language === 'en' ? 'STORYBOOK / ENGLISH' : 'BUKU CERITA / BACAAN INDONESIA';
  document.querySelector('#translation-note').textContent = language === 'en' ? 'English edition / Terjemahan Bahasa Inggris' : 'Versi Bahasa Indonesia';
  document.querySelector('#translation-note').classList.remove('highlight');
  document.querySelector('.story-pages').replaceChildren(...data.story.map(p => {
   const el=document.createElement('p'); el.textContent=p; return el;
  }));
  const localLanguage = document.querySelector('#region-language');
  if (localLanguage && data.language) localLanguage.textContent = data.language;
  const geography = document.querySelector('#region-culture');
  if (geography && data.culture) {
   geography.replaceChildren();
   const heading=document.createElement('strong'); heading.textContent=language === 'en' ? 'Geographic explanation' : 'Penjelasan geografi';
   geography.append(heading,document.createElement('br'),document.createTextNode(data.culture));
  }
  document.querySelector('#quiz-title').textContent=data.question || r.question;
  document.querySelectorAll('.option-label').forEach((el,i) => {el.textContent=(data.options || r.options)[i] || '';});
  document.querySelector('.feedback').textContent=completed.includes(r.id) ? (language === 'en' ? '✓ Your stamp is already collected.' : '✓ Tanda daerah ini sudah terkumpul.') : '';
  document.querySelectorAll('.option').forEach(el=>{el.classList.remove('correct','incorrect');el.removeAttribute('aria-pressed')});
  document.querySelectorAll('.language').forEach(el=>{const active=el.dataset.lang===language;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
 }));
 const link=new URL(location.href);link.hash=`daerah/${r.id}`;document.querySelector('#region-link').value=link.href;
 document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(link.href);toast('Tautan daerah berhasil disalin.');}catch{document.querySelector('#region-link').select();toast('Pilih Salin pada tautan yang disorot.');}});
 document.querySelector('audio')?.addEventListener('error',()=>{document.querySelector('#audio-status').textContent='Rekaman belum dapat dimuat. Silakan hubungi tim pameran.';});
 document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
  const correct=Number(btn.dataset.answer)===r.answer;
  document.querySelectorAll('[data-answer]').forEach(b=>{b.classList.remove('incorrect','correct');b.removeAttribute('aria-pressed');});
  btn.classList.add(correct?'correct':'incorrect');btn.setAttribute('aria-pressed','true');
  const feedback=document.querySelector('.feedback');
  if(!correct){feedback.textContent='Belum tepat. Baca kembali ceritanya, lalu coba lagi.';return;}
  const newlyEarned=!completed.includes(r.id);
  if(newlyEarned){completed.push(r.id);save();}
  document.querySelector('.pill').textContent='✓ Tanda eksplorasi terkumpul';updateCount();
  feedback.textContent=completed.length>=3?'✺ Selamat, Penjelajah Nusantara! Tiga daerah atau lebih telah selesai. Lihat koleksimu di paspor.':'✓ Tepat! Tanda eksplorasi masuk ke paspormu. Jelajahi daerah berikutnya!';
  if(!storageAvailable) feedback.textContent+=' Penyimpanan browser tidak tersedia; progres hanya tersimpan selama halaman terbuka.';
  if(newlyEarned)toast(completed.length===3?'✺ Selamat! Kamu menjadi Penjelajah Nusantara.':`Tanda ${r.name} terkumpul!`);
 }));
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(completed));}catch{storageAvailable=false;}}
function updateCount(){document.querySelector('#nav-count').textContent=`${completed.length}/6`;}
let lastPage=null;
function render(){
 const hash=location.hash.slice(1); const isDetail=hash.startsWith('daerah/');
 const page=isDetail?hash:'home';
 if(page!==lastPage||!isDetail){
  if(isDetail){const r=regions.find(r=>`daerah/${r.id}`===hash);if(r)detail(r);else{document.title='Daerah tidak ditemukan — The Living Map';main.innerHTML='<section class="empty"><h1>Daerah belum ditemukan</h1><p>Pilih kembali salah satu dari enam daerah di peta.</p><a class="button" href="#jelajah">Kembali ke peta</a></section>';}}
  else home();lastPage=page;
 }
 updateCount();
 if(isDetail||!hash){window.scrollTo({top:0,left:0,behavior:'instant'});}else{requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView());}
 if(isDetail){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}else main.removeAttribute('tabindex');
}
let toastTimer;function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);}
window.addEventListener('hashchange',render);render();
