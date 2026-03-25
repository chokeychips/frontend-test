# skyworx-test

Dokumentasi proyek _skyworx-test_ (Vue 3 + Vite) untuk pengembang.

## 🧩 Ringkasan Proyek

Aplikasi web menggunakan Vue 3 (Options API / Composition API) + Vite + Tailwind CSS dengan fokus pada manajemen user, otentikasi, dan alur kerja tugas. Struktur modul terbagi menjadi:

- `src/views` : tampilan halaman (Dashboard, Login, menu fungsional)
- `src/components` : UI dan form khusus (Autocomplete, Sidebar, Button, Input, Modal, Table, Textarea)
- `src/services` : pemanggilan API, logika bisnis terpisah (userService, workflowService)
- `src/stores` : state global (auth)
- `src/router` : rute halaman dan proteksi akses

## 🚀 Setup Lingkungan

1. Pasang dependensi

```bash
npm install
```

2. Jalankan mode development

```bash
npm run dev
```

3. Build untuk produksi

```bash
npm run build
```

4. Jalankan linting

```bash
npm run lint
```

## 🧪 Testing End-to-End (Playwright)

```bash
npx playwright install
npm run build
npm run test:e2e
```

## 📁 Struktur Utama Folder

- `src/main.js` : titik masuk (inisialisasi Vue, router, store, style global)
- `src/App.vue` : layout global
- `src/router/index.js` : definisi path dan guard otorisasi
- `src/stores/auth.js` : manajemen state token, user, login/logout
- `src/services/api.js` : instance Axios + interceptors
- `src/services/userService.js` : API user CRUD
- `src/services/workflowService.js` : API maintenance/workflow
- `src/views/LoginView.vue` : form login
- `src/views/DashboardView.vue` : overview aplikasi
- `src/views/menu` : fitur-fitur modul (Approval, Maintenance, MyTask, User)

## 🔐 Otentikasi dan Proteksi Route

- `stores/auth.js` menyediakan:
  - `state.isAuthenticated`
  - `state.user`
  - `actions.login`, `actions.logout`

- `router/index.js` melakukan `beforeEach` guard:
  - Non-`/login` -> cek token dan redirect ke `/login`
  - `/login` saat sudah login -> redirect ke `/`

## 🧩 Detail Modul / Fitur

### 1. Login

- `views/LoginView.vue`
- `components/ui/Input.vue` untuk field
- `services/api.js` + `stores/auth.js` untuk permintaan login
- Handling kesalahan dan loading

### 2. Dashboard

- `views/DashboardView.vue`
- layout panel, ringkasan statistik (jika ada)
- tautan navigasi ke submenu

### 3. Approval

- `views/menu/ApprovalView.vue`
- daftar item pending approval
- aksi `approve` / `reject` memakai `workflowService`

### 4. Maintenance

- `views/menu/MaintenanceView.vue`
- fungsi CRUD data maintenance
- manfaatkan `workflowService` / `userService`

### 5. My Task

- `views/menu/MyTaskView.vue`
- daftar tugas user saat ini
- filter status dan aksi cepat

### 6. User Management

- `views/menu/UserView.vue`
- `components/user/UserForm.vue`, `components/user/UserEditForm.vue`
- operasi create/update/delete user
- validasi input sederhana + notifikasi

## 🛠️ Komponen UI yang Digunakan

- `src/components/Autocomplete.vue` : field dengan saran berbasis teks
- `src/components/Sidebar.vue` : navigasi samping responsif
- `src/components/ui/Button.vue` : button standar semua mode
- `src/components/ui/Input.vue` : input teks / password / select
- `src/components/ui/Modal.vue` : popup konfirmasi / formulir
- `src/components/ui/Table.vue` : tabel data generik
- `src/components/ui/Textarea.vue` : area teks multi-baris

## 🔄 Alur Data dan Logika

- UI memicu aksi komponen (event handler)
- Lalu memanggil service (userService / workflowService)
- Service membuat request via `api.js` (Axios)
- Response disimpan ke store / state lokal
- Store (`auth`) memegang status login dan token

### api.js (Axios global)

- baseURL (ENV)
- interceptor request: berikan `Authorization: Bearer <token>`
- interceptor response: tangani 401 (logout otomatis)

## 🧩 Konfigurasi Penting

- `vite.config.js` : konfigurasi Vite, plugin Vue
- `tailwind.config.js` : theme Tailwind, safelist, responsif
- `postcss.config.js` : postcss + autoprefixer
- `jsconfig.json` : path alias `@` => `src`
- `eslint.config.js` : aturan lint

<<<<<<< HEAD
## 📌 Catatan Pengembangan

- Gunakan format konsisten: camelCase, PascalCase untuk Nama Komponen
- Pisahkan logika API dari komponen UI
- Jika menambahkan fitur baru, update `src/router/index.js` + sidebar navigasi
- Tambah tes E2E untuk alur utama (login, akses dashboard, aksi CRUD)

=======
>>>>>>> fix-dari-detached
## 📦 Deployment

1. `npm run build`
2. Upload folder `dist/` ke server static (Nginx, S3, Netlify, Vercel, dll)
3. Pastikan variable environment API sudah diatur (misalnya `VITE_API_BASE_URL`)

## 📝 Cara Kontribusi

1. Fork repo
2. Buat branch fitur: `feature/<nama-fitur>`
3. Commit jelas + PR deskripsi
4. Lint & test: `npm run lint`, `npm run test:e2e`

---
<<<<<<< HEAD

Dokumentasi disusun fokus kemudahan pembacaan, pemisahan concern setiap modul, dan referensi cepat untuk developer baru. Selamat mengembangkan!
=======
>>>>>>> fix-dari-detached
