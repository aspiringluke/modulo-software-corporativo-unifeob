import express from "express";

const router = express.Router();

router.get("/", (req,res) => {
    res.render("config", {usuario: req.session.usuario, roles: req.session.roles});
});

export default router;