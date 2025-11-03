import express from "express";
import { log } from "../controllers/auditoria.js"
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.get("/", checkRole('chefe'), log);

export default router;