import { conectar } from "../config/connection.js";
import { getUserRole } from "../models/role.js";
import { salvarCredenciais, lerCredenciais } from "./secureStorage.js";
import { encrypt } from "../services/crypto.js";

export async function login(req,res)
{
    let { usuario, senha } = req.body;
    
    try {
        if (typeof senha !== "string" || senha.trim() === "") {
            return res.render("login", { erro: "Senha não informada.", roles: null });
        }
        
        const knex = conectar(usuario, senha);
        await knex.raw("SELECT 1;");
        knex.destroy();

        const roles = await getUserRole(usuario, senha);
        await salvarCredenciais(usuario, senha);

        req.session.usuario = usuario;
        req.session.roles = roles;

        res.render("relatorios", {usuario: req.session.usuario, roles: req.session.roles});
    } catch(err) {
        res.render("login", {erro: "Usuário ou senha inválidos.", roles: null});
    }
}