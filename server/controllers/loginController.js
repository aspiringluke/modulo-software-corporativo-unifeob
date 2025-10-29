import { conectar } from "../config/connection.js";

export async function login(req,res)
{
    let { usuario, senha } = req.body;
    
    try {
        const knex = conectar(usuario, senha);
        await knex.raw("SELECT 1;");
        knex.destroy();

        req.session.usuario = usuario;
        req.session.senha = senha; // TODO: criptografar a senha
        res.redirect("resumos");
    } catch(err) {
        res.render("login", {erro: "Usuário ou senha inválidos."});
    }
}