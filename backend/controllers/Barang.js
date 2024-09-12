import Barang from "../models/BarangModel.js";

// Fungsi untuk mendapatkan semua barang
export const getBarang = async(req, res) => {
    try {
        // Mengambil semua barang dengan atribut id, kode, name, stok, dan deskripsi
        const response = await Barang.findAll({
            attributes: ['id', 'kode', 'name', 'stok', 'deskripsi']
        });
        // Kirimkan respons dengan status 200 dan data barang
        res.status(200).json(response);
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 500
        res.status(500).json({msg: error.message});
    }
}

// Fungsi untuk mendapatkan barang berdasarkan ID
export const getBarangById = async(req, res) => {
    try {
        // Mengambil barang berdasarkan ID yang diberikan dalam parameter
        const response = await Barang.findOne({
            attributes: ['id', 'kode', 'name', 'stok', 'deskripsi'],
            where: {
                id: req.params.id
            }
        });
        // Kirimkan respons dengan status 200 dan data barang
        res.status(200).json(response);
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 500
        res.status(500).json({msg: "error.message"});
    }
}

// Fungsi untuk membuat barang baru
export const createBarang = async(req, res) => {
    // Ambil data barang dari body request
    const {kode, name, stok, deskripsi} = req.body;
    try {
        // Buat barang baru dengan data yang diberikan
        await Barang.create({
            kode: kode,
            name: name,
            stok: stok,
            deskripsi: deskripsi
        });
        // Kirimkan respons dengan status 201 jika barang berhasil dibuat
        res.status(201).json({msg: "Barang Created Successfully"});
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 400
        res.status(400).json({msg: "Beberapa field tidak diisi atau format tidak valid. Harap periksa kembali input Anda."});
    }
}

// Fungsi untuk memperbarui barang berdasarkan ID
export const updateBarang = async(req, res) => {
    // Mencari barang berdasarkan ID yang diberikan dalam parameter
    const barang = await Barang.findOne({
        where: {
            id: req.params.id
        }
    });
    // Jika barang tidak ditemukan, kirimkan respons dengan status 404
    if(!barang) return res.status(404).json({msg: "Barang tidak ditemukan"});
    // Ambil data barang dari body request
    const {kode, name, stok, deskripsi} = req.body;
    try {
        // Perbarui data barang yang ditemukan
        await Barang.update({
            kode: kode,
            name: name,
            stok: stok,
            deskripsi: deskripsi
        }, {
            where: {
                id: barang.id
            }
        });
        // Kirimkan respons dengan status 200 jika barang berhasil diperbarui
        res.status(200).json({msg: "Barang Updated"});
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 400
        res.status(400).json({msg: "Format tidak valid. Harap periksa kembali input Anda."});
    }
}

// Fungsi untuk menghapus barang berdasarkan ID
export const deleteBarang = async(req, res) => {
    // Mencari barang berdasarkan ID yang diberikan dalam parameter
    const barang = await Barang.findOne({
        where: {
            id: req.params.id
        }
    });
    // Jika barang tidak ditemukan, kirimkan respons dengan status 404
    if(!barang) return res.status(404).json({msg: "Barang tidak ditemukan"});
    try {
        // Hapus barang yang ditemukan
        await Barang.destroy({
            where: {
                id: barang.id
            }
        });
        // Kirimkan respons dengan status 200 jika barang berhasil dihapus
        res.status(200).json({msg: "Barang Deleted"});
    } catch (error) {
        // Jika terjadi kesalahan, kirimkan respons dengan status 400
        res.status(400).json({msg: error.message});
    }
}