import express from "express";

import { conectar } from "../config/connection.js";

const router = express.Router();

router.get("/", (req,res) => {
    res.render("resumos", {usuario: req.session.usuario, roles: req.session.roles});
});


export default router;