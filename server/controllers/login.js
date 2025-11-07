import { conectar } from "../config/connection.js";
import { getUserRole } from "../models/role.js";
import { salvarCredenciais, lerCredenciais } from "./secureStorage.js";
import { encrypt } from "../services/crypto.js";

export async function login(req,res)
{
    let { usuario, senha } = req.body;
    
    try {
        if (!senha || typeof senha !== "string" || senha.trim() === "") {
            const senhaSalva = await lerCredenciais(usuario);

            if (senhaSalva && typeof senhaSalva === "string" && senhaSalva.trim() !== "") {
                senha = senhaSalva;
                senha = senha.trim();
            } else {
                return res.render("login", { erro: "Senha não informada.", roles: null });
            }
        }

        const knex = conectar(usuario, senha);
        await knex.raw("SELECT 1;");
        knex.destroy();

        const roles = await getUserRole(usuario, senha);
        await salvarCredenciais(usuario, senha);

        req.session.usuario = usuario;
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