import User from "../models/UserModel.js";
import argon2 from "argon2";

// Mendapatkan semua data pengguna
export const getUser = async(req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']  // Ambil id, nama, email, dan role
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Mendapatkan data pengguna berdasarkan ID
export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['id', 'name', 'email', 'role'],  // Ambil id, nama, email, dan role
            where: {
                id: req.params.id  // Cari pengguna dengan ID yang diberikan
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Membuat pengguna baru
export const createUser = async(req, res) => {
    const { name, email, password, role } = req.body;
    const hashPassword = await argon2.hash(password);  // Hash password menggunakan argon2
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: "Beberapa field tidak diisi atau format tidak valid. Harap periksa kembali input Anda." });
    }
}

// Memperbarui data pengguna berdasarkan ID
export const updateUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id  // Cari pengguna dengan ID yang diberikan
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { name, email, password, role } = req.body;
    let hashPassword;
    // Jika password tidak diubah, gunakan password yang lama
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);  // Hash password baru
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id  // Update pengguna dengan ID yang diberikan
            }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: "Format tidak valid. Harap periksa kembali input Anda." });
    }
}

// Menghapus pengguna berdasarkan ID
export const deleteUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id  // Cari pengguna dengan ID yang diberikan
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    try {
        await User.destroy({
            where: {
                id: user.id  // Hapus pengguna dengan ID yang diberikan
            }
        });
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}