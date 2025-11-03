import express from "express";

const router = express.Router();

router.get("/", (req,res) => {
    res.render("config", {roles: req.session.roles});
});

export default router;