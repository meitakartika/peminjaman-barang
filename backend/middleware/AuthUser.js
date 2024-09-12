import User from "../models/UserModel.js";

// Middleware untuk memverifikasi apakah pengguna sudah login
export const verifyUser = async(req, res, next) => {
    // Cek apakah userId ada dalam session
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }
    
    // Cari pengguna berdasarkan ID dari session
    const user = await User.findOne({
        where: {
            id: req.session.userId
        }
    });

    // Jika pengguna tidak ditemukan, beri respon error 404
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    
    // Simpan ID dan role pengguna ke dalam request untuk digunakan di middleware atau route berikutnya
    req.userId = user.id;
    req.role = user.role;
    next();  // Lanjutkan ke middleware atau route berikutnya
}

// Middleware untuk membatasi akses hanya untuk admin
export const adminOnly = async(req, res, next) => {
    // Cari pengguna berdasarkan ID dari session
    const user = await User.findOne({
        where: {
            id: req.session.userId
        }
    });

    // Jika pengguna tidak ditemukan, beri respon error 404
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    
    // Cek apakah role pengguna adalah 'admin'
    if (user.role !== "admin") return res.status(403).json({ msg: "Akses terlarang" });
    
    next();  // Lanjutkan ke middleware atau route berikutnya
}