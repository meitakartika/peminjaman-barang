import Peminjaman from "../models/PeminjamanModel.js";
import User from "../models/UserModel.js";
import Barang from "../models/BarangModel.js";
import { Op } from "sequelize";

// Fungsi untuk mendapatkan semua peminjaman
export const getPeminjaman = async(req, res) => {
    try {
        let response;
        // Jika role pengguna adalah admin, ambil semua data peminjaman
        if (req.role === "admin") {
            response = await Peminjaman.findAll({
                attributes: ['id', 'tglPinjam', 'tglKembali', 'qty', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Barang,
                        attributes: ['id', 'name', 'kode', 'deskripsi'] 
                    }
                ]
            });
        } else {
            // Jika bukan admin, ambil data peminjaman berdasarkan userId
            response = await Peminjaman.findAll({
                attributes: ['id', 'tglPinjam', 'tglKembali', 'qty', 'status'],
                where: {
                    userId: req.userId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Barang,
                        attributes: ['id', 'name', 'kode', 'deskripsi']
                    }
                ]
            });
        }
        // Kirimkan respons dengan status 200 dan data peminjaman
        res.status(200).json(response);
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 500
        res.status(500).json({ msg: error.message });
    }
}

// Fungsi untuk mendapatkan peminjaman berdasarkan ID
export const getPeminjamanById = async(req, res) => {
    try {
        // Mengambil data peminjaman berdasarkan ID
        const peminjaman = await Peminjaman.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Barang,
                    attributes: ['id', 'name', 'kode', 'deskripsi']
                }
            ]
        });
        // Jika peminjaman tidak ditemukan, kirimkan respons dengan status 404
        if (!peminjaman) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Kirimkan respons dengan status 200 dan data peminjaman
        res.status(200).json(peminjaman);
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 500
        res.status(500).json({ msg: error.message });
    }
}

// Fungsi untuk membuat peminjaman baru
export const createPeminjaman = async(req, res) => {
    const { tglPinjam, tglKembali, qty, barangId } = req.body; // Ambil data dari body request
    console.log('Creating Peminjaman with:', { tglPinjam, tglKembali, qty, barangId });

    const status = req.body.status || 'menunggu'; // Set status default

    try {
        // Cari barang berdasarkan barangId
        const barang = await Barang.findOne({ where: { id: barangId } });
        if (!barang) {
            return res.status(404).json({ msg: "Barang tidak ditemukan" });
        }

        // Cek apakah qty melebihi stok yang tersedia
        if (qty > barang.stok) {
            return res.status(400).json({ msg: "Jumlah pinjaman melebihi stok yang tersedia" });
        }

        // Simpan data peminjaman
        await Peminjaman.create({
            tglPinjam: tglPinjam,
            tglKembali: tglKembali,
            qty: qty,
            status: status,
            barangId: barangId,
            userId: req.userId
        });

        // Kurangi stok barang setelah peminjaman disimpan
        barang.stok -= qty;
        await barang.save();
        res.status(201).json({ msg: "Peminjaman Created Successfully" });
    } catch (error) {
        console.error("Error creating peminjaman:", error);
        res.status(500).json({ msg: error.message });
    }
};

// Fungsi untuk memperbarui status peminjaman
export const updatePeminjamanStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi nilai status
    if (!['disetujui', 'ditolak', 'dikembalikan'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value' });
    }

    try {
        const peminjaman = await Peminjaman.findOne({ where: { id } });
        if (!peminjaman) return res.status(404).json({ msg: 'Data tidak ditemukan' });

        // Jika role adalah admin
        if (req.role === 'admin') {
            // Update status peminjaman
            await Peminjaman.update({ status }, { where: { id } });

            // Jika status disetujui, kurangi stok barang
            if (status === 'disetujui') {
                const barang = await Barang.findOne({ where: { id: peminjaman.barangId } });
                if (barang) {
                    const newStock = barang.stok - peminjaman.qty;
                    if (newStock < 0) return res.status(400).json({ msg: 'Stok barang tidak cukup' });
                    await Barang.update({ stok: newStock }, { where: { id: peminjaman.barangId } });
                }
            }

            // Jika status ditolak, kembalikan stok barang
            if (status === 'ditolak') {
                const barang = await Barang.findOne({ where: { id: peminjaman.barangId } });
                if (barang) {
                    const restoredStock = barang.stok + peminjaman.qty;
                    await Barang.update({ stok: restoredStock }, { where: { id: peminjaman.barangId } });
                }
            }

            return res.status(200).json({ msg: 'Status updated successfully' });
        } else {
            // Jika bukan admin, pastikan peminjaman milik pengguna
            if (peminjaman.userId !== req.userId) return res.status(403).json({ msg: 'Akses terlarang' });
            await Peminjaman.update({ status }, { where: { id, userId: req.userId } });
            return res.status(200).json({ msg: 'Status updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Fungsi untuk menghapus peminjaman
export const deletePeminjaman = async (req, res) => {
    try {
        const peminjaman = await Peminjaman.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!peminjaman) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Kembalikan stok jika status peminjaman adalah 'menunggu'
        if (peminjaman.status === 'menunggu') {
            const barang = await Barang.findOne({ where: { id: peminjaman.barangId } });
            if (barang) {
                // Tambahkan kembali stok barang
                barang.stok += peminjaman.qty;
                await barang.save();
            }
        }

        // Hapus peminjaman sesuai dengan role pengguna
        if (req.role === "admin") {
            await Peminjaman.destroy({
                where: {
                    id: peminjaman.id
                }
            });
        } else {
            if (req.userId !== peminjaman.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Peminjaman.destroy({
                where: {
                    [Op.and]: [{ id: peminjaman.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Peminjaman Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}