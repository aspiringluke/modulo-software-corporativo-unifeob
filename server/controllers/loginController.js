import { conectar } from "../config/connection.js";

export async function login(req,res)
{
    let { usuario, senha } = req.body;
    
    try {
        const knex = conectar(usuario, senha);
        await knex.raw("SELECT 1;");
        
        knex.destroy();
        res.redirect("../resumos");
    } catch(err) {
        console.log(err);
        res.render("login", {erro: "Usuário ou senha inválidos."});
    }
}