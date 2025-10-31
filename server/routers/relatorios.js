import express from "express";

import { getAvaliacoes, createAvaliacoes } from "../controllers/avaliacaoClientes.js";

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
router.get("/nova_avaliacao", (req,res) => {
    res.render("nova_avaliacao");
});

router.post("/avaliacaoclientes/nova", createAvaliacoes);

export default router;