# Peta dongeng Indonesia

`indonesia-storybook.webp` adalah satu artwork raster, **1672 × 941**, sekitar **557 KiB**. Gambar dibuat dengan bantuan AI menggunakan peta referensi yang diberikan pengguna sebagai arahan gaya; tidak memakai gambar stok pihak lain. Sumber PNG yang dihasilkan tetap disimpan di luar checkout pada lingkungan pembuatan. Website hanya membutuhkan WebP yang di-commit.

Keenam adegan dilukis menyatu pada lanskap: danau dan ikan emas Toba, perahu terbalik Sangkuriang, ibu-anak dan batu, kapal pelayaran Sawerigading, putri di pesisir Lombok, serta cenderawasih untuk kisah Queya/Kweiya. Semua kelompok pulau termasuk Bali/Nusa Tenggara, Maluku, dan Papua tampil di satu bidang. Artwork menggunakan proporsi dan adegan imajinatif; bukan peta batas administratif, alat navigasi, atau rekonstruksi sejarah/busana.

## Hotspot

Posisi didefinisikan di fungsi `map()` dalam `app.js`. Koordinat adalah persentase dari gambar lengkap, bukan piksel layar:

| Tujuan / hash lama | X | Y |
| --- | ---: | ---: |
| `#daerah/sumatra-utara` | 15% | 38% |
| `#daerah/jawa-barat` | 25% | 68% |
| `#daerah/kalimantan-barat` | 32% | 43% |
| `#daerah/sulawesi-selatan` | 51% | 54% |
| `#daerah/nusa-tenggara-barat` | 51% | 77% |
| `#daerah/papua` | 77% | 45% |

Gambar ditampilkan dengan `width: 100%` dan rasio asli; tidak memakai crop, object-fit cover, pan, atau min-width untuk peta. Layer hotspot memakai bidang yang sama sehingga titik tetap sejajar saat layar berubah. Pada HP, penanda berukuran 32 px; daftar pendamping enam destinasi menyediakan target sentuh minimal 58 px. Daftar bukan pengganti gambar dan hanya tampil pada lebar sampai 760 px. Semua hotspot adalah tautan biasa yang mendukung keyboard dan label aksesibel.

Jika artwork diganti, sesuaikan atribut width/height, aspect-ratio komponen, dan koordinat hotspot bersama-sama. Jangan mengganti ID daerah: hash QR serta progres localStorage menggunakan ID tersebut. Nama Queya pada peta mengikuti arahan redesign; isi halaman tetap menggunakan ejaan Kweiya dari dokumen materi yang sebelumnya diberikan.

## Catatan kapal dan verifikasi budaya

Kapal adalah interpretasi artistik siluet kapal layar Nusantara dua tiang, bukan klaim bentuk kapal Sawerigading dalam epos La Galigo. Dokumen Sawerigading dari pengguna menyebut tradisi pinisi dan pengakuan UNESCO 2017, tetapi tidak menyediakan rujukan konstruksi/rig yang rinci. Akses ke halaman UNESCO resmi berikut dicoba saat pengerjaan, tetapi proxy lingkungan menolak koneksi (CONNECT 403):

https://ich.unesco.org/en/RL/pinisi-art-of-boatbuilding-in-south-sulawesi-01197

**Verifikasi budaya detail desain kapal belum selesai.** Minta tinjauan guru/narasumber maritim sebelum menyebut ilustrasi ini sebagai penggambaran kapal yang autentik secara teknis. Pernyataan artistik ini tidak menggantikan verifikasi tersebut.
