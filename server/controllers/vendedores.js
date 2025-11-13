import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";

export async function selectAll(req, res)
{
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const results = await knex("vendedor").select(["idvendedor", "nome"]);
        
        res.status(200).json(results);
    } catch (error) {
        res.render("relatorios", {usuario: req.session.usuario, roles: req.session.roles, erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}