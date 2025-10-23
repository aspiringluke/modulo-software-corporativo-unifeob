import { conectar } from "../config/connection.js";

export async function getAvaliacoes(req, res)
{
    console.log("entrou aqui");
    const knex = conectar(req.session.usuario, req.session.senha);

    try {
        const results = await knex("avaliacaocliente").select("*");
        
        res.status(200).json(results);
    } catch (error) {
        res.render("relatorios", {erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}