# AVA Order Bot 🤖

Telegram Auto Order Bot untuk jualan produk digital — Production Ready, Multi-tenant SaaS.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.x-blue)](https://telegraf.js.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-purple)](https://prisma.io)

---

## 📋 Fitur

### User
- ✅ /start dengan banner & deskripsi toko
- ✅ Join channel validation (wajib join sebelum bisa pakai)
- ✅ Beli produk (browsing kategori → produk → checkout)
- ✅ Pembayaran: Saldo Internal, Paydisini, Pakasir
- ✅ Auto-deliver produk setelah bayar
- ✅ Riwayat transaksi
- ✅ Profil & saldo
- ✅ Deposit saldo
- ✅ Sistem referral dengan bonus
- ✅ Kode promo & voucher diskon

### Admin
- ✅ Kelola produk (tambah, edit, hapus, toggle)
- ✅ Kelola kategori
- ✅ Kelola stok (tambah, hapus, lihat)
- ✅ Kelola user (tambah/kurangi saldo, block)
- ✅ Statistik lengkap
- ✅ Broadcast teks & gambar
- ✅ Kelola voucher/promo
- ✅ Kelola channel wajib join
- ✅ Pengaturan toko (nama, deskripsi, banner, referral bonus)
- ✅ Log aktivitas

### Owner
- ✅ Full akses admin
- ✅ Tambah/hapus admin
- ✅ Backup database manual
- ✅ Auto backup harian
- ✅ Monitoring server
- ✅ Export data user & transaksi (CSV)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> ava_order_bot
cd ava_order_bot
npm install
```

### 2. Konfigurasi .env

```bash
cp .env.example .env
nano .env
```

Isi minimal:
```
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=postgresql://user:pass@localhost:5432/ava_order_bot
OWNER_IDS=your_telegram_id
WEBHOOK_URL=https://yourdomain.com
WEBHOOK_SECRET=random_string_here
```

### 3. Setup Database

```bash
# Buat database
createdb ava_order_bot

# Generate Prisma client & migrasi
npm run db:generate
npm run db:migrate

# Seed data awal
npm run db:seed
```

### 4. Jalankan Bot

```bash
# Development (polling mode)
npm run dev

# Production (webhook mode)
npm start
```

---

## 🌐 Deploy ke VPS

### Prasyarat
- VPS dengan Ubuntu 20.04+
- Domain dengan SSL (untuk webhook)
- Node.js 20+
- PostgreSQL 15+
- PM2
- Nginx (reverse proxy)

### Step-by-step

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2
npm install -g pm2

# 3. Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# 4. Buat database
sudo -u postgres psql -c "CREATE DATABASE ava_order_bot;"
sudo -u postgres psql -c "CREATE USER botuser WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ava_order_bot TO botuser;"

# 5. Clone project
git clone <repo-url> /var/www/ava_order_bot
cd /var/www/ava_order_bot
npm ci --only=production

# 6. Setup .env
cp .env.example .env
nano .env

# 7. Migrasi database
npm run db:generate
npm run db:migrate
npm run db:seed

# 8. Start dengan PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Nginx Config

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
    }
}
```

---

## 🐳 Deploy dengan Docker

```bash
# Copy dan isi .env
cp .env.example .env
nano .env

# Build dan jalankan
cd docker
docker-compose up -d

# Migrasi database (pertama kali)
docker-compose exec bot npx prisma migrate deploy
docker-compose exec bot node prisma/seed.js

# Lihat logs
docker-compose logs -f bot
```

---

## 🦕 Deploy ke Pterodactyl

### Egg Configuration
- **Docker Image**: `ghcr.io/parkervcp/yolks:nodejs_20`
- **Startup Command**: `npm ci --only=production && npx prisma generate && npx prisma migrate deploy && node src/index.js`
- **Port**: 3000

### Environment Variables di Pterodactyl Panel
Set semua variabel dari `.env.example` di panel Pterodactyl.

---

## 💳 Konfigurasi Paydisini

1. Daftar di [paydisini.co.id](https://paydisini.co.id)
2. Masuk ke Dashboard → API
3. Salin **API Key**
4. Set di `.env`:
   ```
   PAYDISINI_API_KEY=your_api_key
   ```
5. Set callback URL di dashboard Paydisini:
   ```
   https://yourdomain.com/api/payment/paydisini/callback
   ```
6. Pilih channel yang diaktifkan di `.env`:
   ```
   PAYDISINI_CHANNELS=QRIS,GOPAY,OVO,DANA,SHOPEEPAY,BCA,BNI,MANDIRI,BRI
   ```

### Channel Codes Paydisini
| Code | Keterangan |
|------|-----------|
| QRIS | QRIS |
| GOPAY | GoPay |
| OVO | OVO |
| DANA | DANA |
| SHOPEEPAY | ShopeePay |
| BCA | BCA Virtual Account |
| BNI | BNI Virtual Account |
| BRI | BRI Virtual Account |
| MANDIRI | Mandiri Virtual Account |

---

## 💳 Konfigurasi Pakasir

1. Daftar di [pakasir.net](https://pakasir.net)
2. Masuk ke Dashboard → Developer → API Keys
3. Buat API Key baru, salin **API Key** dan **Callback Secret**
4. Set di `.env`:
   ```
   PAKASIR_API_KEY=your_api_key
   PAKASIR_CALLBACK_SECRET=your_callback_secret
   ```
5. Set callback URL di dashboard Pakasir:
   ```
   https://yourdomain.com/api/payment/pakasir/callback
   ```

---

## 🔧 Perintah Admin Bot

### Sebagai Admin, ketik:
- `/admin` — Buka panel admin

### Sebagai Owner, ketik:
- `/owner` — Buka panel owner
- `/admin` — Buka panel admin (owner juga bisa akses admin)

---

## 📦 Struktur Project

```
src/
├── bot/
│   ├── commands/          # /start, /admin, /owner
│   ├── handlers/          # callback handlers
│   │   ├── admin/        # admin handlers
│   │   └── owner/        # owner handlers
│   ├── middleware/        # auth, rate-limit, channel-check
│   └── index.js          # bot setup & routing
├── services/
│   ├── payment/           # balance, paydisini, pakasir
│   ├── product.js
│   ├── transaction.js
│   ├── user.js
│   ├── broadcast.js
│   ├── referral.js
│   ├── voucher.js
│   ├── backup.js
│   ├── scheduler.js
│   ├── settings.js
│   └── activityLog.js
├── api/
│   ├── routes/            # webhook, payment callbacks, health
│   └── server.js
├── database/
│   └── client.js          # Prisma client
├── config/
│   └── index.js
├── utils/
│   ├── keyboard.js        # Inline keyboard builders
│   ├── message.js         # Message templates
│   ├── formatter.js       # Currency, date formatters
│   └── logger.js
└── index.js               # Entry point
```

---

## 🔑 Environment Variables

Lihat [.env.example](.env.example) untuk dokumentasi lengkap.

---

## 📄 License

MIT © AVA Order Bot
