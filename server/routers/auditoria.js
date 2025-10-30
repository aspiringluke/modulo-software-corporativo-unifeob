import express from "express";
import { log } from "../controllers/auditoria.js"

const router = express.Router();

router.get("/", log);

export default router;