# Dokumentasi Perbaikan: Masalah Login Redirect Loop & Loading

## Deskripsi Masalah
Sebelumnya, admin mengalami kendala saat mencoba masuk ke dashboard:
1.  **Redirect Loop**: Setelah memasukkan email dan password yang benar, API mengembalikan status 200 (OK), namun pengguna diarahkan kembali ke halaman `/login` bukannya masuk ke `/admin`.
2.  **Stuck Loading**: Terkadang halaman login tertahan pada status *loading* selamanya setelah menekan tombol "Sign In".

## Analisis Akar Permasalahan (Root Cause)

### 1. Ketidakkonsistenan Nama Cookie (Penyebab Utama Redirect)
Terdapat perbedaan penamaan cookie antara sisi server (API) dan sisi Middleware (Proxy):
*   **API Login (`src/lib/auth.ts`)**: Mengirimkan cookie dengan nama `session_token` (menggunakan *underscore*).
*   **Middleware (`src/proxy.ts`)**: Mengecek keberadaan cookie dengan nama `session-token` (menggunakan *dash*).

Karena Middleware tidak menemukan cookie yang dicarinya, ia menganggap sesi tidak valid dan melakukan redirect kembali ke halaman login, meskipun browser sebenarnya menyimpan cookie sesi yang benar.

### 2. Race Condition pada Browser (Penyebab Stuck Loading)
Penggunaan `router.push('/admin')` pada Next.js melakukan navigasi sisi klien (*soft navigation*). Terkadang, browser belum selesai memproses *header* `Set-Cookie` dari respon API saat halaman dashboard mencoba memvalidasi sesi. Hal ini menyebabkan pengecekan sesi pertama gagal dan menyebabkan aplikasi tertahan pada status loading atau kembali ke login.

## Solusi yang Diimplementasikan

### 1. Sinkronisasi Nama Cookie
Middleware (`src/proxy.ts`) telah diperbarui untuk menggunakan konstanta terpusat `SESSION_COOKIE_NAME` yang didefinisikan di `src/lib/auth.ts`. Ini menjamin konsistensi nama cookie di seluruh lapisan aplikasi.

**Perubahan di `src/proxy.ts`:**
```typescript
import { SESSION_COOKIE_NAME } from '@/lib/auth';

// ...
const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
```

### 2. Full Page Reload setelah Login
Logika pengalihan di halaman login (`src/app/login/page.tsx`) diubah dari `router.push()` menjadi `window.location.href = '/admin'`.

**Alasan:**
*   Memaksa browser memproses seluruh cookie sebelum memuat halaman baru.
*   Menghapus *state* React yang lama untuk memastikan dashboard dimulai dengan data sesi yang segar.
*   Menghilangkan kemungkinan *race condition* saat pengambilan data sesi pertama kali.

## Cara Verifikasi Sesi
Untuk memastikan sistem berjalan dengan benar, Anda dapat mengeceknya melalui Chrome DevTools:
1.  Buka **DevTools (F12)**.
2.  Pindah ke tab **Application**.
3.  Pilih **Cookies** -> `http://localhost:3000`.
4.  Pastikan terdapat cookie bernama `session_token` (bukan `session-token`).
5.  Pastikan flag `HttpOnly` dan `SameSite=Strict` tercentang (untuk keamanan).

## Rekomendasi Pengembangan Masa Depan
*   **Constants over Strings**: Selalu gunakan file konstanta (seperti `auth.ts` atau `env.ts`) untuk nilai-nilai yang digunakan di banyak tempat untuk menghindari *typo* yang sulit dilacak.
*   **Environment Validation**: Pastikan `JWT_SECRET` selalu memenuhi panjang minimum yang ditentukan di `src/env.ts` untuk menghindari error *cryptography*.

---
**Status:** ✅ Teratasi
**Tanggal:** 16 Mei 2026
