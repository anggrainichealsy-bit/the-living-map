# THE LIVING MAP — Indonesia Bercerita

Website pameran edukatif interaktif Open House **14 November 2026**.
Tema: **Beragam Bahasa, Berjuta Kisah, Satu Indonesia**.

HTML, CSS, JavaScript murni. Tidak membutuhkan backend, instalasi npm, atau API key. Ilustrasi tersimpan lokal; tidak ada font/CDN eksternal. Edisi painterly menggunakan gambar WebP dengan SVG sebagai fallback.

## Jalankan lokal

```sh
cd /workspace/the-living-map
python3 -m http.server 8000
```

Buka server tersebut melalui browser lokal untuk pengembangan. Berkas juga dapat disajikan oleh server statis lain.

## Publikasi GitHub Pages

1. Gabungkan Pull Request ke `main` melalui **Merge pull request → Confirm merge**.
2. Di GitHub buka **Settings → Pages → Build and deployment**.
3. Pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu deployment Pages selesai. Alamat standar: `https://anggrainichealsy-bit.github.io/the-living-map/`.

Tidak diperlukan build. `.nojekyll` menyajikan berkas statis langsung. Hash routing membuat tautan langsung tetap bekerja pada subdirektori GitHub Pages dan ketika dimuat ulang.

## Tautan QR stan

Gunakan tombol **Salin tautan** pada halaman daerah setelah situs terbit. Buat QR dari tautan tersebut dengan alat pilihan sekolah; situs tidak mengirim data ke layanan QR.

| Daerah | Akhiran tautan setelah `/the-living-map/` |
| --- | --- |
| Sumatra Utara | `#daerah/sumatra-utara` |
| Jawa Barat | `#daerah/jawa-barat` |
| Kalimantan Barat | `#daerah/kalimantan-barat` |
| Sulawesi Selatan | `#daerah/sulawesi-selatan` |
| Nusa Tenggara Barat | `#daerah/nusa-tenggara-barat` |
| Papua Barat (Fakfak) | `#daerah/papua` |

## Mengganti materi pameran

Edit data daerah dalam **content.js**:

- `story`: paragraf cerita. Materi enam daerah kini mencakup cerita Indonesia dan English yang diberikan tim pameran. Pertahankan penanda perbedaan versi dan rujukan dokumen; tinjau materi bersama guru sebelum dipakai sebagai materi resmi.
- `language`, `culture`: isi teks yang sudah diverifikasi; nilai `null` menampilkan placeholder. Cantumkan sumber/narasumber dalam teks. Jangan menyamaratakan bahasa dan tradisi satu wilayah.
- `audio`: ganti `null` dengan `'assets/audio/sumatra-utara.mp3'`, misalnya. Buat folder `assets/audio/` dan unggah rekaman siswa berizin dengan nama yang sama. Pemutar HTML audio akan muncul otomatis. Jangan gunakan `autoplay`.
- `question`, `options`, `answer`: pertanyaan, tiga pilihan, dan indeks jawaban benar mulai dari **0**. Sesuaikan ketika cerita diganti.
- `reference`: objek `{label: 'Judul sumber', url: 'https://...'}` untuk tautan sumber.

Ilustrasi bersifat imajinatif, bukan dokumentasi tempat. Peta skematis bukan peta administratif atau alat navigasi. Tidak ada audio tiruan atau rekaman siswa palsu.

## Paspor

Jawaban benar memberikan satu tanda unik per daerah. Setelah minimal tiga daerah, ucapan selamat tampil. Progres disimpan dengan kunci `living-map-passport-v1` di `localStorage`, tanpa identitas atau data pribadi. Tidak tersinkron antarperangkat. Pada perangkat bersama, gunakan **Atur ulang paspor perangkat ini** untuk pengunjung berikutnya. Jika penyimpanan diblokir, situs tetap berjalan dengan progres sementara.

## Pemeriksaan sebelum Open House

- Tinjau versi cerita dan lengkapi sumber, bahasa, serta materi budaya bersama guru/narasumber.
- Tambahkan rekaman siswa dan coba pemutar pada HP.
- Pindai enam QR yang menggunakan alamat situs **terbit**, bukan alamat server pengembangan.
- Coba jawaban salah/benar, tiga tanda, reload, tombol kembali, dan reset paspor.
- Situs dapat dipakai tanpa audio; placeholder menjelaskan materi yang belum tersedia.

## Desain pameran dan persiapan bilingual

Revisi visual mempertahankan rute dan kunci localStorage yang sama. Homepage terdiri dari atlas interaktif, Koleksi Cerita, paspor perjalanan, dan Tentang Pameran. Pada HP peta dapat digeser mendatar; keenam kartu juga menyediakan akses ke setiap daerah.

