<p align="center">
  <img src="icons/icon-192.png" alt="Ikon Ritme Harian" width="96">
</p>

# Ritme Harian

Aplikasi jadwal tugas harian yang simpel. Atur tiap tugas dari jam sekian sampai jam sekian, lihat tugas yang sedang berjalan lengkap dengan hitung mundur, dan dapat pemberitahuan setiap kali satu tugas selesai dan berganti ke tugas berikutnya.

Satu halaman web, tanpa framework, tanpa server, tanpa proses build. Bisa dibuka langsung, dan bisa dipasang seperti aplikasi biasa.

<p align="center">
  <img src="screenshots/hp-terang.png" alt="Tampilan di HP, mode terang" width="250">
  <img src="screenshots/notifikasi.png" alt="Notifikasi saat tugas berganti" width="250">
  <img src="screenshots/hp-gelap.png" alt="Tampilan di HP, mode gelap" width="250">
</p>

![Tampilan di desktop](screenshots/desktop.png)

## Fitur

- Tiap tugas punya jam mulai dan jam selesai
- Tugas bisa diulang setiap hari atau hanya di hari tertentu
- Kartu "Sedang berjalan" dengan hitung mundur dan cincin progres
- Pemberitahuan saat tugas selesai dan berganti: banner di layar, nada singkat, getar di HP yang mendukung, dan notifikasi sistem saat tab ada di latar
- Peringatan kalau jam sebuah tugas bentrok dengan tugas lain
- Jeda antar tugas ditampilkan di daftar
- Pilihan warna per tugas dan tombol durasi cepat (15 menit, 30 menit, 1 jam, 2 jam)
- Bisa dipasang sebagai aplikasi dan tetap terbuka tanpa internet
- Mode terang dan gelap mengikuti pengaturan perangkat
- Label zona waktu WIB, WITA, atau WIT sesuai perangkat
- Data tersimpan di browser (localStorage) dan tidak dikirim ke mana pun

## Cara pakai

1. Buka `index.html`, atau alamat GitHub Pages-nya.
2. Tekan **Tambah tugas**, isi nama, jam mulai, dan jam selesai, lalu **Simpan**.
3. Ketuk sebuah tugas untuk mengubah atau menghapusnya. Hapus butuh dua kali ketuk supaya tidak kepencet.
4. Tombol lonceng di kanan atas mengatur bunyi dan notifikasi browser, punya tombol **Coba notifikasi**, dan tombol **Pasang** kalau browser mendukung.
5. Biarkan aplikasi tetap terbuka supaya pemberitahuan muncul tepat waktu.

Saat pertama dibuka, jadwal yang tampil adalah contoh. Tekan **Kosongkan contoh** lalu isi jadwalmu sendiri.

## Pasang sebagai aplikasi

Ritme Harian bisa dipasang dengan ikon di layar utama, jendela sendiri tanpa bilah alamat, dan tetap bisa dibuka tanpa internet setelah kunjungan pertama. Ini butuh alamat `https`, jadi pakai alamat GitHub Pages (atau `localhost`), bukan file yang dibuka langsung dari folder.

- **Android (Chrome):** buka alamatnya, ketuk menu titik tiga, lalu **Pasang aplikasi** atau **Tambahkan ke layar utama**. Bisa juga lewat tombol **Pasang** di panel lonceng.
- **iPhone atau iPad (Safari):** ketuk **Bagikan**, lalu **Tambah ke Layar Utama**.
- **Komputer (Chrome atau Edge):** klik ikon pasang di ujung kanan bilah alamat, atau tombol **Pasang** di panel lonceng.

Memasang aplikasi tidak membuat pengingat berjalan di latar. Aplikasinya tetap harus terbuka agar pemberitahuan muncul.

## Menjalankan di komputer sendiri

Tidak perlu install apa pun. Klik dua kali `index.html`. Kalau mau mencoba fitur pasang dan offline, jalankan lewat server lokal:

```bash
python3 -m http.server 8000
```

lalu buka http://localhost:8000.

## Pasang di GitHub Pages

1. Buat repository baru di GitHub, misalnya `ritme-harian`.
2. Upload semua isi folder ini ke repository tersebut, termasuk folder `icons` dan `screenshots`.
3. Buka **Settings**, lalu **Pages**. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu satu sampai dua menit. Alamatnya: `https://USERNAME.github.io/ritme-harian/`

Lewat terminal:

```bash
git init
git add .
git commit -m "Versi pertama Ritme Harian"
git branch -M main
git remote add origin https://github.com/USERNAME/ritme-harian.git
git push -u origin main
```

Ganti `USERNAME` dengan nama akun GitHub kamu.

## Yang perlu diketahui

- Pengingat hanya berjalan selama aplikasi atau halamannya terbuka. Kalau ditutup, atau layar HP mati sampai browser membekukan halaman, tidak ada pemberitahuan.
- Browser bisa menunda timer di tab yang lama berada di latar, jadi pemberitahuan kadang terlambat sampai sekitar satu menit.
- Nada baru bisa berbunyi setelah halaman disentuh atau diklik sekali.
- Notifikasi sistem butuh izin dari kamu dan alamat `https`. Notifikasinya dikirim lewat service worker, cara yang dipakai Chrome Android. Kalau izin ditolak, banner di dalam aplikasi tetap muncul.
- Jadwal tersimpan per browser. Browser atau perangkat lain punya jadwal sendiri.

## Struktur

```
index.html             seluruh aplikasi (HTML, CSS, JavaScript)
manifest.webmanifest   data untuk pemasangan: nama, ikon, warna
sw.js                  service worker: menyimpan file supaya bisa offline
pwa.js                 daftar service worker, tombol Pasang, notifikasi sistem
icons/                 ikon aplikasi (SVG dan PNG)
screenshots/           gambar untuk README
```

## Mengubah tampilan

Warna dan font ada di blok `:root` di awal `<style>` pada `index.html`. Warna untuk mode gelap ada di dua blok setelahnya. Jadwal contoh dibuat oleh fungsi `sample()` di bagian script.

Ikon sumbernya `icons/icon.svg`. Kalau diubah, ekspor ulang ke PNG dengan ukuran yang sama dengan file di folder `icons` (192, 512, maskable 512, 180, dan 32).

Setelah mengubah file aplikasi, naikkan nomor `CACHE` di `sw.js` (misalnya `ritme-v2`) supaya perangkat yang sudah memasang aplikasi mengambil versi baru.

## Ide pengembangan

- Pengingat lima menit sebelum tugas selesai
- Menjaga layar tetap menyala selama aplikasi terbuka, supaya pengingat tidak berhenti saat layar HP mati
- Ekspor dan impor jadwal sebagai file JSON
