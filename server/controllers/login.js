import { conectar } from "../config/connection.js";
import { getUserRole } from "../models/role.js";
import { encrypt } from "../services/crypto.js";

export async function login(req,res)
{
    let { usuario, senha } = req.body;
    
    try {
        const knex = conectar(usuario, senha);
        await knex.raw("SELECT 1;");
        knex.destroy();

        const roles = await getUserRole(usuario, senha);
        req.session.usuario = usuario;
        req.session.senha = senha;
        req.session.roles = roles;


        // const cript = await encrypt(senha);
        
        // process.env.PSS = cript.criptografado;
        // process.env.KEY = cript.key;
        // process.env.IV = cript.iv;

        // console.log([cript.criptografado, cript.key, cript.iv])
        // console.log([process.env.PSS.byteLength, process.env.KEY.type, process.env.IV]);
        
        res.render("resumos", {usuario: req.session.usuario, roles: req.session.roles});
    } catch(err) {
        res.render("login", {erro: "Usuário ou senha inválidos.", roles: null});
    }
}