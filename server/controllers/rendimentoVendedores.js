import { conectar } from "../config/connection.js";
import { lerCredenciais } from "./secureStorage.js";

export async function getRendimento(req, res)
{
    const senha = await lerCredenciais(req.session.usuario);
    const knex = conectar(req.session.usuario, senha);

    try {
        const results = await knex("NOME_DA_TABELA").select("*");
        
        //TODO: Lógica interna
        
        res.status(200).json();
    } catch (error) {
        res.render("relatorios", {erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}