- `illustration`: path gambar final (misalnya `assets/ilustrasi/toba.webp`); isi `illustrationAlt` dengan deskripsi gambar. Jika kosong, SVG simbolis per cerita tampil otomatis. Motif tersebut merupakan placeholder artistik, bukan rekonstruksi sejarah atau busana budaya.
- `summary`: ringkasan pada kartu galeri.
- `translations.en`: data cerita, bahasa daerah, panel geografi, dan tantangan English. Keenam daerah sudah memiliki materi dari tim; tombol Indonesia/English mengganti bacaan tanpa mengubah URL daerah atau rekaman audio. Gunakan `null` untuk materi baru yang belum memiliki terjemahan.
- Dukungan `audio`, pemutar asli browser, pesan gagal memuat, tantangan, dan progres paspor tetap menggunakan mekanisme sebelumnya.

## Atlas ilustratif — enam adegan cerita

Setiap daerah sekarang memiliki **aset SVG tersendiri** di `assets/illustrations/`. Aset yang sama muncul sebagai mini-adegan pada atlas, ilustrasi kartu galeri, dan hero besar pada halaman daerah:

| Aset | Komposisi visual |
| --- | --- |
| `sumatra-utara.svg` | Danau luas, pulau tengah, pegunungan, ikan emas, dan perahu |
| `jawa-barat.svg` | Gunung, kabut fajar, perahu kayu terbalik, dan pengelana |
| `kalimantan-barat.svg` | Hutan berlapis, jalan, siluet ibu-anak, dan batu bertetes air |
| `sulawesi-selatan.svg` | Kapal layar imajinatif terinspirasi siluet phinisi, senja, dan ombak |
| `nusa-tenggara-barat.svg` | Putri di pesisir, tebing, ombak, dan garis nyale simbolis |
| `papua.svg` | Cenderawasih bergaya imajinatif, hutan, sungai, dan pegunungan |

Ilustrasi adalah karya vector artistik untuk pengalaman membaca, **bukan sumber fakta, rekonstruksi busana, atau bukti historis**. Kapal pada Sawerigading adalah motif visual pelayaran, bukan klaim bentuk kapal dalam naskah. Cerita Papua Barat (Fakfak) kini memakai materi Kweiya dan ibunya yang diberikan tim. Semua SVG lokal, total sekitar 24 KB; tidak memakai layanan gambar atau CDN.

Ganti berkas SVG tersebut secara langsung, atau gunakan `illustration` dan `illustrationAlt` dalam `content.js`. Titik geografis dan mini-adegan sama-sama berupa tautan hash yang dapat dipakai dengan keyboard. Pada layar kecil, geser atlas mendatar atau gunakan daftar enam destinasi di bawah atlas. Kunci progres tetap `living-map-passport-v1`.

`index.html` memakai penanda versi pada URL CSS/JavaScript agar browser meminta aset revisi ini setelah deployment Pages. Perbarui penanda tersebut pada rilis selanjutnya jika kedua berkas berubah.

### Tes browser opsional

Tidak dibutuhkan untuk menjalankan situs. Dengan Node.js, Chromium, dan Playwright yang tersedia:

```sh
# Jalankan server situs di terminal pertama:
python3 -m http.server 8000

# Terminal kedua; instal alat uji di luar checkout jika belum tersedia:
npm install --prefix /tmp/living-map-checks --no-package-lock playwright
NODE_PATH=/tmp/living-map-checks/node_modules BASE_URL=http://127.0.0.1:8000/ node tests/browser.cjs
```

Tes menggunakan `/usr/bin/chromium` jika ada. Set `CHROMIUM_PATH` untuk lokasi Chromium lain; jika tidak ada, gunakan browser yang dipasang melalui Playwright. Pemeriksaan mencakup enam SVG berbeda, peta dengan keyboard/HP, progres lama, deep link, jawaban salah/benar, tanda unik, milestone tiga daerah, reload, reset, dan penyimpanan diblokir. Untuk menguji deployment pada subfolder, isi `BASE_URL` dengan alamat server yang menyajikan folder `/the-living-map/`.


## Edisi painterly / editorial

Homepage kini menggunakan headline editorial dan kolase tiga postcard (Toba, Sangkuriang, Mandalika). Atlas tetap tersedia di `#jelajah`. Kartu koleksi memakai gambar raster; hero detail menjadi gambar lebar dengan gradasi krem di belakang teks, panel audio di bawah hero, dan navigasi bagian **Cerita rakyat / Bahasa daerah / Tantangan**. Tombol bagian menggulir ke konten tanpa mengganti tautan hash daerah, sehingga tautan QR tetap utuh.

