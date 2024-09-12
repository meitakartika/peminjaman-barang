# Aplikasi Peminjaman Barang

Aplikasi Peminjaman Barang adalah sistem berbasis web yang memudahkan pengguna dalam melakukan peminjaman dan pengembalian barang secara terorganisir.

## Fitur Aplikasi

- Manajemen Barang: Admin dapat menambah, mengedit, dan menghapus data barang serta memantau stok.
- Peminjaman Barang: Pengguna dapat meminjam barang dengan memilih jumlah, tanggal peminjaman, dan pengembalian.
- Pengembalian Barang: Pengguna dapat mengembalikan barang dengan validasi jumlah dan kondisi barang yang dipinjam.
- Manajemen Pengguna: Admin dapat mengelola pengguna, termasuk menambah, mengedit, dan menghapus data pengguna.
- Manajemen Status: Admin dapat mengubah status peminjaman dari "menunggu" menjadi "disetujui" atau "ditolak."

## Teknologi

Aplikasi Peminjaman Barang menggunakan sejumlah open source untuk berfungsi dengan baik:

- [ReactJS]
- [Redux]  
- [Axios] 
- [Node.js]
- [Express]
- [Sequelize]
- [MySQL]
- [Bootstrap]
- [JSON Web Token (JWT)]
- [Argon2]
- [Moment.js]

## Instalasi

Kloning respositori

```sh
git clone https://github.com/meitakartika/peminjaman-barang.git
```

Instal dependensi

```sh
npm install
```

Siapkan database
```sh
buat database pada MySQL dengan nama "pkl_db"
```

## Cara Menjalankan Aplikasi

- Hidupkan XAMPP MySQL

Backend
```sh
cd backend
nodemon index
```

Database
- Temukan baris kode yang memiliki tanda // pada file index.js yang terletak di folder backend.
- Hapus tanda // sehingga kode menjadi: ```(async () => { await db.sync(); })(); ```
- Simpan perubahan pada file kode.
- Setelah berhasil dijalankan, kembalikan kode seperti semula menjadi: ```// (async () => { await db.sync(); })();```

Frontend
```sh
cd frontend
npm start
```

- Buka browser web dengan URL http://localhost:3000
