import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";

export async function selectAll(req,res)
{
    try {
        const senha = await lerCredenciais(req.session.usuario);
        const knex = conectar(req.session.usuario, senha);

        const results = await knex("produto").select(["idproduto", "descricao"]);

        res.status(200).json(results);
    } catch (error) {
        console.clear();
        console.log(error);
        res.render("relatorios", {usuario: req.session.usuario, roles: req.session.roles, erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}