Enam ilustrasi WebP di `assets/artwork/` dibuat dengan bantuan AI sebagai interpretasi artistik imajinatif. Gambar bukan dokumentasi geografi, busana autentik, atau rekonstruksi sejarah; semua materi budaya tetap perlu sumber dan peninjauan guru. Kapal Sawerigading adalah motif pelayaran, bukan klaim bentuk kapal dalam naskah. Artwork Papua menjadi ilustrasi alam pendamping kisah Kweiya dari dokumen tim, bukan rekonstruksi adegan atau busana budaya. File PNG sumber disimpan di luar checkout pada lingkungan pembuatan; website hanya membutuhkan aset WebP yang sudah di-commit.

### Mengganti artwork

Dalam `content.js`, setiap daerah memiliki:

- `heroImage`: gambar utama hero detail dan postcard utama.
- `cardImage`: gambar kartu koleksi dan postcard pendukung.
- `thumbnailImage`: gambar mini pada atlas.
- `imageAlt`: deskripsi gambar dalam bahasa Indonesia untuk aksesibilitas.

Ketiga slot saat ini menunjuk ke satu WebP per daerah agar cache browser dapat digunakan ulang. Anda dapat mengarahkan tiap slot ke berkas berbeda. Gunakan path relatif, misalnya `assets/artwork/toba-hero.webp`, bukan path absolut `/assets/...`, agar kompatibel dengan subfolder GitHub Pages. Disarankan gambar landscape sekitar 1600 px, subjek di sisi kanan dan ruang suasana di kiri untuk hero dengan teks. Keenam WebP saat ini sekitar 1,7 MB total; SVG tetap tersedia sebagai fallback jika slot kosong atau gambar gagal dimuat.

`audio` tetap memakai path rekaman siswa seperti sebelumnya. Jika `null`, panel menampilkan status **Segera hadir** dan gelombang dekoratif tanpa tombol play palsu. Setelah file audio ditambahkan, pemutar native browser muncul otomatis, tanpa autoplay. Pilihan English tetap placeholder; tidak ada terjemahan baru yang ditambahkan.

Tes browser opsional sekarang juga memeriksa navigasi bagian tanpa mengubah URL daerah, pemutaran WAV sementara di panel baru, fallback gambar yang gagal, dan layout pada 320–1920 px. WAV fixture hanya dibuat dalam memori pengujian dan tidak dipublikasikan sebagai audio siswa.

## Materi Sangkuriang bilingual dan audio siswa

Halaman `#daerah/jawa-barat` memakai materi dari dokumen **The_Living_Map_Jawa_Barat_Sangkuriang_Bilingual.docx** yang disediakan tim pameran: tiga paragraf cerita Indonesia/English, penjelasan geografi, sapaan Sunda, serta pertanyaan tantangan. Pilihan jawaban kuis disusun dari perbandingan legenda dan vulkanisme dalam dokumen; dokumen aslinya menyediakan pertanyaan terbuka. Rujukan ditampilkan sesuai nama yang tercantum di dokumen, tanpa mengarang URL sumber.

Audio siswa **berbahasa Inggris** tersedia di `assets/audio/sangkuriang-english.mp3` (sekitar 1 menit 19 detik). File disalin tanpa perubahan dari unggahan. Pemutar diberi label English dan tidak memakai autoplay. Pergantian bahasa bacaan tidak mengubah audio menjadi bahasa lain. Naskah audio Indonesia dan English dari dokumen dapat dibuka pada panel **Naskah narasi siswa**; naskah Indonesia tidak berarti rekaman Indonesianya sudah tersedia.

Properti `contentNote`, `sources`, dan `audioTranscript` pada data daerah mendukung catatan materi, daftar rujukan, dan transkrip opsional. Semua cerita, geografi, bahasa daerah, serta pertanyaan bilingual tetap menggunakan mekanisme pergantian bahasa yang sama. Materi ini merupakan bahan yang diberikan tim, bukan klaim verifikasi independen atas sumber.

## Materi Batu Menangis bilingual dan audio siswa

Halaman `#daerah/kalimantan-barat` menggunakan dokumen **The_Living_Map_Kalimantan_Barat_Batu_Menangis_Bilingual.docx** dari tim pameran. Materinya mencakup kisah Darmi dalam Indonesia/English, penjelasan geografi, sapaan Melayu Pontianak, pertanyaan tantangan, dua naskah narasi, dan tiga rujukan sebagaimana dicantumkan dalam dokumen. Pilihan jawaban dibuat dari kutipan materi yang diberikan; jawaban lengkap menghubungkan sikap menghormati orang lain dengan perbedaan legenda dan penjelasan ilmiah pembentukan batuan.

Rekaman yang dikirim tersedia di `assets/audio/batu-menangis.mp3`, sekitar 1 menit 28 detik, disalin tanpa perubahan dari **Batu_Menangis_Narasi_Studio_Soundtrack_Sinematik.mp3**. Tersedia satu berkas audio; memilih English/Indonesia mengganti bacaan, bukan bahasa rekaman. Naskah kedua bahasa dapat dibuka pada bagian **Naskah narasi siswa**. Rujukan adalah daftar yang diberikan tim, bukan hasil verifikasi independen.

