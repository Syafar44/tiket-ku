# EventKu

Web pendaftaran workshop gratis dari satu Google Student Ambassador (GSA) di UMKT, Samarinda. Tampilannya mobile-first seperti aplikasi tiket, tetapi alurnya:

**Jelajahi event → Detail → Daftar → Berhasil terdaftar → Datang ke acara → Isi presensi resmi di akhir sesi**

Dibuat dengan Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Zustand, zod, dan lucide-react. Data event dan pendaftaran tersimpan di **Google Spreadsheet** lewat Google Apps Script Web App.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi SHEETS_API_URL & SHEETS_API_TOKEN
npm run dev        # http://localhost:3000
npm run build      # build production
npm start          # jalankan hasil build
npm run lint
```

Tampilan dirancang untuk lebar 393px. Di desktop, aplikasi tampil di tengah layar seperti HP.

## Aturan produk

- Semua event gratis dan terbuka untuk semua mahasiswa. Tidak ada kuota, tidak ada login, tidak ada QR check-in.
- Form daftar hanya **Nama lengkap** dan **Program studi**. Jika "Ingat data saya" dicentang, data disimpan di perangkat (localStorage) dan mengisi form berikutnya otomatis.
- Satu event hanya bisa didaftar sekali per perangkat.
- Presensi resmi diisi lewat Google Form GSA setelah sesi selesai. Halaman tiket menyediakan data yang bisa disalin (Nama GSA, Judul Acara, GSA ID, Event ID).
- Semua waktu memakai zona **Asia/Makassar (WITA)**, tidak bergantung zona perangkat.

## Halaman

| Route | Isi |
|---|---|
| `/` | Beranda: banner, chip kategori, carousel & grid event yang belum selesai |
| `/jelajah` | Semua event (akan datang dulu, lalu yang selesai) + pencarian |
| `/event/[slug]` | Detail event + sheet **Daftar Event** |
| `/event/[slug]/berhasil` | Konfirmasi "Kamu terdaftar!" |
| `/tiket` | Tiket Saya: tab Akan Datang / Riwayat (rating) |
| `/tiket/[id]` | Detail tiket: hitung mundur, lokasi, lalu **Presensi Resmi** setelah sesi selesai |

## Data dari Google Spreadsheet

| Env (server saja) | Isi |
|---|---|
| `SHEETS_API_URL` | URL Web App Apps Script, mis. `https://script.google.com/macros/s/XXXX/exec` |
| `SHEETS_API_TOKEN` | Token yang dicek oleh Apps Script |

Jangan beri prefix `NEXT_PUBLIC_`: token hanya dipakai di server (`lib/sheets.ts` memakai `import "server-only"`).

**Alur data**

- **Baca:** `lib/sheets.ts` → `GET ?action=events` (cache 60 detik, tag `sheets`, batas waktu 8 detik, divalidasi zod) → `getEvents()` / `getEventBySlug()` / `getSiteConfig()` di `lib/data.ts`. Komponen tidak membaca spreadsheet langsung.
- **Daftar:** form → `submitRegistration()` (`lib/registration.ts`) → `POST /api/register` → Apps Script `action: "register"`. Pendaftaran baru disimpan di perangkat **setelah** spreadsheet menjawab sukses. `registrationId` (UUID) dibuat sebelum kirim, jadi klik ganda tidak membuat baris dobel. Setelah sukses, cache `sheets` di-revalidate dan angka pendaftar di layar langsung naik.
- **Rate limit:** `/api/register` menerima maks 10 request/menit per IP (in-memory, per instance server).

**Kalau spreadsheet bermasalah** (env kosong, timeout, error, data tidak valid): web tetap jalan memakai data lokal `data/events.ts` + `lib/config.ts`, dan server mencetak satu `console.error`. Event yang barisnya tidak valid dilewati (dicatat di log), event lain tetap tampil. Selama fallback, pendaftaran tidak bisa dikirim (muncul toast gagal).

### Mengganti data

Edit spreadsheet (tab Events / config). Perubahan tampil di web **sekitar 1 menit** kemudian, tanpa redeploy.

| Yang diganti | Tempat |
|---|---|
| Event, nama GSA, GSA ID, peran, kota, pilihan prodi | Spreadsheet |
| Data cadangan saat spreadsheet tidak bisa diakses | `data/events.ts`, `lib/config.ts` |
| Label "GSA UMKT", kategori event | `lib/config.ts` |
| Banner promo | `data/promos.ts` |
| Nomor WhatsApp bantuan | `lib/constants.ts` |

Field event lengkap ada di `lib/types.ts` (kategori harus salah satu dari `EVENT_CATEGORIES`; `startAt`/`endAt` ISO dengan offset `+08:00`). Link opsional per event: `presenceFormUrl` (Google Form presensi), `waGroupUrl` (grup WhatsApp), `materialsUrl` (materi). Jika kosong, UI menampilkan teks pengganti.

**Gambar poster/banner event (kolom `posterUrl`).** Upload gambar ke Cloudinary, lalu tempel link langsungnya di kolom `posterUrl` tab Events, mis. `https://res.cloudinary.com/<cloud-name>/image/upload/v1700000000/eventku/riset-cerdas.jpg` (klik kanan gambar → *Copy image address*, atau tombol *Copy URL* di Media Library). Gambar dipakai di hero halaman detail, carousel, grid, dan tiket; kalau kosong atau link-nya bukan dari `res.cloudinary.com`, poster kembali ke gradien + judul (dicatat di log server). Saran ukuran: portrait 3:4, minimal 800×1067 px, teks penting di tengah (hero detail memotong bagian atas & bawah). Host gambar lain perlu ditambahkan di `next.config.ts` (`images.remotePatterns`) dan `IMAGE_HOSTS` di `lib/sheets.ts`. Pilihan prodi "Lainnya" (input teks bebas) selalu ditambahkan otomatis di akhir.

## Deploy (Vercel)

1. Settings → Environment Variables: isi `SHEETS_API_URL` dan `SHEETS_API_TOKEN` (Production, dan Preview kalau perlu).
2. Redeploy supaya env terbaca.

## Penyimpanan di perangkat

| Key localStorage | Isi |
|---|---|
| `eventku-profile` | Nama & prodi terakhir (jika "Ingat data saya" dicentang) |
| `eventku-registrations` | Daftar pendaftaran + rating |
| `eventku-saved` | Event yang disimpan (ikon hati) |

Data versi lama (`eventku-orders`, `eventku-cart`, `eventku-prefs`) otomatis dipindahkan sekali lalu dihapus (`lib/legacyStorage.ts`).
