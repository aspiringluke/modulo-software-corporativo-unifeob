import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";
import { decrypt } from "../services/crypto.js";

export async function log(req, res) {
    try {
        // const out = req.session.senha;
        // const senha = await decrypt(out.criptografado, out.key, out.iv);
        const senha = await lerCredenciais(req.session.usuario);
        const knex = conectar(req.session.usuario, senha);

        const registro_auditoria_ = await knex('log_auditoria').select("*");
        knex.destroy();
        res.render("auditoria", { registro_auditoria: registro_auditoria_, usuario: req.session.usuario, roles: req.session.roles});

    }catch (err){
        res.render("auditoria", {erro: "Não foi possível renderizar os logs de auditoria!" + err, registro_auditoria: null});
    }
}