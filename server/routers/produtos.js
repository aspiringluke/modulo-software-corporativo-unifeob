import express from "express";

import { selectAll } from "../controllers/produtos.js";

const router = express.Router();

router.get("/", selectAll);

export default router;