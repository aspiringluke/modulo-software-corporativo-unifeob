import express from "express";

const router = express.Router();

router.get("/produtos", (req,res) => {
    res.render("descricaoProduto");
});

export default router;