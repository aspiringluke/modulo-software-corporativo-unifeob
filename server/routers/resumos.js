import express from "express";

const router = express.Router();

router.get("/", (req,res) => {
    res.render("resumos");
});

export default router;