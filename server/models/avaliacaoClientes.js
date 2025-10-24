import { conectar } from "../config/connection.js";

// TODO: Separar o model do controller
export async function getAvaliacoes(req, res)
{
    const knex = conectar(req.session.usuario, req.session.senha);

    try {
        const results = await knex("avaliacaocliente").select("*");
        // quantidade de cada nota
        const quantidadeNotas = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0}
        let notas = results.forEach(n => {
            quantidadeNotas[n.nota.toString()]++;
        });
        
        res.status(200).json(Object.values(quantidadeNotas));
    } catch (error) {
        res.render("relatorios", {erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}