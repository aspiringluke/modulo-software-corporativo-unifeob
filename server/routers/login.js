import express from "express";

const router = express.Router();

router.get("/", (req,res) => {
    res.render('login');
});

router.post("/login", (req,res) => {
    res.redirect("resumos");
});

export default router;