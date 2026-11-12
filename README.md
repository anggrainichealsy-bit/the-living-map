# THE LIVING MAP — Indonesia Bercerita

Website pameran edukatif interaktif Open House **14 November 2026**.
Tema: **Beragam Bahasa, Berjuta Kisah, Satu Indonesia**.

HTML, CSS, JavaScript murni. Tidak membutuhkan backend, instalasi npm, atau API key. Semua ilustrasi SVG dibuat untuk situs ini dan tersimpan lokal; tidak ada font/CDN eksternal.

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
| Papua | `#daerah/papua` |

## Mengganti materi pameran

Edit data daerah dalam **content.js**:

- `story`: paragraf cerita. Empat legenda ditulis sebagai adaptasi ringkas dengan peringatan perbedaan versi. Lengkapi sumber edisi dan tinjauan guru sebelum dipakai sebagai materi resmi. Sawerigading baru pengenalan dengan referensi UNESCO; episode lengkap dan cerita Papua masih placeholder.
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
- `translations.en`: slot data terjemahan, saat ini `null`. Tombol English menjelaskan bahwa terjemahan belum tersedia; belum mengganti cerita. Jangan menambahkan terjemahan tanpa materi yang disetujui tim. Implementasi pembacaan data English merupakan langkah berikutnya setelah materinya tersedia.
- Dukungan `audio`, pemutar asli browser, pesan gagal memuat, tantangan, dan progres paspor tetap menggunakan mekanisme sebelumnya.
