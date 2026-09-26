# Happy Birthday Ceyya 💗

Website ucapan ulang tahun — tema pink, ada kado yang bisa dibuka,
slideshow 5 foto, efek hati melayang, teks ngetik sendiri (ada suara
"tik") dan lagu yang auto-play.

## Struktur file

```
ceyya-birthday/
├── index.html   -> struktur halaman
├── style.css    -> semua tampilan/animasi
├── script.js    -> semua logika (jangan diubah kalau gak perlu)
├── config.js    -> SATU-SATUNYA file yang perlu kamu edit
└── README.md
```

## 1. Isi `config.js`

Buka `config.js`, lalu:

- **photos** — isi 5 link foto dari Catbox. Link-nya harus link
  *langsung* ke file gambar (biasanya diawali `https://files.catbox.moe/...`
  dan diakhiri `.jpg` / `.png`), bukan link ke halaman Catbox.
- **musicUrl** — isi 1 link lagu dari Catbox (link langsung, diakhiri `.mp3`).
- **message** — ganti isi ucapannya sesuka hati. Panjang bebas.

## 2. Coba dulu di komputer (opsional)

Tinggal buka `index.html` langsung di browser juga sudah jalan.
Kalau mau lebih rapi, jalankan server lokal sederhana di folder ini:

```
npx serve .
```

## 3. Upload ke Vercel

Paling gampang:

1. Buka https://vercel.com/new
2. Pilih **"Deploy"** lalu drag-and-drop seluruh folder `ceyya-birthday`
   (atau upload lewat "Browse").
3. Vercel otomatis mendeteksi ini sebagai static site — gak perlu isi
   build command apa-apa, langsung klik **Deploy**.

Atau lewat CLI:

```
npm i -g vercel
cd ceyya-birthday
vercel
```

## Catatan

- Kalau lagu tidak otomatis bunyi di sebagian browser (kebijakan
  autoplay), akan muncul tombol kecil "putar lagu 🎵" sebagai cadangan.
- Alur: buka kado → 5 foto bergantian (5 detik/foto, total 25 detik) →
  foto mengecil turun → kotak pesan muncul dengan efek ngetik → lagu
  main otomatis dan akan terus mengulang.