## Materi Sawerigading bilingual dan audio siswa

Halaman `#daerah/sulawesi-selatan` memakai **The_Living_Map_Sulawesi_Selatan_Sawerigading_Bilingual.docx** dari tim pameran. Cerita Indonesia/English, sapaan Bugis, geografi dan budaya, pertanyaan, naskah narasi, serta rujukan diambil dari dokumen. Pilihan jawaban menggunakan kutipan materi; jawaban lengkap menghubungkan pelayaran dalam kisah dengan peran laut bagi masyarakat pesisir.

Catatan tetap membedakan epos mitologis dari laporan perjalanan sejarah, serta mempertahankan keterangan bahwa **Cina adalah nama tempat dalam cerita**. Bagian lama yang menyebut episode masih menunggu materi telah diganti dengan materi yang disediakan. Rujukan ditampilkan sesuai dokumen, tanpa klaim verifikasi independen.

Rekaman siswa **bahasa Inggris** ada di `assets/audio/sawerigading-english.mp3`, sekitar 1 menit 15 detik, disalin tanpa perubahan dari **Sawerigading_Sulawesi_Selatan_Narasi_English_Studio_Cinematic.mp3**. Tombol Indonesia/English mengubah bacaan, bukan bahasa rekaman. Panel naskah menyediakan kedua versi dari dokumen. Properti opsional `cultureHeading` menampilkan judul Geografi dan budaya / Geography and culture tanpa mengubah halaman daerah lain.

## Materi Putri Mandalika bilingual dan audio siswa

Halaman `#daerah/nusa-tenggara-barat` menggunakan **The_Living_Map_Nusa_Tenggara_Barat_Putri_Mandalika_Bilingual.docx** dari tim pameran. Materi mencakup cerita Indonesia/English, geografi dan biologi nyale, istilah Sasak, pertanyaan tantangan, dua naskah narasi, dan tiga rujukan dari dokumen. Pilihan jawaban menggunakan kutipan materi: jawaban lengkap membedakan nyale dalam legenda dari penjelasan ilmiah tentang cacing laut, reproduksi, dan siklus bulan.

Penjelmaan sang putri tetap dijelaskan sebagai bagian legenda; uraian ilmiah ditempatkan terpisah. Rujukan ditampilkan sebagaimana diberikan tim, bukan klaim verifikasi independen. Rekaman di `assets/audio/putri-mandalika.mp3` disalin tanpa perubahan dari **Putri_Mandalika_Narasi_Studio_Soundtrack_Cinematic.mp3**, berdurasi sekitar 1 menit 16 detik, tanpa autoplay. Pergantian bahasa mengubah bacaan, bukan rekaman; naskah Indonesia dan English dapat dibuka pada panel naskah narasi.


## Materi Papua Barat (Fakfak) bilingual dan audio siswa

Destinasi ber-ID **papua** kini berjudul **Asal Mula Burung Cenderawasih — Kisah Kweiya dan Ibunya**, dengan label wilayah **Papua Barat (Fakfak)**. ID, tautan `#daerah/papua`, lokasi aset gambar, dan kunci tanda paspor tetap dipertahankan agar QR serta progres lama tetap berlaku. Judul mini atlas menjadi **Cenderawasih**, dan semua penanda materi Papua menyusul telah dihapus dari tampilan.

Materi dari **The_Living_Map_Papua_Barat_Fakfak_Cenderawasih_Bilingual.docx** meliputi cerita Indonesia/English, istilah Iha dalam versi Fakfak, geografi dan biologi habitat cenderawasih, pertanyaan tantangan, kedua naskah narasi, serta tiga rujukan sebagaimana ditulis dalam dokumen. Tantangan memakai pilihan dari isi dokumen untuk membedakan legenda perubahan menjadi burung dari keterangan ilmiah tentang satwa nyata dan kebutuhan habitatnya. Rujukan dan istilah ditampilkan sebagai materi yang diberikan tim, bukan hasil verifikasi independen atau klaim tradisi seluruh Papua.

Audio `assets/audio/papua-kweiya.mp3` disalin utuh dari **Papua_Queya_Narasi_Anak_Studio_Soundtrack_Cinematic.mp3**, sekitar 1 menit 3 detik, tanpa autoplay. Ejaan tokoh pada halaman mengikuti dokumen: **Kweiya**. Tersedia satu berkas rekaman; pilihan bahasa mengubah bacaan, bukan bahasa audio. Kedua naskah dapat dibuka di panel **Naskah narasi siswa**. Keenam destinasi sekarang memiliki bacaan bilingual dan audio siswa.
