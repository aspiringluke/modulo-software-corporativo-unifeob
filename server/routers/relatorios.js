import express from "express";

import { getAvaliacoes } from "../controllers/avaliacaoClientes.js";
import { getRendimento } from "../controllers/rendimentoVendedores.js"

const router = express.Router();

/**
 * GET / -> render
 * GET /avaliacaoclientes -> recupera as avaliações dos clientes
 * GET /rendimento -> recupera o rendimento dos vendedores
 */

router.get("/", (req,res) => {
    res.render("relatorios");
});

router.get("/avaliacaoclientes", getAvaliacoes);
router.get("/rendimentovendedores", getRendimento);

export default router;