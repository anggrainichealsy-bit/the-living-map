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
 return `<section class="audio-exhibit" aria-label="Audio narasi siswa"><span class="audio-symbol" aria-hidden="true">♫</span><div class="audio-copy"><h2>${escapeHTML(r.audioTitle || 'Dengarkan cerita dari siswa')}</h2><p class="audio-narrator-credit"><span>Pengisi suara siswa / Student narrator</span><strong>${escapeHTML(r.narrator || 'Tim narasi siswa')}</strong></p>${r.audio?`<p>${escapeHTML(r.audioCaption || 'Suara karya siswa · Dengarkan sesuai ritmemu.')}</p>`:'<p>Rekaman siswa segera hadir. Kamu tetap bisa membaca dan menjelajah.</p>'}</div>${r.audio?`<div class="audio-player"><audio controls preload="metadata" src="${escapeHTML(r.audio)}">Browser Anda tidak mendukung audio.</audio><p id="audio-status" role="status"></p></div>`:`<div class="audio-placeholder"><span class="waveform" aria-hidden="true">${[8,18,30,40,27,13,20,34,43,31,19,12,29,38,22,16,27,41,33,21,12,20,36,45,29,15,23,34,26,14,9,22,39,31,18,25,35,20,12,8].map(h=>`<i style="height:${h}px"></i>`).join('')}</span><span class="audio-state">○ Segera hadir</span><span class="sr-only">Rekaman siswa belum tersedia. Tanpa pemutaran otomatis.</span></div>`}</section>`;
}
function transcripts(r) {
 if (!r.audioTranscript) return '';
 // When the full narration is already the main reading, don't repeat it below the audio player.
 if (JSON.stringify(r.story) === JSON.stringify(r.audioTranscript.id) &&
     JSON.stringify(r.translations?.en?.story) === JSON.stringify(r.audioTranscript.en)) return '';
 return `<details class="audio-transcripts"><summary>Naskah narasi siswa · Indonesia / English</summary><div class="transcript-columns">${[['id','Bahasa Indonesia'],['en','English']].map(([language,label])=>`<section lang="${language}"><h3>${label}</h3>${(r.audioTranscript[language] || []).map(p=>`<p>${escapeHTML(p)}</p>`).join('')}</section>`).join('')}</div></details>`;
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
// Normalized coordinates refer to the complete 1672 × 941 storybook artwork.
// Keep them as percentages: the same image ratio is used at every viewport width.
function map() {
 const destinations = [
  { id:'sumatra-utara', x:15, y:38, label:'Danau Toba' },
  { id:'jawa-barat', x:25, y:68, label:'Sangkuriang' },
  { id:'kalimantan-barat', x:32, y:43, label:'Batu Menangis' },
  { id:'sulawesi-selatan', x:51, y:54, label:'Sawerigading' },
  { id:'nusa-tenggara-barat', x:51, y:77, label:'Putri Mandalika' },
  { id:'papua', x:77, y:45, label:'Kisah Queya · Cenderawasih' }
 ];
 return `<div class="painted-map"><figure class="painted-map-figure"><div class="painted-map-canvas"><img class="painted-map-art" src="assets/maps/indonesia-storybook.webp" width="1672" height="941" loading="lazy" decoding="async" alt="Peta dongeng Indonesia: Sumatra, Jawa, Kalimantan, Sulawesi, Bali dan Nusa Tenggara, Maluku, serta Papua. Danau dan ikan emas, perahu terbalik, ibu-anak dan batu, kapal layar, putri di pesisir, serta cenderawasih menyatu dalam lanskap pulau."><nav class="painted-map-hotspots" aria-label="Pilih cerita pada peta Indonesia">${destinations.map((destination,index)=>{
  const region=regions.find(r=>r.id===destination.id);
  const earned=completed.includes(region.id);
  return `<a class="map-hotspot ${earned?'map-hotspot-earned':''}" href="#daerah/${region.id}" style="--map-x:${destination.x}%;--map-y:${destination.y}%" aria-label="Jelajahi ${escapeHTML(region.name)}: ${escapeHTML(region.title)}${earned?'. Tanda eksplorasi sudah terkumpul.':''}"><span class="map-hotspot-dot" aria-hidden="true">${earned?'✓':index+1}</span><span class="map-hotspot-label" aria-hidden="true"><small>${escapeHTML(region.name)}</small>${escapeHTML(destination.label)}</span></a>`;
 }).join('')}</nav></div><figcaption class="painted-map-note">Peta ilustratif, bukan peta administratif atau navigasi. Adegan dan proporsi merupakan interpretasi artistik.</figcaption></figure><nav class="map-mobile-destinations" aria-label="Daftar enam destinasi cerita"><p class="map-mobile-heading">Pilih kisah untuk dijelajahi</p>${destinations.map((destination,index)=>{
  const region=regions.find(r=>r.id===destination.id);
  return `<a href="#daerah/${region.id}"><span class="map-mobile-number" aria-hidden="true">${completed.includes(region.id)?'✓':String(index+1).padStart(2,'0')}</span><span><strong>${escapeHTML(region.name)}</strong><small>${escapeHTML(region.title)}</small></span><span class="map-mobile-arrow" aria-hidden="true">→</span></a>`;
 }).join('')}</nav></div>`;
}
// Use the six original painted stamps (one 3x2 image). Keep existing SVGs as fallback.
const originalStamps = new Image();
originalStamps.addEventListener('load', () => document.documentElement.classList.add('original-stamps-loaded'));
originalStamps.src = 'assets/stamps/Prangko_Cerita_Nusantara_Asli.webp';
function stampImage(r, context = 'passport') {
 const index = regions.indexOf(r);
 return `<span class="travel-stamp-layer" role="img" aria-label="Prangko cerita ${escapeHTML(r.name)} — ${escapeHTML(r.title)}"><img class="travel-stamp-art" src="assets/stamps/${r.id}.svg" alt="" loading="lazy" width="180" height="180" decoding="async"><span class="travel-stamp-original travel-stamp-pos-${index}" aria-hidden="true"></span></span>`;
}
function stamps() {
 return regions.map(r => {
  const earned = completed.includes(r.id);
  return `<a class="stamp ${earned?'earned':'unearned'}" href="#daerah/${r.id}" aria-label="${escapeHTML(r.name)}: ${earned?'stempel sudah terkumpul':'stempel belum terkumpul, buka cerita untuk mendapatkannya'}"><span class="stamp-art-wrap">${stampImage(r)}</span><span class="stamp-region">${escapeHTML(r.name)}</span><span class="stamp-status">${earned?'✓ Stempel terkumpul':'○ Belum dijelajahi'}</span></a>`;
 }).join('');
}

/* Three required passport missions per region.
   Existing earned stamps remain in localStorage; new stamps require all three tasks.
   This is a visitor experience feature, not tamper-proof attendance verification. */
const MISSION_KEY = 'living-map-passport-missions-v1';
const AUDIO_FRACTION = 0.75;
const READING_SECONDS = 25;
let missionProgress = {};
try {
 const savedMissions = JSON.parse(localStorage.getItem(MISSION_KEY) || '{}');
 if (savedMissions && typeof savedMissions === 'object' && !Array.isArray(savedMissions)) missionProgress = savedMissions;
} catch { storageAvailable = false; }
let activeReadingTimer = null;
function missionFor(r) {
 if (!missionProgress[r.id] || typeof missionProgress[r.id] !== 'object') {
   missionProgress[r.id] = {audio:false, reading:false, quiz:false, played:0, readSec:0, started:false, reachedEnd:false};
 }
 return missionProgress[r.id];
}
function saveMissions() {
 try { localStorage.setItem(MISSION_KEY, JSON.stringify(missionProgress)); }
 catch { storageAvailable = false; }
}
function missionCount(m) { return Number(!!m.audio) + Number(!!m.reading) + Number(!!m.quiz); }
function missionChecklist(r) {
 const m = missionFor(r);
 return '<ol class="passport-mission-list">' +
   [['audio','🎧','Dengarkan suara anak','Listen to the narration'],
    ['reading','📖','Baca dan gulir hingga akhir','Read and scroll to the end'],
    ['quiz','✦','Jawab kuis dengan benar','Answer the quiz correctly']].map(([key,symbol,id,en]) =>
      '<li data-mission="' + key + '" class="' + (m[key]?'done':'') +
      '"><span class="mission-symbol" aria-hidden="true">' + symbol +
      '</span><span class="mission-name" data-id="' + id + '" data-en="' + en + '">' +
      id + '</span><span class="mission-check" aria-hidden="true">' +
      (m[key]?'✓':'○')+'</span></li>').join('') + '</ol>';
}
function refreshMissionPanel(r, language = document.documentElement.lang) {
 const panel = document.getElementById('reading-stamp-panel');
 if (!panel || !panel.isConnected) return;
 const m = missionFor(r), en = language === 'en', count = missionCount(m), earned = completed.includes(r.id);
 panel.classList.toggle('collected',earned);
 const title = panel.querySelector('#stamp-panel-title');
 const description = panel.querySelector('#stamp-panel-description');
 const counter = panel.querySelector('#mission-counter');
 const bar = panel.querySelector('#mission-progress');
 const status = panel.querySelector('#reading-stamp-status');
 if (title) title.textContent = en ? 'Complete 3 Missions, Collect 1 Stamp' : 'Selesaikan 3 Misi, Dapatkan 1 Stempel';
 if (description) description.textContent = en
   ? 'Listen to at least 75% of the narration, read the story to the end for at least 25 seconds, and answer the quiz correctly. Your stamp will appear automatically when all three are complete.'
   : 'Dengarkan minimal 75% narasi anak, jelajahi bacaan sampai akhir selama minimal 25 detik, dan jawab kuis dengan benar. Ketika tiga misi selesai, stempel masuk otomatis!';
 if (counter) counter.textContent = (en?'Missions completed: ':'Misi selesai: ') + count + '/3';
 if (bar) { bar.value = count; bar.setAttribute('aria-label',en?'Mission progress':'Progres misi'); }
 panel.querySelectorAll('[data-mission]').forEach(item => {
   const key=item.dataset.mission, done=!!m[key];
   item.classList.toggle('done',done);
   item.querySelector('.mission-check').textContent=done?'✓':'○';
   const name=item.querySelector('.mission-name');
   if (name) name.textContent=en?name.dataset.en:name.dataset.id;
 });
 if (status) {
   if (earned && count < 3) {
     status.textContent = en?'Your stamp was already collected under the earlier passport rules.':'Stempel ini sudah terkumpul dengan aturan paspor sebelumnya.';
   } else if (earned) {
     status.textContent = en?'✦ All missions complete. Your stamp is in the passport!':'✦ Semua misi selesai! Stempel otomatis masuk ke paspormu.';
   } else if (!m.audio) {
     status.textContent = en?'Audio: listen to at least 75% (without skipping).':'Audio: dengarkan minimal 75% tanpa melompat ke depan.';
   } else if (!m.reading) {
     const secs = Math.max(0,READING_SECONDS - Math.floor(Number(m.readSec)||0));
     status.textContent = en?'Reading: scroll through the story and spend '+secs+' more seconds reading.':'Membaca: telusuri cerita sampai akhir dan baca '+secs+' detik lagi.';
   } else if (!m.quiz) {
     status.textContent = en?'Almost there! Answer the challenge correctly.':'Sedikit lagi! Jawab tantangannya dengan benar.';
   }
 }
}
function awardStampIfReady(r) {
 const m=missionFor(r);
 if (!m.audio || !m.reading || !m.quiz || completed.includes(r.id)) return false;
 completed.push(r.id); save(); updateCount();
 document.querySelector('.pill') && (document.querySelector('.pill').textContent = '✓ Tanda eksplorasi terkumpul');
 if(completed.length===3) toast('✺ Selamat! Kamu menjadi Penjelajah Nusantara.');
 else toast('✦ CAP! Stempel '+r.name+' otomatis terkumpul!');
 refreshMissionPanel(r);
 return true;
}
function stopMissionTracking() {
 if (activeReadingTimer) { clearInterval(activeReadingTimer); activeReadingTimer=null; }
}
function beginMissionTracking(r) {
 stopMissionTracking();
 const m=missionFor(r), audio=document.querySelector('.audio-exhibit audio');
 if (audio) {
   let lastTime=Number(audio.currentTime)||0;
   audio.addEventListener('play',()=>{ lastTime=Number(audio.currentTime)||0; });
   audio.addEventListener('seeking',()=>{ lastTime=Number(audio.currentTime)||0; });
   audio.addEventListener('seeked',()=>{ lastTime=Number(audio.currentTime)||0; });
   audio.addEventListener('timeupdate',()=>{
     if (m.audio) return;
     const now=Number(audio.currentTime)||0, delta=now-lastTime;
     lastTime=now;
     if (audio.paused || audio.seeking || document.hidden || delta<=0 || delta>1.5) return;
     m.played=Math.max(0,Number(m.played)||0)+delta;
     if (Number.isFinite(audio.duration) && audio.duration>0 &&
          m.played/audio.duration>=AUDIO_FRACTION) m.audio=true;
     saveMissions(); if (m.audio) { awardStampIfReady(r); refreshMissionPanel(r); }
   });
   audio.addEventListener('loadedmetadata',()=>{
     if (!m.audio && audio.duration>0 && (Number(m.played)||0)/audio.duration>=AUDIO_FRACTION) {
       m.audio=true; saveMissions(); awardStampIfReady(r); refreshMissionPanel(r);
     }
   });
 }
 activeReadingTimer=setInterval(()=>{
   const story=document.querySelector('.story-pages');
   if (!story || !story.isConnected || document.hidden || m.reading) return;
   const first=story.firstElementChild, last=story.lastElementChild;
   if (!first || !last) return;
   const box=story.getBoundingClientRect();
   const vh=window.innerHeight;
   if (box.top<vh*.85 && box.bottom>vh*.15) {
     if (first.getBoundingClientRect().bottom>vh*.12 && first.getBoundingClientRect().top<vh*.9) m.started=true;
     if (last.getBoundingClientRect().top<vh*.85) m.reachedEnd=true;
     if (m.started) m.readSec=(Number(m.readSec)||0)+1;
     if (m.started && m.reachedEnd && m.readSec>=READING_SECONDS) {
       m.reading=true; awardStampIfReady(r);
     }
     saveMissions();
     if (m.reading || Math.round(m.readSec)%5===0) refreshMissionPanel(r);
   }
 },1000);
 refreshMissionPanel(r);
}
function home(){
 stopMissionTracking();
 destroyComments();
 document.documentElement.lang='id';
 document.title='The Living Map — Indonesia Bercerita';
 main.innerHTML=`<section class="editorial-hero"><div class="editorial-copy"><div class="eyebrow">THE LIVING MAP · INDONESIA BERCERITA</div><h1>Satu peta.<br><em>Berjuta cerita.</em></h1><p class="editorial-intro">Dari danau yang menyimpan legenda hingga pesisir yang penuh kisah. Mari mengenal Indonesia, satu cerita pada satu waktu.</p><div class="hero-actions"><a class="button" href="#jelajah">Mulai Jelajah <span aria-hidden="true">↗</span></a><a class="text-link" href="#paspor">Lihat Paspor →</a></div><p class="exhibition-meta"><span>● &nbsp; 6 daerah pilihan</span><span>14 November 2026</span></p><p class="editorial-theme">Beragam Bahasa, Berjuta Kisah, Satu Indonesia.</p></div>${postcards()}</section><section class="atlas" id="jelajah" aria-labelledby="atlas-title"><div class="atlas-heading"><div><div class="eyebrow">BUKA ATLASNYA. TEMUKAN KISAHNYA.</div><h2 id="atlas-title">Jelajah Nusantara</h2></div><p>Sentuh penanda untuk membuka kisah di pulau pilihanmu.<br><span class="mobile-map-hint">Atau pilih salah satu dari enam destinasi di bawah peta.</span></p></div>${map()}<div class="map-caption"><span>✧ ENAM PINTU MENUJU DUNIA CERITA</span><span>PETA SKEMATIS · BUKAN UNTUK NAVIGASI</span></div><div class="hero-bottom"><span>01 — 06 &nbsp; DESTINASI CERITA</span><strong>Beragam Bahasa, Berjuta Kisah, Satu Indonesia.</strong><span>JELAJAHI DENGAN RASA INGIN TAHU ↘</span></div></section><section class="section collection" id="koleksi"><div class="section-heading"><div><div class="eyebrow">GALERI CERITA NUSANTARA</div><h2>Koleksi Cerita</h2></div><p>Dari danau hingga pesisir, ikuti jejak kisah Nusantara. Ke mana kita pergi hari ini?</p></div><div class="region-grid">${regions.map((r,i)=>`<a class="region-card" href="#daerah/${r.id}"><div class="card-art">${art(r)}<span class="number">0${i+1} / ${r.island}</span></div><div class="card-content"><small>${r.name.toUpperCase()}</small><h3>${r.title}</h3><p class="card-summary">${escapeHTML(r.summary || r.tag)}</p><div class="card-bottom"><span class="stamp-label">${completed.includes(r.id)?'✓ Tanda terkumpul':'Buka cerita'}</span><span aria-hidden="true">↗</span></div></div></a>`).join('')}</div></section><section class="narrator-credits-section section" id="pengisi-suara" aria-labelledby="narrator-credits-title"><div class="narrator-credits-heading"><div class="eyebrow">DIBALIK SUARA NUSANTARA · MEET THE STORYTELLERS</div><h2 id="narrator-credits-title">Suara di Balik Cerita</h2><p>Terima kasih kepada para siswa yang menghidupkan legenda Nusantara melalui narasi mereka.</p></div><div class="narrator-credits-grid">${regions.map(r=>`<a class="narrator-credit-item" href="#daerah/${r.id}"><span class="narrator-credit-region">${escapeHTML(r.name)}</span><span class="narrator-credit-title">${escapeHTML(r.title)}</span><span class="narrator-credit-voice"><span aria-hidden="true">♫</span> ${escapeHTML(r.narrator || 'Tim narasi siswa')}</span></a>`).join('')}</div></section><section class="passport-section" id="paspor"><div class="section passport"><div><div class="eyebrow">NUSANTARA EXPLORER PASSPORT</div><h2>Langkah kecil.<br>Penemuan besar.</h2><p>Dengarkan minimal 75% narasi siswa, baca cerita sampai akhir, lalu jawab kuis dengan benar. Jika ketiganya selesai, prangko langsung tercap otomatis! Kumpulkan tiga stempel untuk menjadi Penjelajah Nusantara!</p><p>Progres tersimpan di browser perangkat ini. Tidak perlu akun.</p>${!storageAvailable?'<p class="storage-note">Penyimpanan browser tidak tersedia. Progres hanya bertahan selama halaman ini terbuka.</p>':''}${completed.length>=3?'<p class="celebrate" role="status">✺ Selamat, Penjelajah Nusantara! Kamu sudah menyelesaikan tiga daerah atau lebih. Teruskan perjalananmu!</p>':''}<a href="#jelajah" class="button outline">${completed.length?'Lanjutkan perjalanan':'Kumpulkan tanda pertama'} <span>↗</span></a>${completed.length?'<br><button class="reset" id="reset">Atur ulang paspor perangkat ini</button>':''}</div><div class="passport-book"><div class="book-spine" aria-hidden="true"></div><div class="book-title"><span>✺ &nbsp; PASPOR NUSANTARA</span><span>EXPLORER / 2026</span></div><p class="passport-instruction">Enam prangko dongeng Nusantara. Selesaikan tiga misi di tiap daerah untuk mendapatkannya otomatis. Ketuk prangko untuk membuka kisahnya.</p><div class="stamps">${stamps()}</div><label class="progress-copy" for="progress"><span>JEJAK PERJALANANMU</span><span>${completed.length} dari 6 daerah</span></label><progress id="progress" max="6" value="${completed.length}">${completed.length} / 6</progress></div></div></section><section class="section about" id="tentang"><div class="exhibition-note"><span class="exhibit-seal" aria-hidden="true">✺</span><div><div class="eyebrow">OPEN HOUSE · 14 NOVEMBER 2026</div><h2>Tentang Pameran</h2><p>The Living Map adalah ruang pameran edukatif untuk menjelajahi cerita Nusantara melalui peta, bacaan, dan karya suara siswa. Setiap daerah menjadi pintu percakapan tentang bahasa, kisah, dan keberagaman Indonesia.</p><p>Enam daerah menghadirkan materi Indonesia dan English serta narasi siswa. Rujukan materi yang disertakan ditampilkan di ruang cerita.</p></div></div><div class="section-heading"><div><div class="eyebrow">CARA MENJELAJAH</div><h2>Biarkan rasa ingin tahu memandu.</h2></div></div><div class="how"><article><b>01</b><h3>Pilih sebuah daerah</h3><p>Sentuh titik pada peta, pilih kartu cerita, atau pindai QR di stan pameran.</p></article><article><b>02</b><h3>Temukan kisahnya</h3><p>Baca cerita, jelajahi materi dua bahasa, dan dengarkan narasi siswa pada setiap daerah.</p></article><article><b>03</b><h3>Tinggalkan jejakmu</h3><p>Dengarkan narasi, baca hingga akhir, dan jawab tantangan dengan benar. Stempel muncul otomatis!</p></article></div></section>`;
 document.querySelector('#reset')?.addEventListener('click',()=>{if(confirm('Hapus seluruh tanda eksplorasi pada perangkat ini?')){completed=[];missionProgress={};save();saveMissions();render();toast('Paspor dan seluruh progres misi telah diatur ulang.');}});
}

// FastComments guestbook. One stable thread per destination, regardless of query strings
// or hash-only navigation. The tenant ID is the public embed ID, not an API key.
const GUESTBOOK_TENANT_ID = 'VddrpYz8LJb';
let commentsLibraryPromise = null;
let commentsInstance = null;
function loadCommentsLibrary() {
 if (typeof window.FastCommentsUI === 'function') return Promise.resolve(window.FastCommentsUI);
 if (commentsLibraryPromise) return commentsLibraryPromise;
 commentsLibraryPromise = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://cdn.fastcomments.com/js/embed-v2.min.js';
  script.async = true;
  script.onload = () => typeof window.FastCommentsUI === 'function' ? resolve(window.FastCommentsUI) : reject(new Error('FastComments widget unavailable'));
  script.onerror = () => reject(new Error('Could not load FastComments'));
  document.head.appendChild(script);
 }).catch(error => { commentsLibraryPromise = null; throw error; });
 return commentsLibraryPromise;
}
function destroyComments() {
 if (commentsInstance) {
  try { commentsInstance.destroy(); } catch (error) { console.warn('Could not close comment widget', error); }
  commentsInstance = null;
 }
}
function mountComments(r) {
 const target = document.getElementById('fastcomments-widget');
 const status = document.getElementById('guestbook-status');
 if (!target) return;
 loadCommentsLibrary().then(Widget => {
  // A visitor may navigate to another story before the script finishes loading.
  if (document.getElementById('fastcomments-widget') !== target ||
      location.hash !== '#daerah/' + r.id) return;
  destroyComments();
  const url = location.origin + location.pathname + '#daerah/' + r.id;
  commentsInstance = Widget(target, {
    tenantId: GUESTBOOK_TENANT_ID,
    urlId: 'the-living-map/' + r.id,
    url,
    noImageUploads: true,
    disableToolbar: true
  });
  if (status) status.hidden = true;
 }).catch(() => {
  if (document.getElementById('fastcomments-widget') === target && status) {
    status.textContent = 'Buku kesan belum dapat dimuat. Periksa koneksi internet atau coba lagi nanti.';
  }
 });
}

