import express from "express";

const router = express.Router();

router.get("/produtos", (req,res) => {
    res.render("descricaoProduto", {usuario: req.session.usuario, roles: req.session.roles});
});

export default router;