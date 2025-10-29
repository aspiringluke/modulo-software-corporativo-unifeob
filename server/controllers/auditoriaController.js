import { conectar } from "../config/connection.js";

export async function log(req, res) {
    try {
        const knex = conectar(req.session.usuario, req.session.senha);

        const registro_auditoria = await knex('log_auditoria').select();
        knex.destroy();
        res.render("auditoria", { registro_auditoria: registro_auditoria});

    }catch (err){
        res.render("auditoria", {erro: "Não foi possível renderizar os logs de auditoria!"});
    }
}