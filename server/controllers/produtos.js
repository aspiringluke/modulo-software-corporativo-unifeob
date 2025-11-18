import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";

export async function selectAll(req,res)
{
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);
    
    try {
        const results = await knex("produto").select(["idproduto", "descricao"]);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({usuario: req.session.usuario, roles: req.session.roles, erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}