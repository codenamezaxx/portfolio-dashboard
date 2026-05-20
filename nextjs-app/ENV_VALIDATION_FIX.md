# Dokumentasi Perbaikan: Runtime Error "supabaseUrl is required"

## Deskripsi Masalah
Saat mengakses halaman manajemen konten (Hero, Projects, Achievements), aplikasi mengalami *crash* di browser dengan pesan error:
`Uncaught Error: supabaseUrl is required`

Error ini terjadi saat inisialisasi Supabase Client pada sisi klien (browser), meskipun variabel tersebut sudah didefinisikan di file `.env.local`.

## Analisis Akar Permasalahan (Root Cause)

### Mekanisme Inlining Next.js
Next.js memiliki perilaku khusus dalam menangani variabel lingkungan:
1.  Variabel yang diawali dengan `NEXT_PUBLIC_` akan dikirim ke browser.
2.  **PENTING**: Next.js tidak mengirimkan seluruh objek `process.env` ke browser. Sebaliknya, ia mencari referensi literal seperti `process.env.NEXT_PUBLIC_VAR` di dalam kode dan menggantinya secara statis (*inlining*) dengan nilai aslinya saat proses build/bundling.

### Kegagalan Validasi Zod sebelumnya
Pada implementasi awal di `src/env.ts`, kode mencoba memvalidasi lingkungan dengan cara:
```typescript
const parsed = envSchema.safeParse(process.env); // GAGAL DI KLIEN
```
Di browser, `process.env` hanyalah objek kosong atau tidak lengkap. Karena kunci-kunci seperti `NEXT_PUBLIC_SUPABASE_URL` tidak dipanggil secara eksplisit (literal), Next.js tidak melakukan *inlining*, sehingga Zod menganggap variabel tersebut tidak ada (*undefined*).

## Solusi yang Diimplementasikan

### 1. Perbaikan Logika Validasi (`src/env.ts`)
Fungsi `validateEnv` diperbarui untuk membedakan antara lingkungan server dan klien. Di sisi klien, kita sekarang membuat objek perantara secara eksplisit:

```typescript
if (!isServer) {
  const clientValues = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
  const parsedClient = clientSchema.safeParse(clientValues);
  // ...
}
```
Dengan menuliskan `process.env.NEXT_PUBLIC_...` secara lengkap, Next.js berhasil mengenali dan memasukkan nilainya ke dalam bundle browser.

### 2. Safety Guard pada Inisialisasi Client (`src/lib/storage.ts`)
Untuk mencegah aplikasi mati total jika variabel tetap hilang, ditambahkan pengecekan sebelum `createClient` dipanggil:

```typescript
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase client initialization failed: Missing environment variables.');
}

export const supabaseStorage = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || '',
  // ...
);
```

## Tips Menghindari Masalah Serupa
*   **Jangan gunakan destrukturisasi**: Hindari `const { VAR } = process.env` di komponen klien; selalu gunakan nama lengkap `process.env.VAR`.
*   **Restart Server**: Setiap kali mengubah file `.env.local`, Anda **wajib** menghentikan dan menjalankan kembali `npm run dev`.
*   **Gunakan Browser Console**: Jika muncul error validasi, cek tab *Console* di browser untuk melihat detail field mana yang gagal divalidasi oleh Zod.

---
**Status:** ✅ Teratasi
**Komponen Terdampak:** `env.ts`, `storage.ts`, `createClient`
