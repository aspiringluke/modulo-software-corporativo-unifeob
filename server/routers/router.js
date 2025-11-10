import express from "express";

import loginRouter from './login.js';
import resumosRouter from "./resumos.js";
import relatoriosRouter from "./relatorios.js";
import configRouter from "./config.js";
import auditoriaRouter from "./auditoria.js";
import vendedorRouter from "./vendedores.js";
import produtoRouter from "./produtos.js";

const router = express.Router();

router.use("/resumos", resumosRouter);
router.use("/relatorios", relatoriosRouter);
router.use("/config", configRouter);
router.use("/auditoria", auditoriaRouter);
router.use("/vendedores", vendedorRouter);
router.use("/produtos", produtoRouter);

router.use("/", loginRouter);
router.use("/login", loginRouter);

export default router;