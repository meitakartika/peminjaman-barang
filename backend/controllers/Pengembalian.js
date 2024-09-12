import Pengembalian from "../models/PengembalianModel.js";
import User from "../models/UserModel.js";
import Peminjaman from "../models/PeminjamanModel.js";
import Barang from "../models/BarangModel.js";
import { Op } from "sequelize";

// Mendapatkan semua data pengembalian
export const getPengembalian = async (req, res) => {
    try {
        let response;
        // Jika pengguna adalah admin, ambil semua data pengembalian
        if (req.role === "admin") {
            response = await Pengembalian.findAll({
                attributes: ['id', 'tgl_pinjam', 'tgl_kembali', 'qty', 'kondisi', 'status'],
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email']
                }, {
                    model: Barang, 
                    attributes: ['id', 'name', 'kode'] 
                }]
            });
        } else {
            // Jika bukan admin, ambil data pengembalian untuk pengguna saat ini
            response = await Pengembalian.findAll({
                attributes: ['id', 'tgl_pinjam', 'tgl_kembali', 'qty', 'kondisi', 'status'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email']
                }, {
                    model: Barang, 
                    attributes: ['id', 'name', 'kode'] 
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getPengembalian:", error); 
        res.status(500).json({ msg: error.message });
    }
}

// Mendapatkan data pengembalian berdasarkan ID
export const getPengembalianById = async (req, res) => {
    try {
        const pengembalian = await Pengembalian.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }, {
                    model: Barang,
                    attributes: ['id', 'name', 'kode']  
                }]
        });
        if (!pengembalian) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(pengembalian);
    } catch (error) {
        console.error("Error in getPengembalianById:", error);
        res.status(500).json({ msg: error.message });
    }
}

// Membuat data pengembalian
export const createPengembalian = async (req, res) => {
    const { tgl_pinjam, tgl_kembali, qty, kondisi, status, barangId } = req.body;
    try {
        // Cari peminjaman yang sesuai dengan barangId dan status 'disetujui'
        const peminjaman = await Peminjaman.findOne({
            where: {
                barangId: barangId,
                userId: req.userId,
                status: 'disetujui'
            }
        });
        if (!peminjaman) {
            return res.status(400).json({ msg: "Anda belum meminjam barang ini." });
        }
        if (qty > peminjaman.qty) {
            return res.status(400).json({ msg: "Jumlah pengembalian tidak valid." });
        }
        // Simpan data pengembalian
        await Pengembalian.create({
            tgl_pinjam: tgl_pinjam,
            tgl_kembali: tgl_kembali,
            qty: qty,
            kondisi: kondisi,
            status: status,
            barangId: barangId,
            userId: req.userId
        });
        // Jika qty pengembalian sama dengan qty peminjaman, update status peminjaman
        if (qty === peminjaman.qty) {
            await peminjaman.update({ status: 'dikembalikan' });
        }
        res.status(201).json({ msg: "Pengembalian Successfully" });
    } catch (error) {
        console.error("Error in createPengembalian:", error); 
        res.status(500).json({ msg: error.message });
    }
};

// Memperbarui status pengembalian
export const updatePengembalianStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['disetujui'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value' });
    }

    try {
        const pengembalian = await Pengembalian.findOne({ where: { id } });
        if (!pengembalian) return res.status(404).json({ msg: 'Data tidak ditemukan' });

        if (req.role === 'admin') {
            // Update status pengembalian
            await Pengembalian.update({ status }, { where: { id } });

            // Jika disetujui, tambahkan stok barang
            if (status === 'disetujui') {
                const barang = await Barang.findOne({ where: { id: pengembalian.barangId } });
                if (barang) {
                    const newStock = barang.stok + pengembalian.qty;
                    await Barang.update({ stok: newStock }, { where: { id: pengembalian.barangId } });
                }
            }

            return res.status(200).json({ msg: 'Status updated successfully' });
        } else {
            if (pengembalian.userId !== req.userId) return res.status(403).json({ msg: 'Akses terlarang' });
            await Pengembalian.update({ status }, { where: { id, userId: req.userId } });
            return res.status(200).json({ msg: 'Status updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus data pengembalian
export const deletePengembalian = async (req, res) => {
    try {
        const pengembalian = await Pengembalian.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!pengembalian) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Cek status pengembalian dan update status peminjaman jika status pengembalian adalah 'menunggu'
        if (pengembalian.status === 'menunggu') {
            const peminjaman = await Peminjaman.findOne({
                where: {
                    barangId: pengembalian.barangId,
                    userId: pengembalian.userId,
                    status: 'disetujui'
                }
            });
            if (peminjaman) {
                // Update status peminjaman kembali menjadi 'disetujui'
                await peminjaman.update({ status: 'disetujui' });
            }
        }

        // Hapus pengembalian
        if (req.role === "admin") {
            await Pengembalian.destroy({
                where: {
                    id: pengembalian.id
                }
            });
        } else {
            if (req.userId !== pengembalian.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Pengembalian.destroy({
                where: {
                    [Op.and]: [{ id: pengembalian.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Pengembalian Deleted Successfully" });
    } catch (error) {
        console.error("Error in deletePengembalian:", error);
        res.status(500).json({ msg: error.message });
    }
}