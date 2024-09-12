import express from "express";
import {
    getBarang,
    getBarangById,
    createBarang,
    updateBarang, 
    deleteBarang
} from "../controllers/Barang.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/barang', verifyUser, getBarang);
router.get('/barang/:id', verifyUser, getBarangById);
router.post('/barang', verifyUser, adminOnly, createBarang);
router.patch('/barang/:id', verifyUser, adminOnly, updateBarang);
router.delete('/barang/:id', verifyUser, adminOnly, deleteBarang);

export default router;