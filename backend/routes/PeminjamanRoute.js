import express from "express";
import {
    getPeminjaman,
    getPeminjamanById,
    createPeminjaman,
    updatePeminjamanStatus,
    deletePeminjaman
} from "../controllers/Peminjaman.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/peminjaman', verifyUser, getPeminjaman);
router.get('/peminjaman/:id', verifyUser, getPeminjamanById);
router.post('/peminjaman', verifyUser, createPeminjaman);
router.patch('/peminjaman/:id/status', verifyUser, updatePeminjamanStatus);
router.delete('/peminjaman/:id', verifyUser, deletePeminjaman);

export default router;