function detail(r){
 stopMissionTracking();
 destroyComments();
 document.documentElement.lang = 'id';
 document.documentElement.lang='id';
 document.title=`${r.title} — The Living Map`;
 const next=regions[(regions.indexOf(r)+1)%regions.length];
 main.innerHTML=`<section class="detail-top"><div class="breadcrumb"><a href="#jelajah">← Kembali ke peta cerita</a><span>DESTINASI 0${regions.indexOf(r)+1} / 06</span></div><div class="detail-hero">${art(r, 'hero')}<div class="detail-title"><div class="eyebrow">${r.name.toUpperCase()}</div><h1 id="detail-title">${r.title}</h1><p id="detail-tag">${r.tag}</p><div class="exhibit-index">ARSIP CERITA / 0${regions.indexOf(r)+1}</div><span class="pill">${completed.includes(r.id)?'✓ Tanda eksplorasi terkumpul':'Baca · Renungkan · Jelajahi'}</span><button class="read-story" data-section="story-section">Baca kisahnya <span aria-hidden="true">↓</span></button></div><span class="region-medallion" aria-hidden="true"><b>0${regions.indexOf(r)+1}</b><small>${r.island}</small></span></div><p class="illustration-caption">ILUSTRASI CERITA IMAJINATIF · BUKAN DOKUMENTASI TEMPAT ATAU BUSANA</p></section>${audioPanel(r)}${transcripts(r)}<nav class="detail-sections" aria-label="Bagian cerita"><button class="active" data-section="story-section" aria-pressed="true">Cerita rakyat</button><button data-section="culture-section" aria-pressed="false">Bahasa daerah</button><button data-section="challenge-section" aria-pressed="false">Tantangan</button></nav><div class="section detail-body"><article class="story" id="story-section"><div class="reading-toolbar"><div class="eyebrow" id="reading-label">BUKU CERITA / BACAAN INDONESIA</div><div class="language-switch" role="group" aria-label="Bahasa cerita"><button class="language active" data-lang="id" aria-pressed="true" type="button">Indonesia</button><button class="language" data-lang="en" ${r.translations?.en ? 'aria-pressed="false"' : 'aria-disabled="true" aria-describedby="translation-note"'} type="button">English ${r.translations?.en ? '' : '<span>Segera</span>'}</button></div></div><p id="translation-note" class="translation-note">${r.translations?.en ? 'Pilih bahasa untuk membaca cerita, fakta, dan tantangan.' : 'Terjemahan English belum tersedia. Cerita ditampilkan dalam bahasa Indonesia.'}</p><div class="eyebrow">RUANG CERITA</div><h2>Dengarkan kisah dari Nusantara</h2><p class="notice">${r.contentNote?escapeHTML(r.contentNote):['papua','sulawesi-selatan'].includes(r.id)?'Materi lengkap menunggu peninjauan guru.':'Adaptasi ringkas untuk pembelajaran, bukan kutipan naskah asli. Versi cerita dapat berbeda. Sumber edisi dan peninjauan guru belum dilengkapi.'}</p><div class="story-pages">${r.story.map(p=>`<p>${p}</p>`).join('')}</div><section class="reading-stamp-panel ${completed.includes(r.id)?'collected':''}" id="reading-stamp-panel" aria-labelledby="stamp-panel-title"><div class="reading-stamp-preview">${stampImage(r,'detail')}</div><div class="reading-stamp-copy"><div class="eyebrow">NUSANTARA EXPLORER PASSPORT</div><h3 id="stamp-panel-title">Selesaikan 3 Misi, Dapatkan 1 Stempel</h3><p id="stamp-panel-description">Dengarkan minimal 75% narasi anak, jelajahi bacaan sampai akhir selama minimal 25 detik, dan jawab kuis dengan benar. Ketika tiga misi selesai, stempel masuk otomatis!</p><p id="mission-counter" class="mission-counter" aria-live="polite">Misi selesai: ${missionCount(missionFor(r))}/3</p><progress id="mission-progress" class="mission-progress" max="3" value="${missionCount(missionFor(r))}" aria-label="Progres misi"></progress>${missionChecklist(r)}<p id="reading-stamp-status" class="reading-stamp-status" role="status" aria-live="polite">Selesaikan misi untuk membuka stempel otomatis.</p><a href="#paspor" class="text-link">Lihat Nusantara Explorer Passport →</a></div></section>${r.reference?`<a class="text-link" href="${r.reference.url}" target="_blank" rel="noopener noreferrer">Sumber pengenalan: ${r.reference.label} ↗</a>`:''}${r.sources?`<details class="source-note"><summary>Rujukan materi dalam dokumen pameran</summary><ul>${r.sources.map(source=>`<li>${escapeHTML(source)}</li>`).join('')}</ul></details>`:''}<section class="quiz" id="challenge-section" aria-labelledby="quiz-title"><div class="eyebrow">TANTANGAN PENJELAJAH</div><h3 id="quiz-title">${escapeHTML(r.question)}</h3><p class="notice">Misi 3 dari 3: jawab pertanyaan dengan benar. Stempel hanya akan terkumpul otomatis setelah audio, bacaan, dan kuis selesai semuanya.</p><div class="options">${r.options.map((o,i)=>`<button class="option" data-answer="${i}"><span aria-hidden="true">${String.fromCharCode(65+i)}.</span> <span class="option-label">${escapeHTML(o)}</span></button>`).join('')}</div><p class="feedback" role="status" aria-live="polite">${completed.includes(r.id)?'✓ Kamu sudah mendapatkan tanda daerah ini. Boleh mencoba lagi!':''}</p><a class="text-link" href="#paspor">Lihat paspor saya →</a></section><div class="next-region"><a href="#jelajah" class="text-link">← Semua daerah</a><a class="button" href="#daerah/${next.id}">${next.name} →</a></div></article><aside aria-label="Materi pendamping"><section class="info-card" id="culture-section"><div class="eyebrow">PANEL MUSEUM / CATATAN DAERAH</div><h3>Mengenal lebih dekat</h3><p><strong>Wilayah dalam pameran</strong><br>${r.name} · ${r.island}</p><p class="panel-caption">Penanda lokasi mengikuti peta skematis pameran, bukan batas administratif.</p>${r.language?`<p id="region-language">${escapeHTML(r.language)}</p>`:'<p><strong>Bahasa daerah</strong><br>Materi dan pelafalan menunggu verifikasi guru atau narasumber.</p>'}${r.culture?`<p id="region-culture"><strong>${escapeHTML(r.cultureHeading || 'Penjelasan geografi / Geography')}</strong><br>${escapeHTML(r.culture)}</p>`:'<p><strong>Fakta budaya</strong><br>Materi bersumber sedang dipersiapkan. Kami tidak menambahkan fakta yang belum diverifikasi.</p>'}</section><section class="info-card"><div class="eyebrow">BAGIKAN PERJALANAN</div><h3>Satu tautan, satu daerah</h3><label for="region-link" class="placeholder-label">Tautan untuk QR stan</label><input id="region-link" class="share-input" readonly aria-label="Tautan langsung daerah"><button id="copy" class="button">Salin tautan ↗</button><p>Gunakan tautan ini pada pembuat QR pilihan sekolah. QR akan langsung membuka daerah ini.</p></section></aside></div><section class="guestbook-section" aria-labelledby="guestbook-title"><div class="guestbook-intro"><div class="eyebrow">BUKU KESAN PENGUNJUNG · ${escapeHTML(r.name.toUpperCase())}</div><h2 id="guestbook-title">Tinggalkan Jejak Ceritamu ✦</h2><p id="guestbook-caption">Apa kesanmu setelah membaca atau mendengarkan ${escapeHTML(r.title)}? Tulis pesan dengan nama panggilan. Pesan yang disetujui pengelola dapat dibaca penjelajah lainnya.</p><p class="guestbook-privacy">Jangan tulis nama lengkap siswa, nomor telepon, email, atau informasi pribadi. Gunakan bahasa yang sopan.</p></div><div class="guestbook-paper"><div id="fastcomments-widget"></div><p id="guestbook-status" class="guestbook-status" role="status">Memuat buku kesan pengunjung…</p></div></section>`;
 mountComments(r);
 beginMissionTracking(r);
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
   const heading=document.createElement('strong'); heading.textContent=data.cultureHeading || (language === 'en' ? 'Geographic explanation' : 'Penjelasan geografi');
   geography.append(heading,document.createElement('br'),document.createTextNode(data.culture));
  }
  document.querySelector('#quiz-title').textContent=data.question || r.question;
  document.querySelectorAll('.option-label').forEach((el,i) => {el.textContent=(data.options || r.options)[i] || '';});
  const quizFeedback=document.querySelector('.feedback');
  quizFeedback.textContent=completed.includes(r.id) ? (language === 'en' ? '✓ Your stamp is already collected.' : '✓ Tanda daerah ini sudah terkumpul.') : '';
  quizFeedback.classList.remove('quiz-feedback-correct','quiz-feedback-incorrect');
  const guestbookLabel = document.querySelector('#guestbook-title');
  const guestbookCaption = document.querySelector('#guestbook-caption');
  if (guestbookLabel) guestbookLabel.textContent = language === 'en' ? 'Leave Your Story Footprint ✦' : 'Tinggalkan Jejak Ceritamu ✦';
  if (guestbookCaption) guestbookCaption.textContent = language === 'en' ? 'What did you think of this story? Use a nickname and leave a kind message. Comments approved by the organizer may be seen by other visitors.' : `Apa kesanmu setelah membaca atau mendengarkan ${r.title}? Tulis pesan dengan nama panggilan. Pesan yang disetujui pengelola dapat dibaca penjelajah lainnya.`;
  refreshMissionPanel(r,language);
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
  const selectedIndex=Number(btn.dataset.answer);
  const language=document.documentElement.lang==='en'?'en':'id';
  const explanations=language==='en'?r.translations?.en?.quizExplanations:r.quizExplanations;
  const explanation=explanations?.[selectedIndex] || (correct?'Jawaban tepat.':'Pilihan ini belum menjawab pertanyaan. Coba lagi.');
  feedback.classList.toggle('quiz-feedback-correct',correct);
  feedback.classList.toggle('quiz-feedback-incorrect',!correct);
  if(!correct){
    feedback.textContent=(language==='en'?'Not quite. ':'Belum tepat. ')+explanation+' '+(language==='en'?'Try another answer.':'Coba pilihan lain.');
    return;
  }
  const m=missionFor(r);
  m.quiz=true;
  saveMissions();
  const newlyEarned=awardStampIfReady(r);
  refreshMissionPanel(r);
  const missionStatus=newlyEarned
    ?(language==='en'?'All three missions are complete. Your stamp was automatically added to the passport!':'Ketiga misi sudah selesai dan stempel otomatis masuk ke paspormu!')
    :completed.includes(r.id)
      ?(language==='en'?'Your stamp is already in the passport.':'Stempel sudah ada di paspormu.')
      :(language==='en'?'Quiz mission complete. Finish the audio and reading missions to collect the stamp.':'Misi kuis selesai. Lengkapi audio dan bacaan untuk mendapatkan stempel.');
  feedback.textContent=explanation+' '+missionStatus;
  if(!storageAvailable) feedback.textContent+=language==='en'?' Progress is only available while this page is open.':' Progres hanya tersedia selama halaman ini terbuka.';
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
