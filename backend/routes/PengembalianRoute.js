import express from "express";
import {
    getPengembalian,
    getPengembalianById,
    createPengembalian,
    updatePengembalianStatus,
    deletePengembalian
} from "../controllers/Pengembalian.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pengembalian', verifyUser, getPengembalian);
router.get('/pengembalian/:id', verifyUser, getPengembalianById);
router.post('/pengembalian', verifyUser, createPengembalian);
router.patch('/pengembalian/:id/status', verifyUser, updatePengembalianStatus);
router.delete('/pengembalian/:id', verifyUser, deletePengembalian);

export default router;