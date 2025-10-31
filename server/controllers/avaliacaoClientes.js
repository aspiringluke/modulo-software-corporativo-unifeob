import { conectar } from "../config/connection.js";

// TODO: Separar o model do controller
export async function getAvaliacoes(req, res)
{
    const knex = conectar(req.session.usuario, req.session.senha);

    try {
        const results = await knex("avaliacaocliente").select("*");
        // quantidade de cada nota
        const quantidadeNotasVendas = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0}
        const quantidadeNotasProdutos = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0}
        const quantidadeNotasAtendimento = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0}
        let notas = results.forEach(n => {
            // 1: Vendas
            // 2: Produtos
            // 3: Atendimento
            if(n.tag === 1) quantidadeNotasVendas[n.nota.toString()]++;
            if(n.tag === 2) quantidadeNotasProdutos[n.nota.toString()]++;
            if(n.tag === 3) quantidadeNotasAtendimento[n.nota.toString()]++;
        });

        res.status(200).json({
            "vendas": Object.values(quantidadeNotasVendas),
            "produtos": Object.values(quantidadeNotasProdutos),
            "atendimento": Object.values(quantidadeNotasAtendimento)
        });
    } catch (error) {
        res.render("relatorios", {erro: "Houve um problema ao conectar com o banco de dados: " + error});
    } finally {
        knex.destroy();
    }
}

export async function createAvaliacoes(req, res)
{
    const knex = conectar(req.session.usuario, req.session.senha);

    try {
        console.log(req.body)
        const { nota, dataavaliacao, idcliente, tag, descricao } = req.body;

        const novaAvaliacao = {
            nota: parseInt(nota, 10),
            dataavaliacao: dataavaliacao,
            idcliente: parseInt(idcliente, 10),
            tag: parseInt(tag, 10),
            descricao: descricao
        };

        await knex("avaliacaocliente").insert(novaAvaliacao);

        res.redirect('http://localhost:4040/relatorios');
    } catch (error) {
        res.render("nova_avaliacao", { erro: "Houve um problema ao salvar a avaliação: " + error.message });
    } finally {
        knex.destroy();
    }
}
