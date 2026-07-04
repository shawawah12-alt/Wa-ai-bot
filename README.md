[![Node.js CI](https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot/actions/workflows/node.js.yml/badge.svg)](https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot/actions/workflows/node.js.yml) [![Indonesian](https://img.shields.io/badge/README-Bahasa%20Indonesia-red?style=flat&logo=github)](#bahasa-indonesia) [![English](https://img.shields.io/badge/README-English-blue?style=flat&logo=github)](#english-version)

# Simple Or Advance? WA AI's Bot

Bot WhatsApp berbasis AI yang memanfaatkan API berformat OpenAI-compatible untuk menjawab pertanyaan, menganalisis gambar, dan mengingat konteks percakapan. Dibangun di atas library Baileys dengan metode pairing code.

Pilih bahasa dokumentasi di bawah ini:

- [Bahasa Indonesia](#bahasa-indonesia)
- [English](#english-version)

---

# Bahasa Indonesia

![Indonesia](https://flagcdn.com/32x24/id.png) **Dokumentasi Bahasa Indonesia**

WhatsApp AI bot yang memanfaatkan API berformat OpenAI-compatible untuk menjawab pertanyaan, menganalisis gambar, dan mengingat konteks percakapan. Dibangun di atas library [Baileys](https://github.com/WhiskeySockets/Baileys) dengan metode **pairing code**, sehingga pengguna tidak perlu memindai QR code dari layar terminal. Cukup masukkan nomor WhatsApp, dapatkan kode pairing, lalu masukkan kode tersebut di aplikasi WhatsApp.

Bot ini cocok dipakai sebagai asisten pribadi di WhatsApp, jawaban cepat untuk pertanyaan sehari-hari, atau sebagai wrapper multi-provider AI (OpenAI, Groq, OpenRouter, Gemini OpenAI-compatible, dan sejenisnya) selama endpoint mengikuti format `https://.../v1/chat/completions`.

Proyek ini sepenuhnya open source di bawah lisensi MIT. Kamu bebas memakai, memodifikasi, dan mendistribusikan ulang sesuai kebutuhan.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Cara Instalasi](#cara-instalasi)
  - [Mode 1: Termux (Android)](#mode-1-termux-android)
  - [Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)](#mode-2-linux-debianubuntufedoraarch)
- [Setup Bot di WhatsApp](#setup-bot-di-whatsapp)
- [Cara Penggunaan](#cara-penggunaan)
- [Pemilihan Bahasa Bot](#pemilihan-bahasa-bot)
- [Struktur Proyek](#struktur-proyek)
- [Penjelasan Konfigurasi](#penjelasan-konfigurasi)
- [Troubleshooting](#troubleshooting)
- [Cara Kontribusi](#cara-kontribusi)
- [Lisensi](#lisensi)
- [Kredit](#kredit)

---

## Fitur Utama

Bot ini dirancang ringan namun cukup lengkap untuk kebutuhan asisten AI harian di WhatsApp. Berikut fitur-fitur yang tersedia secara default:

- **Pairing Code Authentication**: Tidak perlu QR code. Cukup masukkan nomor WhatsApp aktif, bot akan memberikan kode 8 digit yang dimasukkan lewat menu "Tautkan dengan nomor" di aplikasi WhatsApp.
- **Multi-Provider AI**: Mendukung semua provider yang kompatibel dengan format API OpenAI (OpenAI, Groq, OpenRouter, Together AI, Gemini OpenAI-compatible, lokal Ollama, dan lainnya). Tinggal masukkan endpoint, API key, dan nama model.
- **Mode Thinking**: Tersedia dua mode jawaban. Mode normal untuk jawaban singkat-padat-jelas, dan mode `(thinking)` untuk jawaban komprehensif, analitis, dan terstruktur. Mode ini berguna saat kamu butuh penjelasan mendalam untuk topik kompleks.
- **Dukungan Gambar (Vision)**: Kirim gambar dengan caption `/ai <pertanyaan tentang gambar>` dan bot akan menganalisis gambar tersebut. Cocok untuk membaca teks dari screenshot, menjelaskan isi foto, atau mengenali objek.
- **Riwayat Percakapan**: Bot mengingat hingga 10 pesan terakhir per chat (baik personal maupun grup) sehingga konteks tidak hilang saat melakukan follow-up question. Riwayat disimpan di file `history.json` agar tetap ada walau bot di-restart.
- **Typing Indicator**: Saat AI sedang memproses jawaban, bot akan menampilkan status "mengetik..." di WhatsApp pengirim, sehingga pengguna tahu bot sedang bekerja dan tidak mengira bot hang atau error.
- **Auto-Reconnect**: Jika koneksi ke server WhatsApp terputus (kecuali karena logout), bot akan otomatis mencoba reconnect dalam 3 detik tanpa perlu intervensi manual.
- **Konfigurasi via WhatsApp Itu Sendiri**: Tidak perlu edit file manual. Setup endpoint, API key, dan model cukup dilakukan lewat command `/ai set` langsung dari chat WhatsApp.
- **Pemilihan Bahasa di Startup**: Saat pertama kali dijalankan dengan `node index.js`, bot akan meminta pengguna memilih bahasa antara Bahasa Indonesia atau English. Pilihan disimpan di file `lang.json` dan dipakai untuk semua pesan antarmuka terminal maupun pesan WhatsApp balasan bot.

---

## Prasyarat Sistem

Sebelum menginstal bot, pastikan perangkat kamu memenuhi syarat berikut. Jika salah satu belum terpenuhi, script instalasi akan mencoba memenuhinya secara otomatis.

- **Node.js versi 20 atau lebih baru** (disarankan v20 LTS atau v22 LTS). Baileys versi terbaru membutuhkan Node.js v20+ untuk dapat berjalan dengan andal.
- **npm** (biasanya ikut terpasang bersama Node.js).
- **Git** (opsional, hanya untuk clone repo).
- **Koneksi internet stabil** saat proses instalasi dan saat bot berjalan.
- **Akun WhatsApp aktif** di HP, karena bot akan ditautkan ke akun tersebut sebagai perangkat tambahan.
- **API key dari provider AI** yang dipilih (OpenAI, Groq, OpenRouter, atau lainnya). Tanpa ini bot bisa jalan tapi tidak akan bisa membalas pertanyaan AI.

> Catatan: Bot ini menggunakan akun WhatsApp kamu sendiri sebagai "perangkat tambahan". WhatsApp mengizinkan hingga 4 perangkat tambahan per akun. Jangan lupa untuk tetap menjaga akun WhatsApp agar tidak dipakai untuk spam, karena WhatsApp bisa membatasi akun yang melanggar Terms of Service.

---

## Cara Instalasi

Pilih mode instalasi sesuai perangkat kamu. Kedua script instalasi pada dasarnya melakukan hal yang sama: cek/install Node.js, install npm dependencies, dan menyiapkan file konfigurasi awal. Yang berbeda hanya cara install Node.js di tiap platform.

### Mode 1: Termux (Android)

Cocok untuk kamu yang ingin menjalankan bot langsung dari HP Android tanpa PC. Pastikan aplikasi Termux sudah terpasang (unduh dari F-Droid atau GitHub rilis Termux, jangan dari Play Store karena versinya sudah lama).

```bash
# 1. Update package Termux
pkg update -y && pkg upgrade -y

# 2. Install git dan nodejs
pkg install git nodejs -y

# 3. Clone repo
git clone https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot.git
cd SimpleOrAdvance--Wa-ai-s-bot

# 4. Jalankan script instalasi
bash install-termux.sh

# 5. Jalankan bot
node index.js
```

Script `install-termux.sh` akan melakukan hal berikut secara otomatis:

1. Memastikan `nodejs` dan `git` sudah terpasang. Jika belum, akan diinstall via `pkg`.
2. Mengecek versi Node.js. Jika di bawah v20, instalasi dihentikan dengan pesan error yang jelas.
3. Menjalankan `npm install` untuk menginstall dependencies (Baileys, axios, pino, @hapi/boom).
4. Membuat file `config.json` dan `history.json` kosong jika belum ada.
5. Menampilkan instruksi langkah selanjutnya.

Alternatif tanpa clone (manual copy file): unduh repo sebagai ZIP, ekstrak di Termux, lalu jalankan `bash install-termux.sh` dari dalam folder hasil ekstrak.

### Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)

Cocok untuk kamu yang menjalankan bot di VPS, PC Linux, WSL, atau Raspberry Pi. Script akan mendeteksi distro dan package manager yang dipakai secara otomatis.

```bash
# 1. Clone repo
git clone https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot.git
cd SimpleOrAdvance--Wa-ai-s-bot

# 2. Beri permission execute dan jalankan script instalasi
chmod +x install-linux.sh
./install-linux.sh

# 3. Jalankan bot
node index.js
```

Script `install-linux.sh` akan melakukan hal berikut secara otomatis:

1. Mendeteksi package manager: `apt` (Debian/Ubuntu), `dnf` (Fedora), `pacman` (Arch), atau `yum` (CentOS/RHEL lama).
2. Mengecek apakah Node.js sudah terpasang. Jika belum, akan diinstall via NodeSource (untuk apt/yum) atau package manager bawaan distro (untuk dnf/pacman).
3. Memastikan versi Node.js minimal v20. Disarankan v20 LTS atau v22 LTS untuk kompatibilitas maksimal dengan Baileys.
4. Menjalankan `npm install` untuk menginstall semua dependencies.
5. Membuat file `config.json` dan `history.json` kosong jika belum ada.

> Untuk distro selain yang disebutkan di atas (Alpine, NixOS, dan lain-lain), kamu perlu install Node.js v20+ manual sesuai dokumentasi distro tersebut, lalu jalankan `npm install` di dalam folder proyek.

---

## Setup Bot di WhatsApp

Setelah instalasi selesai dan bot pertama kali dijalankan dengan `node index.js`, ikuti langkah berikut untuk menautkan bot ke akun WhatsApp kamu:

1. **Pilih bahasa**: Saat pertama dijalankan, bot menampilkan menu pilihan bahasa (1 = Bahasa Indonesia, 2 = English). Ketik `1` atau `2` lalu tekan Enter. Pilihan disimpan di `lang.json` dan dipakai untuk semua pesan selanjutnya.
2. **Di terminal akan muncul prompt**: `Masukkan nomor (628xxx):`. Masukkan nomor WhatsApp kamu dalam format internasional tanpa tanda `+`. Contoh: `6281234567890` untuk nomor Indonesia.
3. **Tunggu 3 detik**, bot akan meminta kode pairing ke server WhatsApp.
4. **Kode pairing 8 digit akan muncul di terminal** dalam kotak pembatas. Catat kode tersebut.
5. **Buka aplikasi WhatsApp** di HP kamu.
6. Masuk ke menu: **Settings > Linked Devices > Link a Device**.
7. Pilih opsi **"Link with phone number instead"** (Tautkan dengan nomor).
8. **Masukkan kode pairing** 8 digit yang muncul di terminal.
9. Jika berhasil, terminal akan menampilkan pesan `PAIRING SUKSES. Bot siap jalan.` dan bot langsung aktif menerima pesan.

Selanjutnya, kamu perlu mengatur provider AI yang akan dipakai. Kirim pesan ke akun WhatsApp kamu sendiri (atau chat ke nomor bot dari nomor lain) dengan format berikut:

```
/ai set
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxxxxxxxxxxxxxxxx
model: gpt-4o-mini
```

Ganti nilai `endpoint`, `apikey`, dan `model` sesuai provider yang kamu pakai. Berikut beberapa contoh konfigurasi untuk provider populer:

**OpenAI:**
```
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxx
model: gpt-4o-mini
```

**Groq (gratis, cepat):**
```
endpoint: https://api.groq.com/openai/v1
apikey: gsk_xxxxxx
model: llama-3.3-70b-versatile
```

**OpenRouter (multi-provider):**
```
endpoint: https://openrouter.ai/api/v1
apikey: sk-or-v1-xxxxxx
model: anthropic/claude-3.5-sonnet
```

**Ollama lokal (tanpa API key):**
```
endpoint: http://localhost:11434/v1
apikey: ollama
model: llama3.2
```

Setelah setup berhasil, bot akan membalas dengan konfirmasi `Setup Berhasil Diperbarui!` dan siap menerima pertanyaan.

---

## Cara Penggunaan

Semua perintah diawali dengan `/ai`. Berikut daftar perintah yang tersedia:

| Perintah | Fungsi |
|---|---|
| `/ai` | Menampilkan bantuan dan status bot saat ini. |
| `/ai set\nendpoint: ...\napikey: ...\nmodel: ...` | Mengatur atau mengganti provider AI. |
| `/ai <pertanyaan>` | Bertanya ke AI dengan mode normal (jawaban singkat). |
| `/ai (thinking) <pertanyaan>` | Bertanya ke AI dengan mode analitis (jawaban mendalam). |
| `/ai clear` | Menghapus riwayat percakapan untuk chat saat ini. |

**Contoh pemakaian sehari-hari:**

- Tanya cepat: `/ai jam berapa sekarang di Tokyo?`
- Mode thinking: `/ai (thinking) jelaskan perbedaan TCP dan UDP beserta contoh penggunaannya`
- Kirim gambar: lampirkan gambar + caption `/ai apa yang ada di gambar ini?`
- Reset konteks: `/ai clear` lalu mulai topik baru

Bot akan menampilkan status "mengetik..." selama AI memproses jawaban. Tergantung provider dan panjang jawaban, waktu respons berkisar antara 2-15 detik. Jika lebih dari 3 menit tidak ada balasan, kemungkinan terjadi error API dan akan ditampilkan sebagai pesan error di chat.

---

## Pemilihan Bahasa Bot

Saat pertama kali menjalankan `node index.js`, bot akan meminta kamu memilih bahasa antarmuka:

```
====================================
        PILIH BAHASA / SELECT LANGUAGE
====================================
1. Bahasa Indonesia
2. English
====================================
Pilihan (1/2):
```

Ketik `1` untuk Bahasa Indonesia atau `2` untuk English, lalu tekan Enter. Pilihan ini disimpan di file `lang.json` dan akan dipakai untuk semua pesan:

- Pesan terminal (seperti status koneksi, kode pairing, dll)
- Pesan balasan bot di WhatsApp (seperti panduan setup, error, konfirmasi)
- System prompt AI (AI akan menjawab sesuai bahasa yang dipilih)

### Cara Ganti Bahasa Setelah Pemilihan Awal

Ada 2 cara:

**Cara 1: Hapus file `lang.json`**
```bash
rm lang.json
node index.js
```
Bot akan menampilkan menu pilihan bahasa lagi.

**Cara 2: Edit manual `lang.json`**
```json
{
  "lang": "id"
}
```
Ganti `"id"` dengan `"en"` untuk English, atau sebaliknya. Simpan file, lalu jalankan ulang `node index.js`.

---

## Struktur Proyek

```
SimpleOrAdvance--Wa-ai-s-bot/
├── index.js              # Source code utama bot (bilingual)
├── package.json          # Daftar dependencies dan metadata proyek
├── install-termux.sh     # Script instalasi untuk Termux (Android)
├── install-linux.sh      # Script instalasi untuk Linux
├── config.example.json   # Contoh format file konfigurasi
├── .gitignore            # Daftar file yang diabaikan oleh git
├── LICENSE               # Lisensi proyek (MIT)
└── README.md             # Dokumentasi ini (bilingual)

File yang dibuat otomatis saat dijalankan:
├── auth/                 # Folder state autentikasi WhatsApp (jangan di-commit)
├── config.json           # Konfigurasi provider AI (jangan di-commit)
├── history.json          # Riwayat percakapan per chat (jangan di-commit)
└── lang.json             # Pilihan bahasa bot (jangan di-commit)
```

---

## Penjelasan Konfigurasi

File `config.json` otomatis dibuat saat pertama kali setup lewat command `/ai set`. Strukturnya sebagai berikut:

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-xxxxxxxxxxxx",
  "model": "gpt-4o-mini"
}
```

- **baseUrl**: Base URL endpoint provider AI. Harus mengarah ke root endpoint (misal `https://api.openai.com/v1`), tanpa trailing slash. Bot akan otomatis menambahkan path `/chat/completions`.
- **apiKey**: API key dari provider. Untuk provider lokal seperti Ollama, isi dengan string apa pun (misal `ollama`).
- **model**: Nama model yang tersedia di provider. Cek dokumentasi provider untuk daftar model yang didukung.

File `lang.json` berisi pilihan bahasa bot:

```json
{
  "lang": "id"
}
```

Nilai bisa `"id"` (Bahasa Indonesia) atau `"en"` (English).

Kedua file `config.json` dan `lang.json` sebaiknya **tidak pernah di-commit ke GitHub** karena berisi data spesifik perangkat/pengguna. `config.json` berisi API key rahasia. Sudah ditambahkan ke `.gitignore` secara default.

---

## Troubleshooting

**Bot tidak merespon setelah pairing berhasil**
Pastikan kamu sudah menjalankan command `/ai set` dengan format yang benar. Bot hanya akan merespon pesan yang diawali dengan `/ai`. Jika belum setup, ketik `/ai` untuk melihat panduan.

**Error: `X Error API: ...`**
Artinya ada masalah dengan provider AI kamu. Periksa kembali: (1) API key valid dan belum expired, (2) endpoint benar, (3) model yang dipilih tersedia di provider, (4) saldo/kuota API masih cukup.

**Error: `Connection closed. Reason: 515` atau kode lain**
Koneksi ke server WhatsApp terputus sementara. Bot akan otomatis reconnect dalam 3 detik. Jika tetap tidak reconnect, matikan bot (Ctrl+C), tunggu 1 menit, lalu jalankan ulang `node index.js`.

**Bot logout sendiri / tidak bisa reconnect**
Jika terminal menampilkan pesan `Logout. Hapus folder auth`, hapus folder `auth` lalu jalankan ulang bot untuk melakukan pairing ulang:

```bash
rm -rf auth
node index.js
```

**Gagal download gambar / vision tidak jalan**
Pastikan kamu mengirim gambar sebagai **lampiran dengan caption**, bukan sebagai pesan berbeda. Caption harus diawali `/ai`. Jika masih gagal, kemungkinan provider AI yang dipilih tidak mendukung fitur vision (contoh: beberapa model di Groq belum mendukung gambar).

**`npm install` gagal di Termux**
Coba jalankan `pkg upgrade nodejs` lalu `npm install` ulang. Jika masih gagal, hapus folder `node_modules` dan `package-lock.json`, lalu install ulang dari awal:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Migrasi ke nomor WhatsApp lain**
Hentikan bot, hapus folder `auth`, lalu jalankan ulang. Bot akan meminta nomor baru:

```bash
rm -rf auth
node index.js
```

**Ingin ganti bahasa bot**
Lihat bagian [Pemilihan Bahasa Bot](#pemilihan-bahasa-bot) di atas.

---

## Cara Kontribusi

Kontribusi sangat diterima. Beberapa hal yang bisa kamu bantu:

- Melaporkan bug lewat tab Issues dengan deskripsi langkah reproduksi yang jelas.
- Mengajukan fitur baru (misal dukungan voice note, dukungan PDF, multi-model routing, dll).
- Membantu memperbaiki dokumentasi atau menerjemahkan ke bahasa lain.
- Membuat pull request untuk perbaikan kode.

Untuk pull request, pastikan kode mengikuti style yang sudah ada (2 space indent, single quote string, no semicolon di akhir baris yang tidak perlu), dan jelaskan secara ringkas apa yang diubah beserta alasannya.

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Kamu bebas menggunakan, memodifikasi, mendistribusikan, dan mengkomersialkan proyek ini selama menyertakan atribusi lisensi asli. Lihat file [LICENSE](LICENSE) untuk teks lengkapnya.

---

## Kredit

Proyek ini dibangun di atas kerja keras beberapa pihak berikut:

- **Zhaw (Shadiq)** sebagai pembuat script awal bot. Instagram: `mas_ukkantext`, TikTok: `@ravmoise/test`.
- **[Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)** untuk library komunikasi WhatsApp WebSocket.
- **[Axios](https://axios-http.com/)** untuk HTTP client.
- **[Pino](https://github.com/pinojs/pino)** untuk logging.
- Seluruh provider AI (OpenAI, Groq, OpenRouter, dan lainnya) yang menyediakan API kompatibel dengan format OpenAI.

Jika kamu memodifikasi dan merilis ulang proyek ini, mohon tetap mencantumkan kredit ke pembuat asli.

---

# English Version

![English](https://flagcdn.com/32x24/gb.png) **English Documentation**

A WhatsApp AI bot that leverages an OpenAI-compatible API format to answer questions, analyze images, and remember conversation context. Built on top of the [Baileys](https://github.com/WhiskeySockets/Baileys) library with **pairing code** method, so users don't need to scan a QR code from the terminal screen. Just enter the WhatsApp number, get the pairing code, then enter the code in the WhatsApp app.

This bot is suitable for use as a personal assistant on WhatsApp, quick answers for everyday questions, or as a multi-provider AI wrapper (OpenAI, Groq, OpenRouter, Gemini OpenAI-compatible, and similar) as long as the endpoint follows the `https://.../v1/chat/completions` format.

This project is fully open source under the MIT License. You are free to use, modify, and redistribute it as needed.

---

## Table of Contents

- [Main Features](#main-features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
  - [Mode 1: Termux (Android)](#mode-1-termux-android-1)
  - [Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)](#mode-2-linux-debianubuntufedoraarch-1)
- [Bot Setup on WhatsApp](#bot-setup-on-whatsapp)
- [Usage](#usage)
- [Bot Language Selection](#bot-language-selection)
- [Project Structure](#project-structure)
- [Configuration Explanation](#configuration-explanation)
- [Troubleshooting](#troubleshooting-1)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Main Features

This bot is designed to be lightweight yet comprehensive enough for daily AI assistant needs on WhatsApp. The following features are available by default:

- **Pairing Code Authentication**: No QR code needed. Just enter an active WhatsApp number, the bot will provide an 8-digit code that is entered via the "Link with phone number" menu in the WhatsApp app.
- **Multi-Provider AI**: Supports all providers compatible with the OpenAI API format (OpenAI, Groq, OpenRouter, Together AI, Gemini OpenAI-compatible, local Ollama, and others). Just enter the endpoint, API key, and model name.
- **Thinking Mode**: Two answer modes are available. Normal mode for short-concise-clear answers, and `(thinking)` mode for comprehensive, analytical, and structured answers. This mode is useful when you need in-depth explanations for complex topics.
- **Image Support (Vision)**: Send an image with caption `/ai <question about the image>` and the bot will analyze the image. Suitable for reading text from screenshots, explaining photo content, or recognizing objects.
- **Conversation History**: The bot remembers up to the last 10 messages per chat (both personal and group) so context is not lost during follow-up questions. History is stored in the `history.json` file so it persists even after bot restart.
- **Typing Indicator**: While AI is processing an answer, the bot will display a "typing..." status on the sender's WhatsApp, so users know the bot is working and don't think the bot is hanging or erroring.
- **Auto-Reconnect**: If the connection to the WhatsApp server is lost (except due to logout), the bot will automatically try to reconnect within 3 seconds without manual intervention.
- **Configuration via WhatsApp Itself**: No need to edit files manually. Setting up endpoint, API key, and model is done via the `/ai set` command directly from WhatsApp chat.
- **Language Selection at Startup**: When first run with `node index.js`, the bot will prompt the user to choose a language between Indonesian or English. The choice is saved in the `lang.json` file and used for all terminal interface messages and bot WhatsApp reply messages.

---

## System Requirements

Before installing the bot, make sure your device meets the following requirements. If any are not met, the installation script will try to fulfill them automatically.

- **Node.js version 20 or newer** (v20 LTS or v22 LTS recommended). The latest version of Baileys requires Node.js v20+ to run reliably.
- **npm** (usually installed along with Node.js).
- **Git** (optional, only for cloning the repo).
- **Stable internet connection** during installation and while the bot is running.
- **Active WhatsApp account** on your phone, since the bot will be linked to that account as an additional device.
- **API key from your chosen AI provider** (OpenAI, Groq, OpenRouter, or others). Without this, the bot can run but won't be able to answer AI questions.

> Note: This bot uses your own WhatsApp account as an "additional device". WhatsApp allows up to 4 additional devices per account. Don't forget to keep your WhatsApp account safe from spam, as WhatsApp may restrict accounts that violate the Terms of Service.

---

## Installation

Choose the installation mode according to your device. Both installation scripts basically do the same thing: check/install Node.js, install npm dependencies, and prepare the initial configuration file. The only difference is how Node.js is installed on each platform.

### Mode 1: Termux (Android)

Suitable for those who want to run the bot directly from an Android phone without a PC. Make sure the Termux app is installed (download from F-Droid or Termux GitHub releases, not from the Play Store as the version is outdated).

```bash
# 1. Update Termux packages
pkg update -y && pkg upgrade -y

# 2. Install git and nodejs
pkg install git nodejs -y

# 3. Clone the repo
git clone https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot.git
cd SimpleOrAdvance--Wa-ai-s-bot

# 4. Run the installation script
bash install-termux.sh

# 5. Run the bot
node index.js
```

The `install-termux.sh` script will do the following automatically:

1. Ensure `nodejs` and `git` are installed. If not, they will be installed via `pkg`.
2. Check the Node.js version. If below v20, the installation stops with a clear error message.
3. Run `npm install` to install dependencies (Baileys, axios, pino, @hapi/boom).
4. Create empty `config.json` and `history.json` files if they don't exist.
5. Display next step instructions.

Alternative without cloning (manual file copy): download the repo as a ZIP, extract it in Termux, then run `bash install-termux.sh` from inside the extracted folder.

### Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)

Suitable for those running the bot on a VPS, Linux PC, WSL, or Raspberry Pi. The script will detect the distro and package manager used automatically.

```bash
# 1. Clone the repo
git clone https://github.com/shawawah12-alt/SimpleOrAdvance--Wa-ai-s-bot.git
cd SimpleOrAdvance--Wa-ai-s-bot

# 2. Give execute permission and run the installation script
chmod +x install-linux.sh
./install-linux.sh

# 3. Run the bot
node index.js
```

The `install-linux.sh` script will do the following automatically:

1. Detect the package manager: `apt` (Debian/Ubuntu), `dnf` (Fedora), `pacman` (Arch), or `yum` (CentOS/RHEL old).
2. Check if Node.js is installed. If not, it will be installed via NodeSource (for apt/yum) or the distro's default package manager (for dnf/pacman).
3. Ensure Node.js version is at least v20. v20 LTS or v22 LTS is recommended for maximum compatibility with Baileys.
4. Run `npm install` to install all dependencies.
5. Create empty `config.json` and `history.json` files if they don't exist.

> For distros other than those mentioned above (Alpine, NixOS, and others), you need to install Node.js v20+ manually according to that distro's documentation, then run `npm install` inside the project folder.

---

## Bot Setup on WhatsApp

After installation is complete and the bot is first run with `node index.js`, follow these steps to link the bot to your WhatsApp account:

1. **Select language**: When first run, the bot displays a language selection menu (1 = Indonesian, 2 = English). Type `1` or `2` then press Enter. The choice is saved in `lang.json` and used for all subsequent messages.
2. **The terminal will show a prompt**: `Enter number (628xxx):`. Enter your WhatsApp number in international format without the `+` sign. Example: `6281234567890` for an Indonesian number.
3. **Wait 3 seconds**, the bot will request a pairing code from the WhatsApp server.
4. **The 8-digit pairing code will appear in the terminal** in a boxed format. Note this code.
5. **Open the WhatsApp app** on your phone.
6. Go to menu: **Settings > Linked Devices > Link a Device**.
7. Select the **"Link with phone number instead"** option.
8. **Enter the 8-digit pairing code** that appeared in the terminal.
9. If successful, the terminal will display `PAIRING SUCCESS. Bot is ready to run.` and the bot will be active to receive messages.

Next, you need to set up the AI provider to use. Send a message to your own WhatsApp account (or chat to the bot number from another number) with the following format:

```
/ai set
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxxxxxxxxxxxxxxxx
model: gpt-4o-mini
```

Replace the `endpoint`, `apikey`, and `model` values according to the provider you use. Here are some example configurations for popular providers:

**OpenAI:**
```
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxx
model: gpt-4o-mini
```

**Groq (free, fast):**
```
endpoint: https://api.groq.com/openai/v1
apikey: gsk_xxxxxx
model: llama-3.3-70b-versatile
```

**OpenRouter (multi-provider):**
```
endpoint: https://openrouter.ai/api/v1
apikey: sk-or-v1-xxxxxx
model: anthropic/claude-3.5-sonnet
```

**Ollama local (no API key):**
```
endpoint: http://localhost:11434/v1
apikey: ollama
model: llama3.2
```

After successful setup, the bot will reply with a `Setup Successfully Updated!` confirmation and is ready to receive questions.

---

## Usage

All commands start with `/ai`. Here is the list of available commands:

| Command | Function |
|---|---|
| `/ai` | Displays help and current bot status. |
| `/ai set\nendpoint: ...\napikey: ...\nmodel: ...` | Sets or changes the AI provider. |
| `/ai <question>` | Asks AI in normal mode (short answer). |
| `/ai (thinking) <question>` | Asks AI in analytical mode (in-depth answer). |
| `/ai clear` | Clears conversation history for the current chat. |

**Daily usage examples:**

- Quick question: `/ai what time is it in Tokyo now?`
- Thinking mode: `/ai (thinking) explain the difference between TCP and UDP with usage examples`
- Send image: attach image + caption `/ai what is in this image?`
- Reset context: `/ai clear` then start a new topic

The bot will display a "typing..." status while AI processes the answer. Depending on the provider and answer length, response time ranges from 2-15 seconds. If there is no reply for more than 3 minutes, an API error may have occurred and will be displayed as an error message in the chat.

---

## Bot Language Selection

When first running `node index.js`, the bot will prompt you to choose the interface language:

```
====================================
        PILIH BAHASA / SELECT LANGUAGE
====================================
1. Bahasa Indonesia
2. English
====================================
Choice (1/2):
```

Type `1` for Indonesian or `2` for English, then press Enter. This choice is saved in the `lang.json` file and will be used for all messages:

- Terminal messages (such as connection status, pairing code, etc.)
- Bot reply messages on WhatsApp (such as setup guides, errors, confirmations)
- AI system prompt (AI will respond according to the selected language)

### How to Change Language After Initial Selection

There are 2 ways:

**Method 1: Delete the `lang.json` file**
```bash
rm lang.json
node index.js
```
The bot will display the language selection menu again.

**Method 2: Manually edit `lang.json`**
```json
{
  "lang": "en"
}
```
Replace `"en"` with `"id"` for Indonesian, or vice versa. Save the file, then run `node index.js` again.

---

## Project Structure

```
SimpleOrAdvance--Wa-ai-s-bot/
├── index.js              # Main bot source code (bilingual)
├── package.json          # Dependencies list and project metadata
├── install-termux.sh     # Installation script for Termux (Android)
├── install-linux.sh      # Installation script for Linux
├── config.example.json   # Example configuration file format
├── .gitignore            # List of files ignored by git
├── LICENSE               # Project license (MIT)
└── README.md             # This documentation (bilingual)

Files created automatically when running:
├── auth/                 # WhatsApp auth state folder (do not commit)
├── config.json           # AI provider configuration (do not commit)
├── history.json          # Conversation history per chat (do not commit)
└── lang.json             # Bot language choice (do not commit)
```

---

## Configuration Explanation

The `config.json` file is created automatically when first set up via the `/ai set` command. Its structure is as follows:

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-xxxxxxxxxxxx",
  "model": "gpt-4o-mini"
}
```

- **baseUrl**: Base URL of the AI provider endpoint. Must point to the root endpoint (e.g., `https://api.openai.com/v1`), without trailing slash. The bot will automatically append the `/chat/completions` path.
- **apiKey**: API key from the provider. For local providers like Ollama, fill with any string (e.g., `ollama`).
- **model**: Name of the model available at the provider. Check the provider's documentation for the list of supported models.

The `lang.json` file contains the bot's language choice:

```json
{
  "lang": "en"
}
```

The value can be `"id"` (Indonesian) or `"en"` (English).

Both `config.json` and `lang.json` files should **never be committed to GitHub** because they contain device/user-specific data. `config.json` contains a secret API key. They have been added to `.gitignore` by default.

---

## Troubleshooting

**Bot doesn't respond after successful pairing**
Make sure you have run the `/ai set` command with the correct format. The bot will only respond to messages starting with `/ai`. If not set up yet, type `/ai` to see the guide.

**Error: `X Error API: ...`**
This means there is a problem with your AI provider. Check again: (1) API key is valid and not expired, (2) endpoint is correct, (3) selected model is available at the provider, (4) API balance/quota is still sufficient.

**Error: `Connection closed. Reason: 515` or other code**
Connection to the WhatsApp server was temporarily lost. The bot will automatically reconnect within 3 seconds. If it still doesn't reconnect, stop the bot (Ctrl+C), wait 1 minute, then run `node index.js` again.

**Bot logs out on its own / cannot reconnect**
If the terminal displays a `Logout. Delete auth folder` message, delete the `auth` folder then run the bot again to re-pair:

```bash
rm -rf auth
node index.js
```

**Failed to download image / vision not working**
Make sure you send the image as an **attachment with caption**, not as a separate message. The caption must start with `/ai`. If it still fails, the AI provider you chose may not support the vision feature (e.g., some models on Groq don't support images yet).

**`npm install` fails in Termux**
Try running `pkg upgrade nodejs` then `npm install` again. If it still fails, delete the `node_modules` folder and `package-lock.json`, then reinstall from scratch:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Migrating to another WhatsApp number**
Stop the bot, delete the `auth` folder, then run again. The bot will ask for a new number:

```bash
rm -rf auth
node index.js
```

**Want to change the bot language**
See the [Bot Language Selection](#bot-language-selection) section above.

---

## Contributing

Contributions are very welcome. Here are some things you can help with:

- Reporting bugs via the Issues tab with clear reproduction step descriptions.
- Proposing new features (e.g., voice note support, PDF support, multi-model routing, etc.).
- Helping improve documentation or translating to other languages.
- Creating pull requests for code improvements.

For pull requests, make sure the code follows the existing style (2 space indent, single quote strings, no semicolons at the end of unnecessary lines), and briefly explain what was changed and why.

---

## License

This project is licensed under the **MIT License**. You are free to use, modify, distribute, and commercialize this project as long as you include the original license attribution. See the [LICENSE](LICENSE) file for the full text.

---

## Credits

This project is built on the hard work of the following parties:

- **Zhaw (Shadiq)** as the creator of the initial bot script. Instagram: `mas_ukkantext`, TikTok: `@ravmoise/test`.
- **[Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)** for the WhatsApp WebSocket communication library.
- **[Axios](https://axios-http.com/)** for the HTTP client.
- **[Pino](https://github.com/pinojs/pino)** for logging.
- All AI providers (OpenAI, Groq, OpenRouter, and others) that provide APIs compatible with the OpenAI format.

If you modify and republish this project, please continue to include credit to the original creator.

Proyek ini sepenuhnya open source di bawah lisensi MIT. Kamu bebas memakai, memodifikasi, dan mendistribusikan ulang sesuai kebutuhan.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Cara Instalasi](#cara-instalasi)
  - [Mode 1: Termux (Android)](#mode-1-termux-android)
  - [Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)](#mode-2-linux-debianubuntufedoraarch)
- [Setup Bot di WhatsApp](#setup-bot-di-whatsapp)
- [Cara Penggunaan](#cara-penggunaan)
- [Struktur Proyek](#struktur-proyek)
- [Penjelasan Konfigurasi](#penjelasan-konfigurasi)
- [Troubleshooting](#troubleshooting)
- [Cara Kontribusi](#cara-kontribusi)
- [Lisensi](#lisensi)
- [Kredit](#kredit)

---

## Fitur Utama

Bot ini dirancang ringan namun cukup lengkap untuk kebutuhan asisten AI harian di WhatsApp. Berikut fitur-fitur yang tersedia secara default:

- **Pairing Code Authentication**: Tidak perlu QR code. Cukup masukkan nomor WhatsApp aktif, bot akan memberikan kode 8 digit yang dimasukkan lewat menu "Tautkan dengan nomor" di aplikasi WhatsApp.
- **Multi-Provider AI**: Mendukung semua provider yang kompatibel dengan format API OpenAI (OpenAI, Groq, OpenRouter, Together AI, Gemini OpenAI-compatible, lokal Ollama, dan lainnya). Tinggal masukkan endpoint, API key, dan nama model.
- **Mode Thinking**: Tersedia dua mode jawaban. Mode normal untuk jawaban singkat-padat-jelas, dan mode `(thinking)` untuk jawaban komprehensif, analitis, dan terstruktur. Mode ini berguna saat kamu butuh penjelasan mendalam untuk topik kompleks.
- **Dukungan Gambar (Vision)**: Kirim gambar dengan caption `/ai <pertanyaan tentang gambar>` dan bot akan menganalisis gambar tersebut. Cocok untuk membaca teks dari screenshot, menjelaskan isi foto, atau mengenali objek.
- **Riwayat Percakapan**: Bot mengingat hingga 10 pesan terakhir per chat (baik personal maupun grup) sehingga konteks tidak hilang saat melakukan follow-up question. Riwayat disimpan di file `history.json` agar tetap ada walau bot di-restart.
- **Typing Indicator**: Saat AI sedang memproses jawaban, bot akan menampilkan status "mengetik..." di WhatsApp pengirim, sehingga pengguna tahu bot sedang bekerja dan tidak mengira bot hang atau error.
- **Auto-Reconnect**: Jika koneksi ke server WhatsApp terputus (kecuali karena logout), bot akan otomatis mencoba reconnect dalam 3 detik tanpa perlu intervensi manual.
- **Konfigurasi via WhatsApp Itu Sendiri**: Tidak perlu edit file manual. Setup endpoint, API key, dan model cukup dilakukan lewat command `/ai set` langsung dari chat WhatsApp.

---

## Prasyarat Sistem

Sebelum menginstal bot, pastikan perangkat kamu memenuhi syarat berikut. Jika salah satu belum terpenuhi, script instalasi akan mencoba memenuhinya secara otomatis.

- **Node.js versi 20 atau lebih baru** (disarankan v20 LTS). Baileys versi terbaru menggunakan fitur ES2022+ yang tidak tersedia di Node.js versi lama.
- **npm** (biasanya ikut terpasang bersama Node.js).
- **Git** (opsional, hanya untuk clone repo).
- **Koneksi internet stabil** saat proses instalasi dan saat bot berjalan.
- **Akun WhatsApp aktif** di HP, karena bot akan ditautkan ke akun tersebut sebagai perangkat tambahan.
- **API key dari provider AI** yang dipilih (OpenAI, Groq, OpenRouter, atau lainnya). Tanpa ini bot bisa jalan tapi tidak akan bisa membalas pertanyaan AI.

> Catatan: Bot ini menggunakan akun WhatsApp kamu sendiri sebagai "perangkat tambahan". WhatsApp mengizinkan hingga 4 perangkat tambahan per akun. Jangan lupa untuk tetap menjaga akun WhatsApp agar tidak dipakai untuk spam, karena WhatsApp bisa membatasi akun yang melanggar Terms of Service.

---

## Cara Instalasi

Pilih mode instalasi sesuai perangkat kamu. Kedua script instalasi pada dasarnya melakukan hal yang sama: cek/install Node.js, install npm dependencies, dan menyiapkan file konfigurasi awal. Yang berbeda hanya cara install Node.js di tiap platform.

### Mode 1: Termux (Android)

Cocok untuk kamu yang ingin menjalankan bot langsung dari HP Android tanpa PC. Pastikan aplikasi Termux sudah terpasang (unduh dari F-Droid atau GitHub rilis Termux, jangan dari Play Store karena versinya sudah lama).

```bash
# 1. Update package Termux
pkg update -y && pkg upgrade -y

# 2. Install git dan nodejs
pkg install git nodejs -y

# 3. clone repo
https://github.com/shawawah12-alt/wa-ai-bot.git
cd wa-ai-bot

# 4. Jalankan script instalasi
bash install-termux.sh

# 5. Jalankan bot
node index.js
```

Script `install-termux.sh` akan melakukan hal berikut secara otomatis:

1. Memastikan `nodejs` dan `git` sudah terpasang. Jika belum, akan diinstall via `pkg`.
2. Mengecek versi Node.js. Jika di bawah v18, instalasi dihentikan dengan pesan error yang jelas.
3. Menjalankan `npm install` untuk menginstall dependencies (Baileys, axios, pino, @hapi/boom).
4. Membuat file `config.json` dan `history.json` kosong jika belum ada.
5. Menampilkan instruksi langkah selanjutnya.

Alternatif tanpa clone (manual copy file): unduh repo sebagai ZIP, ekstrak di Termux, lalu jalankan `bash install-termux.sh` dari dalam folder hasil ekstrak.

### Mode 2: Linux (Debian/Ubuntu/Fedora/Arch)

Cocok untuk kamu yang menjalankan bot di VPS, PC Linux, WSL, atau Raspberry Pi. Script akan mendeteksi distro dan package manager yang dipakai secara otomatis.

```bash
# 1. Clone repo (ganti URL dengan URL repo GitHub kamu)
git clone https://github.com/shawawah12-alt/wa-ai-bot.git
cd wa-ai-bot

# 2. Beri permission execute dan jalankan script instalasi
chmod +x install-linux.sh
./install-linux.sh

# 3. Jalankan bot
node index.js
```

Script `install-linux.sh` akan melakukan hal berikut secara otomatis:

1. Mendeteksi package manager: `apt` (Debian/Ubuntu), `dnf` (Fedora), `pacman` (Arch), atau `yum` (CentOS/RHEL lama).
2. Mengecek apakah Node.js sudah terpasang. Jika belum, akan diinstall via NodeSource (untuk apt/yum) atau package manager bawaan distro (untuk dnf/pacman).
3. Memastikan versi Node.js minimal v18. Disarankan v20 LTS untuk kompatibilitas maksimal dengan Baileys.
4. Menjalankan `npm install` untuk menginstall semua dependencies.
5. Membuat file `config.json` dan `history.json` kosong jika belum ada.

> Untuk distro selain yang disebutkan di atas (Alpine, NixOS, dan lain-lain), kamu perlu install Node.js v18+ manual sesuai dokumentasi distro tersebut, lalu jalankan `npm install` di dalam folder proyek.

---

## Setup Bot di WhatsApp

Setelah instalasi selesai dan bot pertama kali dijalankan dengan `node index.js`, ikuti langkah berikut untuk menautkan bot ke akun WhatsApp kamu:

1. **Di terminal akan muncul prompt**: `Masukkan nomor (628xxx):`. Masukkan nomor WhatsApp kamu dalam format internasional tanpa tanda `+`. Contoh: `6281234567890` untuk nomor Indonesia.
2. **Tunggu 3 detik**, bot akan meminta kode pairing ke server WhatsApp.
3. **Kode pairing 8 digit akan muncul di terminal** dalam kotak pembatas. Catat kode tersebut.
4. **Buka aplikasi WhatsApp** di HP kamu.
5. Masuk ke menu: **Settings > Linked Devices > Link a Device**.
6. Pilih opsi **"Link with phone number instead"** (Tautkan dengan nomor).
7. **Masukkan kode pairing** 8 digit yang muncul di terminal.
8. Jika berhasil, terminal akan menampilkan pesan `PAIRING SUKSES. Bot siap jalan.` dan bot langsung aktif menerima pesan.

Selanjutnya, kamu perlu mengatur provider AI yang akan dipakai. Kirim pesan ke akun WhatsApp kamu sendiri (atau chat ke nomor bot dari nomor lain) dengan format berikut:

```
/ai set
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxxxxxxxxxxxxxxxx
model: gpt-4o-mini
```

Ganti nilai `endpoint`, `apikey`, dan `model` sesuai provider yang kamu pakai. Berikut beberapa contoh konfigurasi untuk provider populer:

**OpenAI:**
```
endpoint: https://api.openai.com/v1
apikey: sk-proj-xxxxxx
model: gpt-4o-mini
```

**Groq (gratis, cepat):**
```
endpoint: https://api.groq.com/openai/v1
apikey: gsk_xxxxxx
model: llama-3.3-70b-versatile
```

**OpenRouter (multi-provider):**
```
endpoint: https://openrouter.ai/api/v1
apikey: sk-or-v1-xxxxxx
model: anthropic/claude-5-sonnet
```

**Ollama lokal (tanpa API key):**
```
endpoint: http://localhost:11434/v1
apikey: ollama
model: llama3.2
```

Setelah setup berhasil, bot akan membalas dengan konfirmasi `Setup Berhasil Diperbarui!` dan siap menerima pertanyaan.

---

## Cara Penggunaan

Semua perintah diawali dengan `/ai`. Berikut daftar perintah yang tersedia:

| Perintah | Fungsi |
|---|---|
| `/ai` | Menampilkan bantuan dan status bot saat ini. |
| `/ai set\nendpoint: ...\napikey: ...\nmodel: ...` | Mengatur atau mengganti provider AI. |
| `/ai <pertanyaan>` | Bertanya ke AI dengan mode normal (jawaban singkat). |
| `/ai (thinking) <pertanyaan>` | Bertanya ke AI dengan mode analitis (jawaban mendalam). |
| `/ai clear` | Menghapus riwayat percakapan untuk chat saat ini. |

**Contoh pemakaian sehari-hari:**

- Tanya cepat: `/ai jam berapa sekarang di Tokyo?`
- Mode thinking: `/ai (thinking) jelaskan perbedaan TCP dan UDP beserta contoh penggunaannya`
- Kirim gambar: lampirkan gambar + caption `/ai apa yang ada di gambar ini?`
- Reset konteks: `/ai clear` lalu mulai topik baru

Bot akan menampilkan status "mengetik..." selama AI memproses jawaban. Tergantung provider dan panjang jawaban, waktu respons berkisar antara 2-15 detik. Jika lebih dari 3 menit tidak ada balasan, kemungkinan terjadi error API dan akan ditampilkan sebagai pesan error di chat.

---

## Struktur Proyek

```
wa-ai-bot/
├── index.js              # Source code utama bot
├── package.json          # Daftar dependencies dan metadata proyek
├── install-termux.sh     # Script instalasi untuk Termux (Android)
├── install-linux.sh      # Script instalasi untuk Linux
├── config.example.json   # Contoh format file konfigurasi
├── .gitignore            # Daftar file yang diabaikan oleh git
├── LICENSE               # Lisensi proyek (MIT)
└── README.md             # Dokumentasi ini

File yang dibuat otomatis saat dijalankan:
├── auth/                 # Folder state autentikasi WhatsApp (jangan di-commit)
├── config.json           # Konfigurasi provider AI (jangan di-commit)
└── history.json          # Riwayat percakapan per chat (jangan di-commit)
```

---

## Penjelasan Konfigurasi

File `config.json` otomatis dibuat saat pertama kali setup lewat command `/ai set`. Strukturnya sebagai berikut:

```json
{
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-xxxxxxxxxxxx",
  "model": "gpt-4o-mini"
}
```

- **baseUrl**: Base URL endpoint provider AI. Harus mengarah ke root endpoint (misal `https://api.openai.com/v1`), tanpa trailing slash. Bot akan otomatis menambahkan path `/chat/completions`.
- **apiKey**: API key dari provider. Untuk provider lokal seperti Ollama, isi dengan string apa pun (misal `ollama`).
- **model**: Nama model yang tersedia di provider. Cek dokumentasi provider untuk daftar model yang didukung.

File ini sebaiknya **tidak pernah di-commit ke GitHub** karena berisi API key rahasia. Sudah ditambahkan ke `.gitignore` secara default.

---

## Troubleshooting

**Bot tidak merespon setelah pairing berhasil**
Pastikan kamu sudah menjalankan command `/ai set` dengan format yang benar. Bot hanya akan merespon pesan yang diawali dengan `/ai`. Jika belum setup, ketik `/ai` untuk melihat panduan.

**Error: `X Error API: ...`**
Artinya ada masalah dengan provider AI kamu. Periksa kembali: (1) API key valid dan belum expired, (2) endpoint benar, (3) model yang dipilih tersedia di provider, (4) saldo/kuota API masih cukup.

**Error: `Connection closed. Reason: 515` atau kode lain**
Koneksi ke server WhatsApp terputus sementara. Bot akan otomatis reconnect dalam 3 detik. Jika tetap tidak reconnect, matikan bot (Ctrl+C), tunggu 1 menit, lalu jalankan ulang `node index.js`.

**Bot logout sendiri / tidak bisa reconnect**
Jika terminal menampilkan pesan `Logout. Hapus folder auth`, hapus folder `auth` lalu jalankan ulang bot untuk melakukan pairing ulang:

```bash
rm -rf auth
node index.js
```

**Gagal download gambar / vision tidak jalan**
Pastikan kamu mengirim gambar sebagai **lampiran dengan caption**, bukan sebagai pesan berbeda. Caption harus diawali `/ai`. Jika masih gagal, kemungkinan provider AI yang dipilih tidak mendukung fitur vision (contoh: beberapa model di Groq belum mendukung gambar).

**`npm install` gagal di Termux**
Coba jalankan `pkg upgrade nodejs` lalu `npm install` ulang. Jika masih gagal, hapus folder `node_modules` dan `package-lock.json`, lalu install ulang dari awal:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Migrasi ke nomor WhatsApp lain**
Hentikan bot, hapus folder `auth`, lalu jalankan ulang. Bot akan meminta nomor baru:

```bash
rm -rf auth
node index.js
```

---

## Cara Kontribusi

Kontribusi sangat diterima. Beberapa hal yang bisa kamu bantu:

- Melaporkan bug lewat tab Issues dengan deskripsi langkah reproduksi yang jelas.
- Mengajukan fitur baru (misal dukungan voice note, dukungan PDF, multi-model routing, dll).
- Membantu memperbaiki dokumentasi atau menerjemahkan ke bahasa lain.
- Membuat pull request untuk perbaikan kode.

Untuk pull request, pastikan kode mengikuti style yang sudah ada (2 space indent, single quote string, no semicolon di akhir baris yang tidak perlu), dan jelaskan secara ringkas apa yang diubah beserta alasannya.

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Kamu bebas menggunakan, memodifikasi, mendistribusikan, dan mengkomersialkan proyek ini selama menyertakan atribusi lisensi asli. Lihat file [LICENSE](LICENSE) untuk teks lengkapnya.

---

## Kredit

Proyek ini dibangun di atas kerja keras beberapa pihak berikut:

- **Zhaw (Shadiq)** sebagai pembuat script awal bot. Instagram: `mas_ukkantext`, TikTok: `@ravmoise/test`.
- **[Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)** untuk library komunikasi WhatsApp WebSocket.
- **[Axios](https://axios-http.com/)** untuk HTTP client.
- **[Pino](https://github.com/pinojs/pino)** untuk logging.
- Seluruh provider AI (OpenAI, Groq, OpenRouter, dan lainnya) yang menyediakan API kompatibel dengan format OpenAI.

Jika kamu memodifikasi dan merilis ulang proyek ini, mohon tetap mencantumkan kredit ke pembuat asli.
