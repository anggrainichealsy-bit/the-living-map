# Sistem background parchment & ombak

Tema berada di `backgrounds.css`, dimuat setelah `styles.css`. Tidak ada perubahan markup di body, JavaScript aplikasi, isi cerita, peta, audio, atau penyimpanan paspor. `index.html` hanya menambahkan satu link stylesheet berversi.

## Lapisan dan aset

- `paper-grain.svg`: serat/noise halus yang berulang dalam tile 180 px, dibuat di kode. Noise statis dengan seed tetap dan alpha rendah; bukan efek yang dianimasikan.
- `paper-filigree.svg`: motif lengkung abstrak, tipis dan ber-opacity rendah. Dibuat di kode sebagai ornamen dekoratif, bukan klaim motif tradisional daerah tertentu.
- `blue-wave-corner.webp`: ornamen ombak biru transparan 1254 × 1254, sekitar 251 KiB, dibuat dengan bantuan AI berdasarkan referensi visual pengguna. Sumber PNG tetap di luar checkout pada lingkungan pembuatan. Tidak memakai gambar stok tambahan.

Warna dan aset bersama didefinisikan sebagai CSS custom properties `--paper-base`, `--paper-raised`, `--paper-inset`, `--paper-rule`, `--paper-grain`, `--paper-filigree`, `--wave-corner`, `--wave-opacity`, dan `--wave-size`.

Latar body memakai grain, motif abstrak, serta sapuan cahaya krem. Kedua pseudo-element body menempatkan ombak di sudut kiri atas dan kanan bawah (diputar 180°). Keduanya berada di belakang konten, tanpa pointer events dan tanpa animasi. Gambar ombak memakai `contain` sehingga rasio tidak berubah; mask menghilangkan ornamen sebelum masuk jauh ke tengah halaman. Tidak ada `overflow-x: hidden` untuk menutupi masalah layout.

Bingkai atlas, kartu, kertas cerita, panel audio, transkrip dan panel budaya memakai permukaan paper yang tenang. Bagian paspor menggunakan tint parchment yang lebih lembut, sementara cover hijau tetap dipertahankan dengan grain ringan. Hero detail menggunakan warna parchment yang sama di gradasi belakang judul. Ilustrasi utama dan raster peta tidak ditimpa tekstur.

## Mobile dan aksesibilitas

Di bawah 760 px, motif abstrak body dan paspor dihilangkan; ukuran ombak menjadi 155 px, opacity turun dari 0.25 menjadi 0.14, dan mask lebih pendek. Hanya grain halus yang dipertahankan pada bidang utama. Tidak ada elemen dekoratif yang memperlebar dokumen atau menutupi tombol. Dekorasi bersifat CSS dan tidak menambah isi pada accessibility tree. Versi print menyembunyikan ombak.

Palet teks utama tetap. Warna teks sekunder pada paragraf dan panel dibuat lebih gelap untuk keterbacaan di atas paper. Tes memeriksa rasio kontras paragraf terhadap warna paper dasar minimal 4.5:1; angka ini tidak mengklaim pemeriksaan seluruh komposisi gambar atau semua piksel ornamental.

## Verifikasi

Tes `tests/backgrounds.cjs` memeriksa homepage dan keenam detail pada 320/375/390/430/1440 px, kesamaan DOM/layout jika disediakan baseline, pemakaian tekstur bersama, tidak ada overflow, dekorasi noninteraktif, transparansi aset ombak, dan keterbacaan paragraf. `SCREENSHOT_DIR` opsional menyimpan preview homepage, detail, paspor dan peta untuk desktop/mobile. `tests/browser.cjs` tetap memeriksa audio nyata, bilingual, tantangan, paspor, deep link, dan interaksi peta.
