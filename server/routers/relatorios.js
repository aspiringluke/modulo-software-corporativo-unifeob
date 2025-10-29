import express from "express";

import { getAvaliacoes } from "../models/avaliacaoClientes.js";

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

export default router;