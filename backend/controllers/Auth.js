import User from "../models/UserModel.js";
import argon2 from "argon2";

// Fungsi untuk login pengguna
export const Login = async(req, res) => {
    // Mencari pengguna berdasarkan email yang dikirim dalam body request
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    // Jika pengguna tidak ditemukan, kirimkan respons dengan status 404
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    // Verifikasi password yang dikirim dengan password yang disimpan menggunakan argon2
    const match = await argon2.verify(user.password, req.body.password);
    // Jika password tidak cocok, kirimkan respons dengan status 400
    if(!match) return res.status(400).json({msg: "Wrong Password"});
    // Jika password cocok, simpan ID pengguna dalam session
    req.session.userId = user.id;
    // Ambil informasi nama, email, dan role pengguna
    const name = user.name;
    const email = user.email;
    const role = user.role;
    // Kirimkan respons dengan status 200 dan informasi pengguna
    res.status(200).json({name, email, role});
}

// Fungsi untuk mendapatkan data pengguna yang sedang login
export const Me = async(req, res) => {
    // Jika session userId tidak ada, kirimkan respons dengan status 401
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    // Mencari pengguna berdasarkan ID yang ada di session
    const user = await User.findOne({
        attributes: ['name', 'email', 'role'],
        where: {
            id: req.session.userId
        }
    });
    // Jika pengguna tidak ditemukan, kirimkan respons dengan status 404
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    // Kirimkan respons dengan status 200 dan informasi pengguna
    res.status(200).json(user);
}

// Fungsi untuk logout pengguna
export const logOut = (req, res) => {
    // Hapus session pengguna
    req.session.destroy((err) => {
        // Jika terjadi kesalahan saat menghapus session, kirimkan respons dengan status 400
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        // Kirimkan respons dengan status 200 jika logout berhasil
        res.status(200).json({msg: "Anda telah logout"});
    });
}