import express from "express";

import { getAvaliacoesAtendimento, getAvaliacoesProdutos, createAvaliacoes, getAvaliacoesVendedores } from "../controllers/avaliacaoClientes.js";

const router = express.Router();

/**
 * GET / -> render
 * GET /avaliacaoclientes -> recupera as avaliações dos clientes
 * GET /rendimento -> recupera o rendimento dos vendedores
 */

router.get("/", (req,res) => {
    res.render("relatorios", {usuario: req.session.usuario, roles: req.session.roles});
});

// router.get("/avaliacaoclientes", getAvaliacoes);
router.get("/avaliacaoclientes/atendimento", getAvaliacoesAtendimento);
router.get("/avaliacaoclientes/produtos", getAvaliacoesProdutos);
router.get("/avaliacaoclientes/vendedores", getAvaliacoesVendedores);

router.get("/nova_avaliacao", (req,res) => {
    res.render("nova_avaliacao");
});

router.post("/avaliacaoclientes/nova", createAvaliacoes);

export default router;