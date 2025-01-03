# tender-telescope

Aplikasi quiz belajar bahasa ~asing~ Inggris. Tersedia versi online/web di https://tender-telescope.netlify.app, dan versi offline yang bisa di download di [Github Releases](https://github.com/ahmadyasser72/tender-telescope/releases/latest).

- [Libraries used](#libraries-used)
- [Development](#development)
  - [dev server](#dev-server)
  - [build (web)](#build-web)
  - [build (native)](#build-native)
- [License](#license)

## Libraries used

Aplikasi ini menggunakan beberapa library berikut:

- [Astro](https://astro.build/) sebagai framework web, mengatur routing aplikasi, mengelola data pertanyaan, serta mengambil data gambar dari [API Pixabay](https://pixabay.com/service/about/api/) dan juga suara text-to-speech dari Google Translate (undocumented/unofficial API).
- [Svelte](https://svelte.dev/) sebagai framework UI, agar aplikasi bisa interaktif.
- [tailwindcss](https://tailwindcss.com/) sebagai framework CSS, menggunakan CSS tanpa `<style>`.
- [shadcn/ui](https://next.shadcn-svelte.com/) sebagai komponen UI untuk mempercepat proses development.
- [Tauri](https://tauri.app/) untuk melakukan konversi aplikasi web hasil build **Astro** menjadi aplikasi native yang bisa di install secara langsung.

## Development

Aplikasi ini memerlukan beberapa environment variable yang bisa dilihat pada file [./env.example](./env.example), pada file contoh itu terdapat keterangan bagaimana cara mendapatkannya, digunakan untuk apa, dan apakah variable itu optional atau tidak. Copy file `.env.example` ke `.env` agar nilai yang kamu isi terbaca.

Sebelum melakukan apapun pastikan sudah menginstall dependensi node.

```bash
bun install
```

### dev server

```bash
bun run dev --open
```

### build (web)

```bash
bun run build
```

### build (native)

> [!NOTE]
> Silahkan cek https://tauri.app/start/prerequisites/ untuk mengetahui apa yang diperlukan untuk melakukan build ini.

```bash
cargo tauri build
```

## License

Aplikasi ini dilisensikan di bawah [GNU Affero General Public License v3 (AGPLv3)](https://www.gnu.org/licenses/agpl-3.0.html).

Lisensi ini memastikan aplikasi tetap **open source** dan memberikan kebebasan kepada siapa pun untuk menggunakan, memodifikasi, dan mendistribusikannya. Jika aplikasi ini dimodifikasi dan digunakan secara publik, termasuk di-host di server, source code-nya harus tersedia untuk pengguna sesuai ketentuan AGPLv3.

Untuk detail lebih lanjut, silakan baca [teks lengkap lisensi di sini](https://www.gnu.org/licenses/agpl-3.0.html).
